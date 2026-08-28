import { d1 } from './d1.js';
import { ensureDatabaseSchema } from './schema.js';
import { User, UserProfile, BiologicalSex, ActivityLevel, UnitPreference } from '../types/index.js';

// Local development in-memory fallback maps if D1 is not configured
const localUsersDb: Map<string, User> = new Map();
const localProfilesDb: Map<string, UserProfile> = new Map();

interface D1UserRow {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

interface D1ProfileRow {
  user_id: string;
  biological_sex: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  body_fat_percentage: number | null;
  activity_level: string;
  unit_preference: string;
  is_setup_complete: number;
  updated_at: string;
}

const mapUserRow = (row: D1UserRow): User => ({
  id: row.id,
  email: row.email,
  username: row.username,
  passwordHash: row.password_hash,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
});

const mapProfileRow = (row: D1ProfileRow): UserProfile => ({
  userId: row.user_id,
  biologicalSex: (row.biological_sex as BiologicalSex) || 'male',
  age: row.age,
  heightCm: row.height_cm,
  weightKg: row.weight_kg,
  bodyFatPercentage: row.body_fat_percentage ?? undefined,
  activityLevel: (row.activity_level as ActivityLevel) || 'moderately_active',
  unitPreference: (row.unit_preference as UnitPreference) || 'imperial',
  isSetupComplete: Boolean(row.is_setup_complete),
  updatedAt: new Date(row.updated_at),
});

export const userRepository = {
  async ensureSchema(force: boolean = false): Promise<void> {
    await ensureDatabaseSchema(force);
  },

  async findByEmail(email: string): Promise<User | null> {
    if (!d1.isConfigured()) {
      return Array.from(localUsersDb.values()).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      ) || null;
    }

    await this.ensureSchema();

    try {
      const rows = await d1.query<D1UserRow>(
        'SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1;',
        [email]
      );
      return rows.length > 0 ? mapUserRow(rows[0]) : null;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('no such table')) {
        await this.ensureSchema(true);
        const rows = await d1.query<D1UserRow>(
          'SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1;',
          [email]
        );
        return rows.length > 0 ? mapUserRow(rows[0]) : null;
      }
      throw err;
    }
  },

  async findByUsername(username: string): Promise<User | null> {
    if (!d1.isConfigured()) {
      return Array.from(localUsersDb.values()).find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      ) || null;
    }

    await this.ensureSchema();

    try {
      const rows = await d1.query<D1UserRow>(
        'SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1;',
        [username]
      );
      return rows.length > 0 ? mapUserRow(rows[0]) : null;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('no such table')) {
        await this.ensureSchema(true);
        const rows = await d1.query<D1UserRow>(
          'SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1;',
          [username]
        );
        return rows.length > 0 ? mapUserRow(rows[0]) : null;
      }
      throw err;
    }
  },

  async findById(id: string): Promise<User | null> {
    if (!d1.isConfigured()) {
      return localUsersDb.get(id) || null;
    }

    await this.ensureSchema();

    try {
      const rows = await d1.query<D1UserRow>(
        'SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE id = ? LIMIT 1;',
        [id]
      );
      return rows.length > 0 ? mapUserRow(rows[0]) : null;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('no such table')) {
        await this.ensureSchema(true);
        const rows = await d1.query<D1UserRow>(
          'SELECT id, email, username, password_hash, created_at, updated_at FROM users WHERE id = ? LIMIT 1;',
          [id]
        );
        return rows.length > 0 ? mapUserRow(rows[0]) : null;
      }
      throw err;
    }
  },

  async createUser(data: {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<User> {
    const now = new Date();
    const newUser: User = {
      id: data.id,
      email: data.email,
      username: data.username,
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    if (!d1.isConfigured()) {
      localUsersDb.set(newUser.id, newUser);
      return newUser;
    }

    await this.ensureSchema();

    try {
      await d1.execute(
        `INSERT INTO users (id, email, username, password_hash, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
        [
          newUser.id,
          newUser.email,
          newUser.username,
          newUser.passwordHash,
          newUser.createdAt.toISOString(),
          newUser.updatedAt.toISOString(),
        ]
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('no such table')) {
        await this.ensureSchema(true);
        await d1.execute(
          `INSERT INTO users (id, email, username, password_hash, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?);`,
          [
            newUser.id,
            newUser.email,
            newUser.username,
            newUser.passwordHash,
            newUser.createdAt.toISOString(),
            newUser.updatedAt.toISOString(),
          ]
        );
      } else {
        throw err;
      }
    }

    return newUser;
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!d1.isConfigured()) {
      return localProfilesDb.get(userId) || null;
    }

    await this.ensureSchema();

    try {
      const rows = await d1.query<D1ProfileRow>(
        `SELECT user_id, biological_sex, age, height_cm, weight_kg, body_fat_percentage,
                activity_level, unit_preference, is_setup_complete, updated_at
         FROM user_profiles WHERE user_id = ? LIMIT 1;`,
        [userId]
      );
      return rows.length > 0 ? mapProfileRow(rows[0]) : null;
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('no such table')) {
        await this.ensureSchema(true);
        const rows = await d1.query<D1ProfileRow>(
          `SELECT user_id, biological_sex, age, height_cm, weight_kg, body_fat_percentage,
                  activity_level, unit_preference, is_setup_complete, updated_at
           FROM user_profiles WHERE user_id = ? LIMIT 1;`,
          [userId]
        );
        return rows.length > 0 ? mapProfileRow(rows[0]) : null;
      }
      throw err;
    }
  },

  async upsertProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    const existing = await this.getProfile(userId);
    const now = new Date();

    const merged: UserProfile = {
      userId,
      biologicalSex: data.biologicalSex ?? existing?.biologicalSex ?? 'male',
      age: data.age ?? existing?.age ?? 25,
      heightCm: data.heightCm ?? existing?.heightCm ?? 178,
      weightKg: data.weightKg ?? existing?.weightKg ?? 78,
      bodyFatPercentage:
        data.bodyFatPercentage !== undefined
          ? data.bodyFatPercentage
          : existing?.bodyFatPercentage,
      activityLevel: data.activityLevel ?? existing?.activityLevel ?? 'moderately_active',
      unitPreference: data.unitPreference ?? existing?.unitPreference ?? 'imperial',
      isSetupComplete:
        data.isSetupComplete !== undefined
          ? data.isSetupComplete
          : existing?.isSetupComplete ?? true,
      updatedAt: now,
    };

    if (!d1.isConfigured()) {
      localProfilesDb.set(userId, merged);
      return merged;
    }

    await this.ensureSchema();

    try {
      await d1.execute(
        `INSERT INTO user_profiles (
           user_id, biological_sex, age, height_cm, weight_kg, body_fat_percentage,
           activity_level, unit_preference, is_setup_complete, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
           biological_sex = excluded.biological_sex,
           age = excluded.age,
           height_cm = excluded.height_cm,
           weight_kg = excluded.weight_kg,
           body_fat_percentage = excluded.body_fat_percentage,
           activity_level = excluded.activity_level,
           unit_preference = excluded.unit_preference,
           is_setup_complete = excluded.is_setup_complete,
           updated_at = excluded.updated_at;`,
        [
          merged.userId,
          merged.biologicalSex,
          merged.age,
          merged.heightCm,
          merged.weightKg,
          merged.bodyFatPercentage ?? null,
          merged.activityLevel,
          merged.unitPreference,
          merged.isSetupComplete ? 1 : 0,
          merged.updatedAt.toISOString(),
        ]
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('no such table')) {
        await this.ensureSchema(true);
        await d1.execute(
          `INSERT INTO user_profiles (
             user_id, biological_sex, age, height_cm, weight_kg, body_fat_percentage,
             activity_level, unit_preference, is_setup_complete, updated_at
           ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id) DO UPDATE SET
             biological_sex = excluded.biological_sex,
             age = excluded.age,
             height_cm = excluded.height_cm,
             weight_kg = excluded.weight_kg,
             body_fat_percentage = excluded.body_fat_percentage,
             activity_level = excluded.activity_level,
             unit_preference = excluded.unit_preference,
             is_setup_complete = excluded.is_setup_complete,
             updated_at = excluded.updated_at;`,
          [
            merged.userId,
            merged.biologicalSex,
            merged.age,
            merged.heightCm,
            merged.weightKg,
            merged.bodyFatPercentage ?? null,
            merged.activityLevel,
            merged.unitPreference,
            merged.isSetupComplete ? 1 : 0,
            merged.updatedAt.toISOString(),
          ]
        );
      } else {
        throw err;
      }
    }

    return merged;
  },
};
