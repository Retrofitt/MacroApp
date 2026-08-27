import type {
  ActivityLevel,
  BiologicalSex,
  GoalMacroPreset,
  MacroBreakdown,
  TDEEResult,
  UnitPreference,
} from '../types/user';
import { kgToLbs } from './units';

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

export const createMacroBreakdown = (
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

export const calculateTDEEFromMetrics = (
  sex: BiologicalSex,
  age: number,
  heightCm: number,
  weightKg: number,
  activityLevel: ActivityLevel,
  bodyFatPercentage?: number
): TDEEResult => {
  const { bmr, formula, leanBodyMassKg } = calculateBMR(
    sex,
    weightKg,
    heightCm,
    age,
    bodyFatPercentage
  );

  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  return {
    bmr,
    tdee,
    formulaUsed: formula,
    leanBodyMassKg,
    presets: {
      cutting: calculateGoalPreset('cutting', tdee, weightKg, leanBodyMassKg),
      maintenance: calculateGoalPreset('maintenance', tdee, weightKg, leanBodyMassKg),
      bulking: calculateGoalPreset('bulking', tdee, weightKg, leanBodyMassKg),
    },
  };
};

export interface WeightForecastMilestone {
  weeks: number;
  projectedWeightDisplay: string;
  totalChangeDisplay: string;
}

export interface WeightForecastResult {
  dailyCalorieDifference: number; // e.g. -550 or +300
  weeklyChangeLbs: number;       // e.g. -1.1 lbs
  weeklyChangeKg: number;        // e.g. -0.5 kg
  rateDescription: string;       // e.g. "-1.1 lbs / week"
  milestones: WeightForecastMilestone[];
  targetGoalForecast?: {
    weeksNeeded: number;
    estimatedDate: string;
    isFeasible: boolean;
  };
}

export const calculateWeightForecast = (
  currentWeightKg: number,
  dailyCalorieDifference: number,
  unitPreference: UnitPreference,
  targetWeightInput?: number
): WeightForecastResult => {
  // 3500 kcal per lb of adipose tissue
  const weeklyCalorieDifference = dailyCalorieDifference * 7;
  const weeklyChangeLbs = Number((weeklyCalorieDifference / 3500).toFixed(2));
  const weeklyChangeKg = Number((weeklyCalorieDifference / 7700).toFixed(2));

  const isImperial = unitPreference === 'imperial';
  const currentWeight = isImperial ? kgToLbs(currentWeightKg) : currentWeightKg;
  const unitLabel = isImperial ? 'lbs' : 'kg';
  const weeklyRate = isImperial ? weeklyChangeLbs : weeklyChangeKg;

  const milestoneWeeks = [4, 8, 12];
  const milestones: WeightForecastMilestone[] = milestoneWeeks.map((weeks) => {
    const totalChange = weeklyRate * weeks;
    const projectedWeight = currentWeight + totalChange;
    const sign = totalChange > 0 ? '+' : '';

    return {
      weeks,
      projectedWeightDisplay: `${projectedWeight.toFixed(1)} ${unitLabel}`,
      totalChangeDisplay: `${sign}${totalChange.toFixed(1)} ${unitLabel}`,
    };
  });

  const rateDescription =
    weeklyRate === 0
      ? 'Weight Stable (±0.0 / wk)'
      : `${weeklyRate > 0 ? '+' : ''}${weeklyRate.toFixed(2)} ${unitLabel} / week`;

  // Target Goal Calculator
  let targetGoalForecast: WeightForecastResult['targetGoalForecast'] = undefined;
  if (targetWeightInput && targetWeightInput > 0 && weeklyRate !== 0) {
    const deltaNeeded = targetWeightInput - currentWeight;
    const isDirectionMatching = (deltaNeeded < 0 && weeklyRate < 0) || (deltaNeeded > 0 && weeklyRate > 0);

    if (isDirectionMatching) {
      const weeksNeeded = Math.ceil(Math.abs(deltaNeeded / weeklyRate));
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + weeksNeeded * 7);

      targetGoalForecast = {
        weeksNeeded,
        estimatedDate: targetDate.toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        isFeasible: true,
      };
    } else {
      const helpfulHint =
        deltaNeeded < 0
          ? 'Switch goal to Cutting to calculate weight loss'
          : 'Switch goal to Bulking to calculate weight gain';

      targetGoalForecast = {
        weeksNeeded: 0,
        estimatedDate: helpfulHint,
        isFeasible: false,
      };
    }
  }

  return {
    dailyCalorieDifference,
    weeklyChangeLbs,
    weeklyChangeKg,
    rateDescription,
    milestones,
    targetGoalForecast,
  };
};

/**
 * US Navy Body Fat Percentage Formula
 */
export const calculateNavyBodyFat = (
  sex: BiologicalSex,
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number
): number | null => {
  if (sex === 'male') {
    if (waistCm <= neckCm || heightCm <= 0) return null;
    const val = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    return Number(Math.max(3, Math.min(60, val)).toFixed(1));
  } else {
    const hip = hipCm ?? waistCm * 1.15;
    if (waistCm + hip <= neckCm || heightCm <= 0) return null;
    const val =
      495 / (1.29579 - 0.35004 * Math.log10(waistCm + hip - neckCm) + 0.221 * Math.log10(heightCm)) - 450;
    return Number(Math.max(5, Math.min(65, val)).toFixed(1));
  }
};
