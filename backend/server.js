const express = require('express');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Global variables
let db; // MongoDB database instance
let collection; // 'passwords' collection
let usersCollection; // 'users' collection
let client; // MongoDB client

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// FOR LOCAL DEVELOPMENT - Update for deployment

// Allow both Netlify and Render frontend origins
const allowedOrigins = [
  'https://passmongoop.netlify.app',
  'https://pass-op-dkz6.onrender.com'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Connects to the MongoDB database using the URI from the environment variables.
 */
async function connectToDatabase() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not defined in .env");

    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    db = client.db();
    collection = db.collection('passwords');
    usersCollection = db.collection('users');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
}
connectToDatabase();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a username.
 * @param {string} username - The username to validate.
 * @returns {boolean} - True if the username is valid, false otherwise.
 */
function isValidUsername(username) {
  // Username: 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Sends an email using Nodemailer.
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} html - The HTML content of the email.
 * @returns {Promise<boolean>} - True if the email was sent successfully, false otherwise.
 */
async function sendEmail(to, subject, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

/**
 * Middleware to check if the database is connected.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function checkDatabaseConnection(req, res, next) {
  if (!client || !db || !collection || !usersCollection) {
    return res.status(503).json({ error: 'Database not connected. Try again later.' });
  }
  next();
}

/**
 * Middleware to authenticate a JWT token.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Routes
app.get('/api/health', (req, res) => {
  const dbStatus = client && db && collection ? 'connected' : 'disconnected';
  res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime(), database: dbStatus });
});

// Authentication routes
app.post('/api/auth/register', checkDatabaseConnection, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Validate username format
    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if username already exists
    const existingUsername = await usersCollection.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username is already taken. Please choose a different username.' });
    }

    // Check if email already exists
    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email is already registered. Please use a different email or try logging in.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = {
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      isEmailVerified: false
    };

    await usersCollection.insertOne(user);
    res.status(201).json({ message: 'User registered successfully! You can now log in.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', checkDatabaseConnection, async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    // Find user by email or username
    const user = await usersCollection.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/passwords', checkDatabaseConnection, authenticateToken, async (req, res) => {
  try {
    const passwords = await collection.find({ userId: req.user.userId }).toArray();
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch passwords' });
  }
});

app.post('/api/passwords', checkDatabaseConnection, authenticateToken, async (req, res) => {
  try {
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res.status(400).json({ error: "Site, Username, and Password are required" });
    }

    const passwordEntry = {
      site: site.trim(),
      username: username.trim(),
      password,
      userId: req.user.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await collection.insertOne(passwordEntry);
    const updatedPasswords = await collection.find({ userId: req.user.userId }).toArray();
    res.status(201).json(updatedPasswords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create password entry' });
  }
});

app.delete('/api/passwords/:id', checkDatabaseConnection, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID format" });

    await collection.deleteOne({ _id: new ObjectId(id), userId: req.user.userId });
    const updatedPasswords = await collection.find({ userId: req.user.userId }).toArray();
    res.json(updatedPasswords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete password entry' });
  }
});

app.put('/api/passwords/:id', checkDatabaseConnection, authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password } = req.body;

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid ID format' });

    const updateData = {
      site: site.trim(),
      username: username.trim(),
      password,
      updatedAt: new Date()
    };

    await collection.updateOne({ _id: new ObjectId(id), userId: req.user.userId }, { $set: updateData });
    const updatedPasswords = await collection.find({ userId: req.user.userId }).toArray();
    res.json(updatedPasswords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password entry' });
  }
});

// Forgot password
app.post('/api/auth/forgot-password', checkDatabaseConnection, async (req, res) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create password reset token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000; // 1 hour

    // Update user with reset token and expiration
    await usersCollection.updateOne({ email }, { $set: { resetToken: token, resetTokenExpiration: tokenExpiration } });

    // Send password reset email
    const emailSent = await sendEmail(email, 'Password Reset', `<p>You requested to reset your password. Click <a href="https://passmongoop.netlify.app/reset-password?token=${token}">here</a> to reset it.</p>`);

    if (emailSent) {
      res.json({ message: 'Password reset email sent. Please check your inbox.' });
    } else {
      res.status(500).json({ error: 'Failed to send password reset email. Try again later.' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process forgot password request' });
  }
});

app.post('/api/auth/reset-password', checkDatabaseConnection, async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await usersCollection.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token. Please request a new password reset.' });
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await usersCollection.updateOne({ resetToken: token }, { $set: { password: hashedPassword, resetToken: null, resetTokenExpiration: null } });

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server safely
let server;
try {
  server = app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
} catch (err) {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error('❌ Server error:', err);
  }
}

// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, async () => {
    console.log(`${signal} received, shutting down...`);
    server?.close(async () => {
      await client?.close();
      console.log('✅ Server and DB connections closed.');
      process.exit(0);
    });
  });
});
