import React, { useState } from 'react';
import type { UnitPreference } from '../types/user';
import { calculateWeightForecast } from '../utils/tdeeCalculator';
import { TrendingDown, TrendingUp, Calendar, Target, Clock, AlertCircle } from 'lucide-react';

interface WeightForecastCardProps {
  currentWeightKg: number;
  tdee: number;
  calorieTarget: number;
  goal: 'cutting' | 'maintenance' | 'bulking';
  unitPreference: UnitPreference;
}

export const WeightForecastCard: React.FC<WeightForecastCardProps> = ({
  currentWeightKg,
  tdee,
  calorieTarget,
  goal,
  unitPreference,
}) => {
  const [targetWeightInput, setTargetWeightInput] = useState<string>('');

  const dailyCalorieDifference = calorieTarget - tdee;
  const parsedTargetWeight = targetWeightInput ? parseFloat(targetWeightInput) : undefined;

  const forecast = calculateWeightForecast(
    currentWeightKg,
    dailyCalorieDifference,
    unitPreference,
    parsedTargetWeight
  );

  const isImperial = unitPreference === 'imperial';
  const isLoss = dailyCalorieDifference < 0;
  const isGain = dailyCalorieDifference > 0;
  const isMaintenance = dailyCalorieDifference === 0;

  return (
    <div
      className="glass-card responsive-card-padding"
      style={{
        border: '1px solid var(--border-light)',
        background: 'var(--bg-surface)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
              Weight Change & Timeline Forecast
            </h3>
            <span
              className="badge"
              style={{
                background: isLoss ? 'rgba(16, 185, 129, 0.1)' : isGain ? 'rgba(59, 130, 246, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                color: isLoss ? '#059669' : isGain ? 'var(--macro-protein)' : 'var(--text-muted)',
                borderColor: isLoss ? 'rgba(16, 185, 129, 0.2)' : isGain ? 'rgba(59, 130, 246, 0.2)' : 'var(--border-light)',
              }}
            >
              {isLoss ? <TrendingDown size={14} /> : isGain ? <TrendingUp size={14} /> : <Target size={14} />}
              <span>{goal.toUpperCase()} • {forecast.rateDescription}</span>
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
            Based on a daily {isLoss ? 'deficit' : isGain ? 'surplus' : 'balance'} of {Math.abs(dailyCalorieDifference)} kcal/day (3,500 kcal $\approx$ 1 lb tissue)
          </p>
        </div>
      </div>

      {/* 4, 8, 12 Week Projected Milestone Cards */}
      <div className="forecast-milestones-grid" style={{ marginBottom: '16px' }}>
        {forecast.milestones.map((milestone) => (
          <div
            key={milestone.weeks}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                In {milestone.weeks} Weeks
              </span>
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
            </div>

            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
              {isMaintenance ? 'Stable' : milestone.projectedWeightDisplay}
            </div>

            <div
              style={{
                fontSize: '11px',
                fontWeight: '600',
                color: isLoss ? '#059669' : isGain ? 'var(--macro-protein)' : 'var(--text-muted)',
              }}
            >
              {isMaintenance ? '± 0.0 change' : `${milestone.totalChangeDisplay} from today`}
            </div>
          </div>
        ))}
      </div>

      {/* Target Goal Weight Calculator */}
      <div
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              color: 'var(--color-accent)',
            }}
          >
            <Target size={20} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
              Target Goal Weight Estimator
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Enter your target weight to calculate estimated date of arrival
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ width: '130px' }}>
            <input
              type="number"
              step="0.5"
              placeholder={`e.g. ${isImperial ? '175' : '75'}`}
              value={targetWeightInput}
              onChange={(e) => setTargetWeightInput(e.target.value)}
              className="input-field"
              style={{ padding: '8px 12px', fontSize: '13px' }}
            />
          </div>

          {forecast.targetGoalForecast && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                background: forecast.targetGoalForecast.isFeasible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: forecast.targetGoalForecast.isFeasible ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)',
                fontSize: '13px',
                fontWeight: '600',
                color: forecast.targetGoalForecast.isFeasible ? '#059669' : 'var(--danger-text)',
              }}
            >
              {forecast.targetGoalForecast.isFeasible ? (
                <>
                  <Clock size={16} />
                  <span>
                    ~{forecast.targetGoalForecast.weeksNeeded} Weeks (Arrive: {forecast.targetGoalForecast.estimatedDate})
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>{forecast.targetGoalForecast.estimatedDate}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
