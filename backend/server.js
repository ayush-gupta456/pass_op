const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectToDatabase, getDb } = require('./config/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/passwords', require('./routes/passwords'));

app.get('/api/health', (req, res) => {
    const { client } = getDb();
    const dbStatus = client && client.topology.isConnected() ? 'connected' : 'disconnected';
    res.json({ status: 'OK', timestamp: new Date().toISOString(), uptime: process.uptime(), database: dbStatus });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server safely
let server;
const startServer = async () => {
    await connectToDatabase();
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
}

startServer();


// Graceful shutdown
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, async () => {
    console.log(`${signal} received, shutting down...`);
    const { client } = getDb();
    server?.close(async () => {
      await client?.close();
      console.log('✅ Server and DB connections closed.');
      process.exit(0);
    });
  });
});
