import { d1 } from './d1.js';

/**
 * Cloudflare D1 SQL Schema Definitions
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
      theme_preference TEXT NOT NULL DEFAULT 'light',
      selected_goal TEXT NOT NULL DEFAULT 'maintenance',
      target_goal_weight REAL,
      is_setup_complete INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `,
};

export const SCHEMA_MIGRATIONS = [
  `ALTER TABLE user_profiles ADD COLUMN theme_preference TEXT NOT NULL DEFAULT 'light';`,
  `ALTER TABLE user_profiles ADD COLUMN selected_goal TEXT NOT NULL DEFAULT 'maintenance';`,
  `ALTER TABLE user_profiles ADD COLUMN target_goal_weight REAL;`,
];

let isSchemaSynchronized = false;

/**
 * Self-healing schema engine.
 * Automatically verifies tables and runs incremental column additions.
 */
export const ensureDatabaseSchema = async (force: boolean = false): Promise<void> => {
  if ((isSchemaSynchronized && !force) || !d1.isConfigured()) return;

  try {
    // 1. Create missing base tables
    for (const [, sql] of Object.entries(SCHEMAS)) {
      await d1.execute(sql);
    }

    // 2. Safely apply column expansions if migrating existing tables
    for (const sql of SCHEMA_MIGRATIONS) {
      try {
        await d1.execute(sql);
      } catch {
        // Ignored if column already exists in SQLite
      }
    }

    isSchemaSynchronized = true;
  } catch (error) {
    console.error('Self-healing schema initialization failed:', error);
  }
};
