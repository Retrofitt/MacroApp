import React, { useState } from 'react';
import { convertFoodAmountToGrams, type FoodMeasureUnit } from '../utils/units';
import { Utensils, Scale } from 'lucide-react';

interface FoodItemSample {
  name: string;
  category: 'meat' | 'dairy' | 'carb' | 'oil';
  densityGPerMl?: number;
  macrosPer100g: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const SAMPLE_FOODS: FoodItemSample[] = [
  {
    name: '80/20 Ground Beef (Raw)',
    category: 'meat',
    densityGPerMl: 1.0,
    macrosPer100g: {
      calories: 254,
      protein: 17.2,
      carbs: 0,
      fat: 20.0,
    },
  },
  {
    name: 'Whole Milk (3.25%)',
    category: 'dairy',
    densityGPerMl: 1.03,
    macrosPer100g: {
      calories: 61,
      protein: 3.15,
      carbs: 4.8,
      fat: 3.25,
    },
  },
  {
    name: 'Boneless Skinless Chicken Breast',
    category: 'meat',
    densityGPerMl: 1.0,
    macrosPer100g: {
      calories: 165,
      protein: 31.0,
      carbs: 0,
      fat: 3.6,
    },
  },
  {
    name: 'Cooked Jasmine Rice',
    category: 'carb',
    densityGPerMl: 0.85,
    macrosPer100g: {
      calories: 130,
      protein: 2.7,
      carbs: 28.2,
      fat: 0.3,
    },
  },
  {
    name: 'Extra Virgin Olive Oil',
    category: 'oil',
    densityGPerMl: 0.92,
    macrosPer100g: {
      calories: 884,
      protein: 0,
      carbs: 0,
      fat: 100.0,
    },
  },
];

export const FoodUnitConverterDemo: React.FC = () => {
  const [selectedFood, setSelectedFood] = useState<FoodItemSample>(SAMPLE_FOODS[0]);
  const [amount, setAmount] = useState<number>(432);
  const [unit, setUnit] = useState<FoodMeasureUnit>('g');

  const calculatedGrams = convertFoodAmountToGrams(
    amount,
    unit,
    selectedFood.densityGPerMl ?? 1.0
  );

  const factor = calculatedGrams / 100;
  const calculatedMacros = {
    calories: Math.round(selectedFood.macrosPer100g.calories * factor),
    protein: Number((selectedFood.macrosPer100g.protein * factor).toFixed(1)),
    carbs: Number((selectedFood.macrosPer100g.carbs * factor).toFixed(1)),
    fat: Number((selectedFood.macrosPer100g.fat * factor).toFixed(1)),
  };

  return (
    <div className="glass-card" style={{ padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '10px', color: '#000' }}>
          <Utensils size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Universal Food & Macro Measurement Engine</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            Measure in whatever unit you have at hand (grams, oz, lbs, cups, tbsp, ml) with exact macro calculation
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginTop: '20px',
          marginBottom: '24px',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
            Select Sample Food
          </label>
          <select
            value={selectedFood.name}
            onChange={(e) => {
              const found = SAMPLE_FOODS.find((f) => f.name === e.target.value);
              if (found) setSelectedFood(found);
            }}
            className="input-field"
            style={{ cursor: 'pointer' }}
          >
            {SAMPLE_FOODS.map((food) => (
              <option key={food.name} value={food.name}>
                {food.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
            Amount & Custom Measurement Unit
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input
              type="number"
              step="any"
              min="0.1"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="input-field"
              placeholder="e.g. 432"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as FoodMeasureUnit)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <optgroup label="Mass / Weight">
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="oz">Ounces (oz)</option>
                <option value="lbs">Pounds (lbs)</option>
              </optgroup>
              <optgroup label="Volume / Kitchen">
                <option value="ml">Milliliters (ml)</option>
                <option value="l">Liters (L)</option>
                <option value="fl_oz">Fluid Oz (fl oz)</option>
                <option value="cup">Cups (cup ≈ 240ml)</option>
                <option value="tbsp">Tablespoons (tbsp ≈ 15ml)</option>
                <option value="tsp">Teaspoons (tsp ≈ 5ml)</option>
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Real-time Math Output Card */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Normalized Metric Weight</span>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
              {amount} {unit} = <span style={{ color: 'var(--text-primary)' }}>{calculatedGrams.toFixed(1)}g</span>
            </div>
          </div>
          <div className="badge">
            <Scale size={14} />
            <span>Density factor: {selectedFood.densityGPerMl ?? 1.0}g/ml</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Calories</span>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-emerald)', marginTop: '2px' }}>
              {calculatedMacros.calories} <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-secondary)' }}>kcal</span>
            </div>
          </div>

          <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: '600' }}>Protein</span>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {calculatedMacros.protein}g
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', textTransform: 'uppercase', fontWeight: '600' }}>Carbohydrates</span>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {calculatedMacros.carbs}g
            </div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '11px', color: '#f59e0b', textTransform: 'uppercase', fontWeight: '600' }}>Fats</span>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {calculatedMacros.fat}g
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
