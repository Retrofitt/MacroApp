import { d1 } from './d1.js';

export interface Migration {
  id: string;
  sql: string;
}

/**
 * Sequential idempotent schema migrations.
 * New tables and schema expansions for future phases (food logs, barcode items, weigh-ins)
 * are added here and applied automatically on startup without manual dashboard interaction.
 */
export const MIGRATIONS: Migration[] = [
  {
    id: '001_create_users_table',
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `,
  },
  {
    id: '002_create_user_profiles_table',
    sql: `
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
  },
];

let migrationsRun = false;

export const runMigrations = async (force: boolean = false): Promise<void> => {
  if ((migrationsRun && !force) || !d1.isConfigured()) return;

  try {
    for (const migration of MIGRATIONS) {
      await d1.execute(migration.sql);
    }
    migrationsRun = true;
  } catch (error) {
    console.error('Database migration failed:', error);
  }
};
