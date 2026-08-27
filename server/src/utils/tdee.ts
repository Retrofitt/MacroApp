import {
  ActivityLevel,
  BiologicalSex,
  GoalMacroPreset,
  MacroBreakdown,
  TDEEResult,
  UserProfile,
} from '../types/index.js';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

export const calculateBMR = (
  sex: BiologicalSex,
  weightKg: number,
  heightCm: number,
  age: number,
  bodyFatPercentage?: number
): { bmr: number; formula: 'katch_mcardle' | 'mifflin_st_jeor'; leanBodyMassKg?: number } => {
  if (bodyFatPercentage !== undefined && bodyFatPercentage > 3 && bodyFatPercentage < 60) {
    const leanBodyMassKg = weightKg * (1 - bodyFatPercentage / 100);
    const bmr = 370 + 21.6 * leanBodyMassKg;
    return {
      bmr: Math.round(bmr),
      formula: 'katch_mcardle',
      leanBodyMassKg: Number(leanBodyMassKg.toFixed(1)),
    };
  }

  const s = sex === 'male' ? 5 : -161;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;
  return {
    bmr: Math.round(bmr),
    formula: 'mifflin_st_jeor',
  };
};

const createMacroBreakdown = (
  calories: number,
  proteinGrams: number,
  fatGrams: number
): MacroBreakdown => {
  const proteinCals = proteinGrams * 4;
  const fatCals = fatGrams * 9;
  const remainingCals = Math.max(0, calories - (proteinCals + fatCals));
  const carbGrams = Math.round(remainingCals / 4);

  const totalCalsFromMacros = proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;

  return {
    calories: Math.round(calories),
    proteinGrams: Math.round(proteinGrams),
    carbGrams: Math.round(carbGrams),
    fatGrams: Math.round(fatGrams),
    proteinPercentage: Math.round(((proteinGrams * 4) / totalCalsFromMacros) * 100),
    carbPercentage: Math.round(((carbGrams * 4) / totalCalsFromMacros) * 100),
    fatPercentage: Math.round(((fatGrams * 9) / totalCalsFromMacros) * 100),
  };
};

export const calculateGoalPreset = (
  goal: 'cutting' | 'maintenance' | 'bulking',
  tdee: number,
  weightKg: number,
  leanBodyMassKg?: number
): GoalMacroPreset => {
  let calorieTarget = tdee;
  if (goal === 'cutting') {
    calorieTarget = Math.round(tdee * 0.8);
  } else if (goal === 'bulking') {
    calorieTarget = Math.round(tdee * 1.12);
  }

  const baseWeightForProtein = leanBodyMassKg ?? weightKg;
  const proteinTargetGrams = Math.max(120, baseWeightForProtein * 2.2);

  const minFatFloorGrams = Math.max(35, weightKg * 0.65);

  const optimalFatGrams = Math.max(minFatFloorGrams, (calorieTarget * 0.28) / 9);
  const optimal = createMacroBreakdown(calorieTarget, proteinTargetGrams, optimalFatGrams);

  const highCarbFatGrams = Math.max(minFatFloorGrams, (calorieTarget * 0.18) / 9);
  const highCarb = createMacroBreakdown(calorieTarget, proteinTargetGrams, highCarbFatGrams);

  const highFatFatGrams = (calorieTarget * 0.45) / 9;
  const highFat = createMacroBreakdown(calorieTarget, proteinTargetGrams, highFatFatGrams);

  return {
    goal,
    calorieTarget,
    variations: {
      optimal,
      highCarb,
      highFat,
    },
  };
};

export const calculateFullTDEE = (profile: UserProfile): TDEEResult => {
  const { bmr, formula, leanBodyMassKg } = calculateBMR(
    profile.biologicalSex,
    profile.weightKg,
    profile.heightCm,
    profile.age,
    profile.bodyFatPercentage
  );

  const multiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  return {
    bmr,
    tdee,
    formulaUsed: formula,
    leanBodyMassKg,
    presets: {
      cutting: calculateGoalPreset('cutting', tdee, profile.weightKg, leanBodyMassKg),
      maintenance: calculateGoalPreset('maintenance', tdee, profile.weightKg, leanBodyMassKg),
      bulking: calculateGoalPreset('bulking', tdee, profile.weightKg, leanBodyMassKg),
    },
  };
};
