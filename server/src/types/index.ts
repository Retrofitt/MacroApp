export type BiologicalSex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type UnitPreference = 'metric' | 'imperial';

export interface UserProfile {
  userId: string;
  biologicalSex: BiologicalSex;
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFatPercentage?: number;
  activityLevel: ActivityLevel;
  unitPreference: UnitPreference;
  isSetupComplete?: boolean;
  updatedAt: Date;
}

export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  proteinPercentage: number;
  carbPercentage: number;
  fatPercentage: number;
}

export interface GoalMacroPreset {
  goal: 'cutting' | 'maintenance' | 'bulking';
  calorieTarget: number;
  variations: {
    optimal: MacroBreakdown;
    highCarb: MacroBreakdown;
    highFat: MacroBreakdown;
  };
}

export interface TDEEResult {
  bmr: number;
  tdee: number;
  formulaUsed: 'katch_mcardle' | 'mifflin_st_jeor';
  leanBodyMassKg?: number;
  presets: {
    cutting: GoalMacroPreset;
    maintenance: GoalMacroPreset;
    bulking: GoalMacroPreset;
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface AuthTokenPayload {
  userId: string;
  email: string;
  username: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
