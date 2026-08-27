export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft_in';
export type FoodMassUnit = 'g' | 'kg' | 'oz' | 'lbs';
export type FoodVolumeUnit = 'ml' | 'l' | 'fl_oz' | 'cup' | 'tbsp' | 'tsp';
export type FoodMeasureUnit = FoodMassUnit | FoodVolumeUnit;

export const kgToLbs = (kg: number): number => kg * 2.20462262;
export const lbsToKg = (lbs: number): number => lbs / 2.20462262;

export const cmToFeetInches = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const feetInchesToCm = (feet: number, inches: number): number => {
  const totalInches = feet * 12 + inches;
  return totalInches * 2.54;
};

const MASS_TO_GRAMS: Record<FoodMassUnit, number> = {
  g: 1,
  kg: 1000,
  oz: 28.349523125,
  lbs: 453.59237,
};

const VOLUME_TO_ML: Record<FoodVolumeUnit, number> = {
  ml: 1,
  l: 1000,
  fl_oz: 29.5735295625,
  cup: 240,
  tbsp: 14.7867647813,
  tsp: 4.92892159375,
};

export const convertFoodAmountToGrams = (
  amount: number,
  unit: FoodMeasureUnit,
  densityGPerMl: number = 1.03
): number => {
  if (unit in MASS_TO_GRAMS) {
    return amount * MASS_TO_GRAMS[unit as FoodMassUnit];
  }
  if (unit in VOLUME_TO_ML) {
    const ml = amount * VOLUME_TO_ML[unit as FoodVolumeUnit];
    return ml * densityGPerMl;
  }
  return amount;
};

export const convertGramsToUnit = (
  grams: number,
  targetUnit: FoodMeasureUnit,
  densityGPerMl: number = 1.03
): number => {
  if (targetUnit in MASS_TO_GRAMS) {
    return grams / MASS_TO_GRAMS[targetUnit as FoodMassUnit];
  }
  if (targetUnit in VOLUME_TO_ML) {
    const ml = grams / densityGPerMl;
    return ml / VOLUME_TO_ML[targetUnit as FoodVolumeUnit];
  }
  return grams;
};
