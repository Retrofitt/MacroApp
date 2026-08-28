export type BiologicalSex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly_active'
  | 'moderately_active'
  | 'very_active'
  | 'extremely_active';

export type UnitPreference = 'metric' | 'imperial';
export type ThemePreference = 'light' | 'dark';
export type SelectedGoal = 'cutting' | 'maintenance' | 'bulking';

export interface UserProfile {
  userId: string;
  biologicalSex: BiologicalSex;
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFatPercentage?: number | null;
  activityLevel: ActivityLevel;
  unitPreference: UnitPreference;
  themePreference?: ThemePreference;
  selectedGoal?: SelectedGoal;
  targetGoalWeight?: number | null;
  privacyPolicyAccepted?: boolean;
  termsAccepted?: boolean;
  isSetupComplete?: boolean;
  updatedAt: string;
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
