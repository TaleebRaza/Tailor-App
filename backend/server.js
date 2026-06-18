// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware
app.use(cors());
// Increased limit to 10mb so large databases don't get rejected
app.use(express.json({ limit: '10mb' })); 

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const API_KEY = process.env.API_KEY || 'TAILOR_BACKUP_KEY_2026';

let client;

// Lazy-load database connection
async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('🔗 Connected to MongoDB Atlas');
  }
  // This will automatically create a database named 'tailorApp'
  return client.db('tailorApp'); 
}

// ---------------------------------------------------------
// POST /api/backup 
// Receives the local SQLite dump and saves it to MongoDB
// ---------------------------------------------------------
app.post('/api/backup', async (req, res) => {
  // 1. Verify API Key
  const authHeader = req.headers['x-api-key'];
  if (authHeader !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized request.' });
  }

  // 2. Validate Payload
  const { appId, payload } = req.body;
  if (!appId || !payload) {
    return res.status(400).json({ error: 'Missing appId or payload.' });
  }

  try {
    const db = await connectDB();
    const collection = db.collection('backups');

    // 3. Upsert into MongoDB
    // If appId exists, replace the payload. If it doesn't, create it.
    await collection.updateOne(
      { appId },
      { 
        $set: { 
          payload, 
          lastBackupAt: new Date() 
        } 
      },
      { upsert: true }
    );

    res.status(200).json({ success: true, message: 'Backup saved successfully.' });
  } catch (error) {
    console.error('❌ Backup Error:', error);
    res.status(500).json({ error: 'Failed to save backup to database.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================`);
  console.log(`☁️  Tailor Backup API running on port ${PORT}`);
  console.log(`=======================================`);
  
  if (!MONGO_URI || MONGO_URI.includes('<username>')) {
    console.warn('\n⚠️  WARNING: You need to set a valid MONGO_URI in backend/.env!');
  }
});