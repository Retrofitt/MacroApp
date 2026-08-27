import React, { useState } from 'react';
import type { TDEEResult, GoalMacroPreset, MacroBreakdown, UnitPreference } from '../types/user';
import { WeightForecastCard } from './WeightForecastCard';
import { Flame, Activity, Zap, TrendingDown, Target, TrendingUp } from 'lucide-react';

interface TDEECalculatorViewProps {
  tdeeResult: TDEEResult | null;
  weightKg?: number;
  unitPreference?: UnitPreference;
  onOpenSettings: () => void;
}

export const TDEECalculatorView: React.FC<TDEECalculatorViewProps> = ({
  tdeeResult,
  weightKg = 78,
  unitPreference = 'imperial',
  onOpenSettings,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<'cutting' | 'maintenance' | 'bulking'>('maintenance');
  const [selectedVariation, setSelectedVariation] = useState<'optimal' | 'highCarb' | 'highFat'>('optimal');

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

      {/* 9-Preset Macro Matrix Explorer */}
      <div className="glass-card responsive-card-padding">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Macro Targets</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Calibrated to protect lean muscle mass & optimize energy
            </p>
          </div>

          <button onClick={onOpenSettings} className="btn-ghost" style={{ fontSize: '12px', padding: '6px 12px', minHeight: '34px' }}>
            Edit Stats
          </button>
        </div>

        {/* Phase 1: 3 Goal Tabs */}
        <div className="goal-tabs-grid" style={{ marginBottom: '14px' }}>
          <button
            type="button"
            onClick={() => setSelectedGoal('cutting')}
            className="goal-tab-btn"
            style={{
              background: selectedGoal === 'cutting' ? 'var(--accent-gradient)' : 'transparent',
              color: selectedGoal === 'cutting' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: selectedGoal === 'cutting' ? '0 1px 3px rgba(16, 185, 129, 0.25)' : 'none',
            }}
          >
            <TrendingDown size={14} />
            <span>Cut (-20%)</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGoal('maintenance')}
            className="goal-tab-btn"
            style={{
              background: selectedGoal === 'maintenance' ? 'var(--accent-gradient)' : 'transparent',
              color: selectedGoal === 'maintenance' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: selectedGoal === 'maintenance' ? '0 1px 3px rgba(16, 185, 129, 0.25)' : 'none',
            }}
          >
            <Target size={14} />
            <span>Maintain</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedGoal('bulking')}
            className="goal-tab-btn"
            style={{
              background: selectedGoal === 'bulking' ? 'var(--accent-gradient)' : 'transparent',
              color: selectedGoal === 'bulking' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: selectedGoal === 'bulking' ? '0 1px 3px rgba(16, 185, 129, 0.25)' : 'none',
            }}
          >
            <TrendingUp size={14} />
            <span>Bulk (+12%)</span>
          </button>
        </div>

        {/* Phase 2: 3 Diet Variation Sub-Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setSelectedVariation('optimal')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: selectedVariation === 'optimal' ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
              background: selectedVariation === 'optimal' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-surface)',
              color: selectedVariation === 'optimal' ? '#059669' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ⭐ Balanced
          </button>

          <button
            type="button"
            onClick={() => setSelectedVariation('highCarb')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: selectedVariation === 'highCarb' ? '1.5px solid var(--macro-protein)' : '1px solid var(--border-light)',
              background: selectedVariation === 'highCarb' ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-surface)',
              color: selectedVariation === 'highCarb' ? '#2563eb' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ⚡ High-Carb
          </button>

          <button
            type="button"
            onClick={() => setSelectedVariation('highFat')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: selectedVariation === 'highFat' ? '1.5px solid var(--macro-fats)' : '1px solid var(--border-light)',
              background: selectedVariation === 'highFat' ? 'rgba(236, 72, 153, 0.1)' : 'var(--bg-surface)',
              color: selectedVariation === 'highFat' ? '#db2777' : 'var(--text-secondary)',
              fontWeight: '600',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            🥑 High-Fat
          </button>
        </div>

        {/* Selected Preset Details */}
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Calories</span>
              <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                {currentBreakdown.calories} <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>kcal</span>
              </div>
            </div>
            <div className="badge">
              {selectedGoal.toUpperCase()} • {selectedVariation.toUpperCase()}
            </div>
          </div>

          {/* Macro Visual Distribution Bar */}
          <div style={{ height: '8px', width: '100%', display: 'flex', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05) inset' }}>
            <div style={{ width: `${currentBreakdown.proteinPercentage}%`, background: 'var(--macro-protein)' }} title={`Protein: ${currentBreakdown.proteinPercentage}%`} />
            <div style={{ width: `${currentBreakdown.carbPercentage}%`, background: 'var(--macro-carbs)' }} title={`Carbs: ${currentBreakdown.carbPercentage}%`} />
            <div style={{ width: `${currentBreakdown.fatPercentage}%`, background: 'var(--macro-fats)' }} title={`Fats: ${currentBreakdown.fatPercentage}%`} />
          </div>

          {/* 3 Macro Value Cards */}
          <div className="macro-cards-grid">
            <div style={{ background: 'var(--bg-surface)', border: '1.5px solid rgba(59, 130, 246, 0.25)', padding: '10px 12px', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '10px', color: 'var(--macro-protein)', fontWeight: '700', textTransform: 'uppercase' }}>
                🥩 Protein ({currentBreakdown.proteinPercentage}%)
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
      />
    </div>
  );
};
