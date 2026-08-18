require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db(); // defaults to database in URI
    console.log('✅ Connected to MongoDB');
  }
  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

module.exports = { connectDB, getDB };
