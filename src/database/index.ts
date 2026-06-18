// src/database/index.ts
import { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase) {
  try {
    // WAL mode drastically improves read/write speeds and prevents corruption on budget Androids
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        measurements TEXT NOT NULL, -- Stored as a JSON string for maximum flexibility
        created_at INTEGER DEFAULT (cast(strftime('%s','now') as int))
      );

      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        status TEXT NOT NULL, -- 'pending' or 'completed'
        due_date INTEGER,
        FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS used_codes (
        code TEXT PRIMARY KEY,
        redeemed_at INTEGER DEFAULT (cast(strftime('%s','now') as int))
      );
    `);
    
    console.log('✅ Local SQLite Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error; // We want to throw here so the app knows not to proceed without DB access
  }
}