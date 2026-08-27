import React from 'react';
import type { UnitPreference } from '../types/user';
import { Scale } from 'lucide-react';

interface UnitNotchProps {
  unitPreference: UnitPreference;
  onToggle: (unit: UnitPreference) => void;
}

export const UnitNotch: React.FC<UnitNotchProps> = ({ unitPreference, onToggle }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-full)',
        padding: '2px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px 0 6px', color: 'var(--text-muted)' }}>
        <Scale size={13} />
      </div>

      <button
        type="button"
        onClick={() => onToggle('imperial')}
        style={{
          background: unitPreference === 'imperial' ? 'var(--accent-gradient)' : 'transparent',
          color: unitPreference === 'imperial' ? '#ffffff' : 'var(--text-secondary)',
          fontWeight: unitPreference === 'imperial' ? '700' : '500',
          border: 'none',
          padding: '4px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: unitPreference === 'imperial' ? '0 1px 3px rgba(16, 185, 129, 0.3)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="unit-label-desktop">Imperial (lbs)</span>
        <span className="unit-label-mobile">lbs</span>
      </button>

      <button
        type="button"
        onClick={() => onToggle('metric')}
        style={{
          background: unitPreference === 'metric' ? 'var(--accent-gradient)' : 'transparent',
          color: unitPreference === 'metric' ? '#ffffff' : 'var(--text-secondary)',
          fontWeight: unitPreference === 'metric' ? '700' : '500',
          border: 'none',
          padding: '4px 8px',
          borderRadius: 'var(--radius-full)',
          fontSize: '11px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: unitPreference === 'metric' ? '0 1px 3px rgba(16, 185, 129, 0.3)' : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <span className="unit-label-desktop">Metric (kg)</span>
        <span className="unit-label-mobile">kg</span>
      </button>
    </div>
  );
};
