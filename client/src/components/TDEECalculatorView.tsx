import React, { useState, useEffect } from 'react';
import type {
  TDEEResult,
  GoalMacroPreset,
  MacroBreakdown,
  UnitPreference,
  SelectedGoal,
} from '../types/user';
import { WeightForecastCard } from './WeightForecastCard';
import { Flame, Activity, Zap, TrendingDown, Target, TrendingUp } from 'lucide-react';

interface TDEECalculatorViewProps {
  tdeeResult: TDEEResult | null;
  weightKg?: number;
  unitPreference?: UnitPreference;
  initialSelectedGoal?: SelectedGoal;
  initialTargetWeight?: number | null;
  onGoalChange?: (goal: SelectedGoal) => void;
  onTargetWeightChange?: (targetWeight: number | null) => void;
  onOpenSettings: () => void;
}

export const TDEECalculatorView: React.FC<TDEECalculatorViewProps> = ({
  tdeeResult,
  weightKg = 78,
  unitPreference = 'imperial',
  initialSelectedGoal = 'maintenance',
  initialTargetWeight,
  onGoalChange,
  onTargetWeightChange,
  onOpenSettings,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<SelectedGoal>(initialSelectedGoal);
  const [selectedVariation, setSelectedVariation] = useState<'optimal' | 'highCarb' | 'highFat'>('optimal');

  useEffect(() => {
    if (initialSelectedGoal) {
      setSelectedGoal(initialSelectedGoal);
    }
  }, [initialSelectedGoal]);

  const handleGoalSelect = (goal: SelectedGoal) => {
    setSelectedGoal(goal);
    onGoalChange?.(goal);
  };

  if (!tdeeResult) {
    return null;
  }

  const currentGoalPreset: GoalMacroPreset = tdeeResult.presets[selectedGoal];
  const currentBreakdown: MacroBreakdown = currentGoalPreset.variations[selectedVariation];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Metric Cards */}
      <div className="metric-summary-grid">
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
              Basal Metabolic Rate
            </span>
            <Activity size={16} style={{ color: 'var(--macro-protein)' }} />
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
            {tdeeResult.bmr} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>kcal</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Calories burned at complete rest
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', border: '1.5px solid var(--color-accent)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Daily TDEE (Maintain)
            </span>
            <Flame size={18} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-accent)' }}>
            {tdeeResult.tdee} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}>kcal</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Total daily calories to maintain weight
          </div>
        </div>

        {tdeeResult.leanBodyMassKg && (
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                Lean Body Mass
              </span>
              <Zap size={16} style={{ color: '#8b5cf6' }} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
              {tdeeResult.leanBodyMassKg} <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>kg</span>
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              ≈ {Math.round(tdeeResult.leanBodyMassKg * 2.20462)} lbs active tissue
            </div>
          </div>
        )}
      </div>

      {/* 9 Macro Targets Matrix */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                Macro Targets
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
              Calibrated to protect lean muscle mass & optimize performance
            </p>
          </div>

          <button
            onClick={onOpenSettings}
            className="btn-ghost"
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            Edit Stats
          </button>
        </div>

        {/* 1. Goal Selector Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            background: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => handleGoalSelect('cutting')}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: selectedGoal === 'cutting' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              background: selectedGoal === 'cutting' ? 'var(--bg-surface)' : 'transparent',
              color: selectedGoal === 'cutting' ? '#059669' : 'var(--text-secondary)',
              fontWeight: selectedGoal === 'cutting' ? '700' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: selectedGoal === 'cutting' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <TrendingDown size={14} />
            <span>Cut (-20%)</span>
          </button>

          <button
            onClick={() => handleGoalSelect('maintenance')}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: selectedGoal === 'maintenance' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              background: selectedGoal === 'maintenance' ? 'var(--bg-surface)' : 'transparent',
              color: selectedGoal === 'maintenance' ? '#059669' : 'var(--text-secondary)',
              fontWeight: selectedGoal === 'maintenance' ? '700' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: selectedGoal === 'maintenance' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Target size={14} />
            <span>Maintain</span>
          </button>

          <button
            onClick={() => handleGoalSelect('bulking')}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: selectedGoal === 'bulking' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              background: selectedGoal === 'bulking' ? 'var(--bg-surface)' : 'transparent',
              color: selectedGoal === 'bulking' ? '#059669' : 'var(--text-secondary)',
              fontWeight: selectedGoal === 'bulking' ? '700' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: selectedGoal === 'bulking' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <TrendingUp size={14} />
            <span>Bulk (+12%)</span>
          </button>
        </div>

        {/* 2. Variation Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedVariation('optimal')}
            className={`pill-btn ${selectedVariation === 'optimal' ? 'active' : ''}`}
            style={{ fontSize: '12px' }}
          >
            ⭐ Balanced
          </button>
          <button
            onClick={() => setSelectedVariation('highCarb')}
            className={`pill-btn ${selectedVariation === 'highCarb' ? 'active' : ''}`}
            style={{ fontSize: '12px' }}
          >
            ⚡ High-Carb
          </button>
          <button
            onClick={() => setSelectedVariation('highFat')}
            className={`pill-btn ${selectedVariation === 'highFat' ? 'active' : ''}`}
            style={{ fontSize: '12px' }}
          >
            🥑 High-Fat (Keto Lean)
          </button>
        </div>

        {/* 3. Active Target Overview Card */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            border: '1px solid var(--border-light)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                Target Calories
              </span>
              <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>
                {currentBreakdown.calories} <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>kcal</span>
              </div>
            </div>

            <span
              className="badge"
              style={{
                textTransform: 'uppercase',
                fontSize: '10px',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                borderColor: 'rgba(16, 185, 129, 0.2)',
              }}
            >
              {selectedGoal} • {selectedVariation}
            </span>
          </div>

          {/* Macro Ratio Color Bar */}
          <div
            style={{
              height: '8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              overflow: 'hidden',
              marginBottom: '16px',
            }}
          >
            <div style={{ width: `${currentBreakdown.proteinPercentage}%`, background: 'var(--macro-protein)' }} title="Protein" />
            <div style={{ width: `${currentBreakdown.carbPercentage}%`, background: 'var(--macro-carbs)' }} title="Carbs" />
            <div style={{ width: `${currentBreakdown.fatPercentage}%`, background: 'var(--macro-fats)' }} title="Fats" />
          </div>

          {/* 3 Macro Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1.5px solid rgba(59, 130, 246, 0.25)', padding: '10px 12px', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '10px', color: 'var(--macro-protein)', fontWeight: '700', textTransform: 'uppercase' }}>
                🍗 Protein ({currentBreakdown.proteinPercentage}%)
              </span>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                {currentBreakdown.proteinGrams}g
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {currentBreakdown.proteinGrams * 4} kcal
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1.5px solid rgba(245, 158, 11, 0.25)', padding: '10px 12px', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '10px', color: 'var(--macro-carbs)', fontWeight: '700', textTransform: 'uppercase' }}>
                🍚 Carbs ({currentBreakdown.carbPercentage}%)
              </span>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                {currentBreakdown.carbGrams}g
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {currentBreakdown.carbGrams * 4} kcal
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1.5px solid rgba(236, 72, 153, 0.25)', padding: '10px 12px', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '10px', color: 'var(--macro-fats)', fontWeight: '700', textTransform: 'uppercase' }}>
                🥑 Fats ({currentBreakdown.fatPercentage}%)
              </span>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                {currentBreakdown.fatGrams}g
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {currentBreakdown.fatGrams * 9} kcal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weight Change & Timeline Forecast */}
      <WeightForecastCard
        currentWeightKg={weightKg}
        tdee={tdeeResult.tdee}
        calorieTarget={currentBreakdown.calories}
        goal={selectedGoal}
        unitPreference={unitPreference}
        initialTargetWeight={initialTargetWeight}
        onTargetWeightChange={onTargetWeightChange}
      />
    </div>
  );
};
