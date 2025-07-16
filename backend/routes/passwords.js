const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDb } = require('../config/db');
const authenticateToken = require('../middleware/auth');

const checkDatabaseConnection = (req, res, next) => {
    try {
        getDb();
        next();
    }
    catch (error) {
        return res.status(503).json({ error: 'Database not connected. Try again later.' });
    }
}

router.use(checkDatabaseConnection);
router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { collection } = getDb();
    const passwords = await collection.find({ userId: req.user.userId }).toArray();
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch passwords' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { site, username, password } = req.body;
    const { collection } = getDb();

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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { collection } = getDb();
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID format" });

    await collection.deleteOne({ _id: new ObjectId(id), userId: req.user.userId });
    const updatedPasswords = await collection.find({ userId: req.user.userId }).toArray();
    res.json(updatedPasswords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete password entry' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password } = req.body;
    const { collection } = getDb();

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

module.exports = router;
