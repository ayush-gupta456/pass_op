const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getDb } = require('../config/db');
const { sendEmail, isValidEmail, isValidUsername } = require('../utils/email');

const checkDatabaseConnection = (req, res, next) => {
    try {
        getDb();
        next();
    }
    catch (error) {
        return res.status(503).json({ error: 'Database not connected. Try again later.' });
    }
}

router.post('/register', checkDatabaseConnection, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { usersCollection } = getDb();

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (!isValidUsername(username)) {
      return res.status(400).json({ error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUsername = await usersCollection.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username is already taken. Please choose a different username.' });
    }

    const existingEmail = await usersCollection.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email is already registered. Please use a different email or try logging in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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

router.post('/login', checkDatabaseConnection, async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const { usersCollection } = getDb();

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    const user = await usersCollection.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

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

router.post('/forgot-password', checkDatabaseConnection, async (req, res) => {
    try {
      const { email } = req.body;
      const { usersCollection } = getDb();

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
      }

      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = Date.now() + 3600000; // 1 hour

      await usersCollection.updateOne({ email }, { $set: { resetToken: token, resetTokenExpiration: tokenExpiration } });

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

  router.post('/reset-password', checkDatabaseConnection, async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const { usersCollection } = getDb();

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

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await usersCollection.updateOne({ resetToken: token }, { $set: { password: hashedPassword, resetToken: null, resetTokenExpiration: null } });

      res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  });

module.exports = router;
