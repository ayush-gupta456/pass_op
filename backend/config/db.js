const { MongoClient } = require('mongodb');

let db;
let collection;
let usersCollection;
let client;

const connectToDatabase = async () => {
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
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not connected');
    }
    return { db, collection, usersCollection, client };
}

module.exports = { connectToDatabase, getDb };
