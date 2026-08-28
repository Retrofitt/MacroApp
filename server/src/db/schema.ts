import { d1 } from './d1.js';

/**
 * Cloudflare D1 SQL Schema Definitions
 * Add new table definitions, columns, or indexes here for future phases.
 */
export const SCHEMAS = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `,
  userProfiles: `
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      biological_sex TEXT NOT NULL DEFAULT 'male',
      age INTEGER NOT NULL DEFAULT 25,
      height_cm REAL NOT NULL DEFAULT 178,
      weight_kg REAL NOT NULL DEFAULT 78,
      body_fat_percentage REAL,
      activity_level TEXT NOT NULL DEFAULT 'moderately_active',
      unit_preference TEXT NOT NULL DEFAULT 'imperial',
      is_setup_complete INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `,
  // Future Phase Schemas can be added here cleanly:
  // foodLogs: `CREATE TABLE IF NOT EXISTS food_logs (...);`,
  // weightHistory: `CREATE TABLE IF NOT EXISTS weight_history (...);`,
};

let isSchemaSynchronized = false;

/**
 * Self-healing schema engine.
 * Automatically verifies and provisions missing tables on first query.
 */
export const ensureDatabaseSchema = async (force: boolean = false): Promise<void> => {
  if ((isSchemaSynchronized && !force) || !d1.isConfigured()) return;

  try {
    for (const [tableName, sql] of Object.entries(SCHEMAS)) {
      await d1.execute(sql);
    }
    isSchemaSynchronized = true;
  } catch (error) {
    console.error('Self-healing schema initialization failed:', error);
  }
};
