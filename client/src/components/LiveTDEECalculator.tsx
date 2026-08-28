import React, { useState, useMemo } from 'react';
import type {
  BiologicalSex,
  ActivityLevel,
  UnitPreference,
  GoalMacroPreset,
  MacroBreakdown,
} from '../types/user';
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg } from '../utils/units';
import { calculateTDEEFromMetrics, calculateNavyBodyFat } from '../utils/tdeeCalculator';
import { WeightForecastCard } from './WeightForecastCard';
import { FooterDisclaimer } from './FooterDisclaimer';
import {
  Flame,
  Activity,
  Zap,
  TrendingDown,
  Target,
  TrendingUp,
  Sliders,
  Sparkles,
  UserCheck,
  ChevronDown,
  ChevronUp,
  Calculator,
} from 'lucide-react';

export interface GuestMetrics {
  sex?: BiologicalSex;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  bodyFat?: number;
  activity?: ActivityLevel;
}

interface LiveTDEECalculatorProps {
  unitPreference: UnitPreference;
  onUnitToggle: (unit: UnitPreference) => void;
  onSignUpWithStats?: (stats: GuestMetrics) => void;
  initialMetrics?: Partial<GuestMetrics>;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const LiveTDEECalculator: React.FC<LiveTDEECalculatorProps> = ({
  unitPreference,
  onSignUpWithStats,
  initialMetrics,
  onOpenLegal,
}) => {
  // Metric base state - inputs default to empty with placeholders for guests
  const [sex, setSex] = useState<BiologicalSex | null>(initialMetrics?.sex ?? null);
  const [age, setAge] = useState<number | ''>(initialMetrics?.age ?? '');
  const [heightCm, setHeightCm] = useState<number | ''>(initialMetrics?.heightCm ?? '');
  const [weightKg, setWeightKg] = useState<number | ''>(initialMetrics?.weightKg ?? '');
  const [bodyFatInput, setBodyFatInput] = useState<string>(
    initialMetrics?.bodyFat ? String(initialMetrics.bodyFat) : ''
  );
  const [activity, setActivity] = useState<ActivityLevel>(
    initialMetrics?.activity ?? 'moderately_active'
  );

  // Advanced Optionals state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [neckCircumference, setNeckCircumference] = useState<string>('');
  const [waistCircumference, setWaistCircumference] = useState<string>('');
  const [hipCircumference, setHipCircumference] = useState<string>('');

  // Imperial helper state
  const [feet, setFeet] = useState<number | ''>(
    initialMetrics?.heightCm ? cmToFeetInches(initialMetrics.heightCm).feet : ''
  );
  const [inches, setInches] = useState<number | ''>(
    initialMetrics?.heightCm ? cmToFeetInches(initialMetrics.heightCm).inches : ''
  );
  const [weightLbs, setWeightLbs] = useState<number | ''>(
    initialMetrics?.weightKg ? Math.round(kgToLbs(initialMetrics.weightKg)) : ''
  );

  // Preset Selection State
  const [selectedGoal, setSelectedGoal] = useState<'cutting' | 'maintenance' | 'bulking'>('maintenance');
  const [selectedVariation, setSelectedVariation] = useState<'optimal' | 'highCarb' | 'highFat'>('optimal');

  // Imperial handlers
  const handleHeightImperialChange = (newFeet: number | '', newInches: number | '') => {
    setFeet(newFeet);
    setInches(newInches);
    if (newFeet !== '' || newInches !== '') {
      const f = typeof newFeet === 'number' ? newFeet : 0;
      const i = typeof newInches === 'number' ? newInches : 0;
      setHeightCm(Math.round(feetInchesToCm(f, i)));
    } else {
      setHeightCm('');
    }
  };

  const handleWeightImperialChange = (lbs: number | '') => {
    setWeightLbs(lbs);
    if (typeof lbs === 'number' && !isNaN(lbs) && lbs > 0) {
      setWeightKg(Number(lbsToKg(lbs).toFixed(1)));
    } else {
      setWeightKg('');
    }
  };

  // Metric handlers
  const handleHeightMetricChange = (cm: number | '') => {
    setHeightCm(cm);
    if (typeof cm === 'number' && !isNaN(cm) && cm > 0) {
      const fi = cmToFeetInches(cm);
      setFeet(fi.feet);
      setInches(fi.inches);
    } else {
      setFeet('');
      setInches('');
    }
  };

  const handleWeightMetricChange = (kg: number | '') => {
    setWeightKg(kg);
    if (typeof kg === 'number' && !isNaN(kg) && kg > 0) {
      setWeightLbs(Math.round(kgToLbs(kg)));
    } else {
      setWeightLbs('');
    }
  };

  // Navy Body Fat calculation handler
  const handleCalculateNavyBodyFat = () => {
    if (!sex || typeof heightCm !== 'number' || heightCm <= 0) return;
    const neck = parseFloat(neckCircumference);
    const waist = parseFloat(waistCircumference);
    const hip = hipCircumference ? parseFloat(hipCircumference) : undefined;

    if (!neck || !waist || (sex === 'female' && !hip)) return;

    // Convert from inches to cm if imperial
    const neckCm = unitPreference === 'imperial' ? neck * 2.54 : neck;
    const waistCm = unitPreference === 'imperial' ? waist * 2.54 : waist;
    const hipCm = hip ? (unitPreference === 'imperial' ? hip * 2.54 : hip) : undefined;

    const estimatedBF = calculateNavyBodyFat(sex, heightCm, waistCm, neckCm, hipCm);
    if (estimatedBF !== null) {
      setBodyFatInput(String(estimatedBF));
    }
  };

  const parsedBodyFat = bodyFatInput ? parseFloat(bodyFatInput) : undefined;

  // Effective metrics for live computing - uses entered values or standard baseline fallbacks for any unentered fields
  const effectiveAge = typeof age === 'number' && age > 0 ? age : 25;
  const effectiveHeightCm = typeof heightCm === 'number' && heightCm > 0 ? heightCm : 178;
  const effectiveWeightKg = typeof weightKg === 'number' && weightKg > 0 ? weightKg : 78;
  const effectiveActivity: ActivityLevel = activity || 'moderately_active';

  // Real-time calculation computation - computes live as soon as sex is selected
  const tdeeResult = useMemo(() => {
    if (!sex) return null;
    return calculateTDEEFromMetrics(
      sex,
      effectiveAge,
      effectiveHeightCm,
      effectiveWeightKg,
      effectiveActivity,
      parsedBodyFat && parsedBodyFat > 3 && parsedBodyFat < 60 ? parsedBodyFat : undefined
    );
  }, [sex, effectiveAge, effectiveHeightCm, effectiveWeightKg, effectiveActivity, parsedBodyFat]);

  const currentGoalPreset: GoalMacroPreset | undefined = tdeeResult ? tdeeResult.presets[selectedGoal] : undefined;
  const currentBreakdown: MacroBreakdown | undefined = currentGoalPreset ? currentGoalPreset.variations[selectedVariation] : undefined;

  const handlePromptSignUp = () => {
    if (onSignUpWithStats) {
      onSignUpWithStats({
        sex: sex ?? undefined,
        age: typeof age === 'number' ? age : undefined,
        heightCm: typeof heightCm === 'number' ? heightCm : undefined,
        weightKg: typeof weightKg === 'number' ? weightKg : undefined,
        bodyFat: parsedBodyFat,
        activity: activity || undefined,
      });
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Welcome Banner */}
      <div
        className="glass-card animate-fade-in responsive-card-padding"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span className="badge">
              <Sparkles size={13} /> Live Precision Engine
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• Free Guest Access</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '6px', color: 'var(--text-main)' }}>
            Calculate Your Total Daily Energy Expenditure (TDEE)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5' }}>
            Calculate your exact daily calorie burn, preview customized macro targets, and forecast your weight timeline in real time.
          </p>
        </div>

        {onSignUpWithStats && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', maxWidth: '240px' }}>
            <button
              onClick={handlePromptSignUp}
              className="btn-primary"
              style={{ width: '100%', fontSize: '13px' }}
            >
              <UserCheck size={16} />
              <span>Save Targets to Account</span>
            </button>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Free forever • Instant setup
            </span>
          </div>
        )}
      </div>

      {/* Main Responsive Grid: Input Controls (Left/Top) & Live Results (Right/Bottom) */}
      <div className="live-calculator-grid">
        {/* Left Column: Live Interactive Form Controls */}
        <div className="glass-card responsive-card-padding">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ background: 'var(--accent-gradient)', padding: '7px', borderRadius: '8px', color: '#ffffff' }}>
              <Sliders size={17} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Your Body Metrics</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calculations update instantly</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Biological Sex Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Biological Sex <span style={{ fontWeight: '400', fontSize: '11px', color: 'var(--text-muted)' }}>(for BMR formula)</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSex('male')}
                  style={{
                    padding: '9px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: sex === 'male' ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
                    background: sex === 'male' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                    color: sex === 'male' ? '#059669' : 'var(--text-secondary)',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Male (+5 BMR)
                </button>
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  style={{
                    padding: '9px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: sex === 'female' ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
                    background: sex === 'female' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                    color: sex === 'female' ? '#059669' : 'var(--text-secondary)',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Female (-161 BMR)
                </button>
              </div>
            </div>

            {/* Age & Body Fat Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Age <span style={{ fontWeight: '400', fontSize: '10px', color: 'var(--text-muted)' }}>(yrs)</span>
                </label>
                <input
                  type="number"
                  min="12"
                  max="110"
                  placeholder="e.g. 25"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value) || '')}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                  Body Fat % <span style={{ fontWeight: '400', fontSize: '10px', color: 'var(--text-muted)' }}>(opt)</span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="60"
                  placeholder="e.g. 15"
                  value={bodyFatInput}
                  onChange={(e) => setBodyFatInput(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Height Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                Height {unitPreference === 'imperial' ? '(Feet & Inches)' : '(Centimeters)'}
              </label>
              {unitPreference === 'imperial' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      placeholder="5"
                      value={feet}
                      onChange={(e) => handleHeightImperialChange(e.target.value === '' ? '' : parseInt(e.target.value) || 0, inches)}
                      className="input-field"
                      style={{ paddingRight: '26px' }}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>ft</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      placeholder="10"
                      value={inches}
                      onChange={(e) => handleHeightImperialChange(feet, e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                      className="input-field"
                      style={{ paddingRight: '26px' }}
                    />
                    <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>in</span>
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="90"
                    max="250"
                    placeholder="178"
                    value={heightCm}
                    onChange={(e) => handleHeightMetricChange(e.target.value === '' ? '' : parseInt(e.target.value) || '')}
                    className="input-field"
                    style={{ paddingRight: '32px' }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>cm</span>
                </div>
              )}
            </div>

            {/* Weight Field */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                Weight {unitPreference === 'imperial' ? '(Pounds - lbs)' : '(Kilograms - kg)'}
              </label>
              {unitPreference === 'imperial' ? (
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="50"
                    max="800"
                    placeholder="172"
                    value={weightLbs}
                    onChange={(e) => handleWeightImperialChange(e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                    className="input-field"
                    style={{ paddingRight: '32px' }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>lbs</span>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="25"
                    max="350"
                    placeholder="78"
                    value={weightKg}
                    onChange={(e) => handleWeightMetricChange(e.target.value === '' ? '' : parseFloat(e.target.value) || '')}
                    className="input-field"
                    style={{ paddingRight: '32px' }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
                </div>
              )}
            </div>

            {/* Activity Level Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                Activity Level Multiplier
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="input-field"
                style={{ cursor: 'pointer', color: activity ? 'var(--text-main)' : 'var(--text-muted)' }}
              >
                <option value="" disabled>Select activity level...</option>
                <option value="sedentary">Sedentary (1.2x) — Little/no exercise</option>
                <option value="lightly_active">Lightly Active (1.375x) — 1 to 3 days/wk</option>
                <option value="moderately_active">Moderately Active (1.55x) — 3 to 5 days/wk</option>
                <option value="very_active">Very Active (1.725x) — 6 to 7 days/wk</option>
                <option value="extremely_active">Extremely Active (1.9x) — Heavy physical</option>
              </select>
            </div>

            {/* Expandable Advanced / Optionals Section */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent)',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '4px 0',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calculator size={14} />
                  <span>Body Fat Tape Helper</span>
                </span>
                {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showAdvanced && (
                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Measure your neck & waist to estimate your body fat % (US Navy equation):
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: sex === 'female' ? '1fr 1fr 1fr' : '1fr 1fr', gap: '6px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        Neck {unitPreference === 'imperial' ? '(in)' : '(cm)'}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder={unitPreference === 'imperial' ? '15.5' : '39'}
                        value={neckCircumference}
                        onChange={(e) => setNeckCircumference(e.target.value)}
                        className="input-field"
                        style={{ padding: '6px 8px', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                        Waist {unitPreference === 'imperial' ? '(in)' : '(cm)'}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder={unitPreference === 'imperial' ? '33.0' : '84'}
                        value={waistCircumference}
                        onChange={(e) => setWaistCircumference(e.target.value)}
                        className="input-field"
                        style={{ padding: '6px 8px', fontSize: '12px' }}
                      />
                    </div>

                    {sex === 'female' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                          Hips {unitPreference === 'imperial' ? '(in)' : '(cm)'}
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          placeholder={unitPreference === 'imperial' ? '36.0' : '91'}
                          value={hipCircumference}
                          onChange={(e) => setHipCircumference(e.target.value)}
                          className="input-field"
                          style={{ padding: '6px 8px', fontSize: '12px' }}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleCalculateNavyBodyFat}
                    className="btn-ghost"
                    style={{ fontSize: '11px', padding: '6px 10px', minHeight: '32px', justifyContent: 'center' }}
                  >
                    Calculate & Apply BF%
                  </button>
                </div>
              )}
            </div>

            {/* Formula Status Callout */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                background: !tdeeResult ? 'rgba(245, 158, 11, 0.08)' : 'rgba(59, 130, 246, 0.06)',
                border: !tdeeResult ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: '11px',
                color: !tdeeResult ? '#d97706' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={14} style={{ color: !tdeeResult ? '#d97706' : 'var(--macro-protein)', flexShrink: 0 }} />
              <span>
                {!tdeeResult
                  ? '👉 Enter your details above to calculate your exact BMR and daily calorie burn.'
                  : tdeeResult.formulaUsed === 'katch_mcardle'
                  ? '⚡ Katch-McArdle Formula active (calibrated with Lean Body Mass).'
                  : '✨ Mifflin-St Jeor Formula active (standard metabolic baseline).'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calibrated Output, 9-Preset Matrix, & Weight Forecast */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Metric Summary Grid */}
          <div className="metric-summary-grid">
            <div className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                  Basal Metabolic Rate
                </span>
                <Activity size={16} style={{ color: 'var(--macro-protein)' }} />
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
                {tdeeResult ? tdeeResult.bmr : '—'} {tdeeResult && <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>kcal</span>}
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
              <div style={{ fontSize: '28px', fontWeight: '800', color: tdeeResult ? 'var(--color-accent)' : 'var(--text-muted)' }}>
                {tdeeResult ? tdeeResult.tdee : '—'} {tdeeResult && <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}>kcal</span>}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Total daily calories to maintain weight
              </div>
            </div>

            {tdeeResult?.leanBodyMassKg && (
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

          {/* 9-Preset Interactive Matrix */}
          <div className="glass-card responsive-card-padding">
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Macro Targets</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                Calibrated to protect lean muscle mass & optimize hormone health
              </p>
            </div>

            {/* Goal Tabs (Cut, Maintain, Bulk) */}
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

            {/* Diet Variation Sub-Tabs */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSelectedVariation('optimal')}
                className={`pill-btn ${selectedVariation === 'optimal' ? 'active' : ''}`}
              >
                Balanced
              </button>

              <button
                type="button"
                onClick={() => setSelectedVariation('highCarb')}
                className={`pill-btn ${selectedVariation === 'highCarb' ? 'active' : ''}`}
              >
                High Carb
              </button>

              <button
                type="button"
                onClick={() => setSelectedVariation('highFat')}
                className={`pill-btn ${selectedVariation === 'highFat' ? 'active' : ''}`}
              >
                High Fat
              </button>
            </div>

            {/* Target Breakdown Box */}
            {currentBreakdown ? (
              <div
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Calorie Goal</span>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)' }}>
                      {currentBreakdown.calories} <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--text-muted)' }}>kcal</span>
                    </div>
                  </div>
                  <div className="badge">
                    {selectedGoal.toUpperCase()} • {selectedVariation === 'optimal' ? 'BALANCED' : selectedVariation === 'highCarb' ? 'HIGH CARB' : 'HIGH FAT'}
                  </div>
                </div>

                {/* Macro Proportion Bar */}
                <div style={{ height: '8px', width: '100%', display: 'flex', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05) inset' }}>
                  <div style={{ width: `${currentBreakdown.proteinPercentage}%`, background: 'var(--macro-protein)' }} title={`Protein: ${currentBreakdown.proteinPercentage}%`} />
                  <div style={{ width: `${currentBreakdown.carbPercentage}%`, background: 'var(--macro-carbs)' }} title={`Carbs: ${currentBreakdown.carbPercentage}%`} />
                  <div style={{ width: `${currentBreakdown.fatPercentage}%`, background: 'var(--macro-fats)' }} title={`Fats: ${currentBreakdown.fatPercentage}%`} />
                </div>

                {/* 3 Macro Cards with Exact User Palette Colors */}
                <div className="macro-cards-grid">
                  <div style={{ background: 'var(--bg-surface)', border: '1.5px solid rgba(59, 130, 246, 0.25)', padding: '10px 12px', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '10px', color: 'var(--macro-protein)', fontWeight: '700', textTransform: 'uppercase' }}>
                      Protein ({currentBreakdown.proteinPercentage}%)
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
                      Carbs ({currentBreakdown.carbPercentage}%)
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
                      Fats ({currentBreakdown.fatPercentage}%)
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
            ) : (
              <div
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px dashed var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '24px 16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Activity size={24} style={{ color: 'var(--color-accent)', opacity: 0.8 }} />
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                  Select Biological Sex to View Macro Targets
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '340px', margin: 0 }}>
                  Choose Male or Female on the left to compute your exact calorie target and macro ratios.
                </p>
              </div>
            )}
          </div>

          {/* Real-time Weight Forecast Card (4/8/12 weeks + Target Goal Estimator) */}
          {tdeeResult && currentBreakdown ? (
            <WeightForecastCard
              currentWeightKg={effectiveWeightKg}
              tdee={tdeeResult.tdee}
              calorieTarget={currentBreakdown.calories}
              goal={selectedGoal}
              unitPreference={unitPreference}
            />
          ) : (
            <div
              className="glass-card responsive-card-padding"
              style={{
                textAlign: 'center',
                padding: '24px 16px',
                border: '1px dashed var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Target size={24} style={{ color: 'var(--text-muted)', opacity: 0.7 }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                Weight Timeline Forecast
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '340px', margin: 0 }}>
                Select your biological sex above to unlock 4, 8, and 12-week weight progression milestones.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Professional Medical & Dietary Disclaimer */}
      <FooterDisclaimer onOpenLegal={onOpenLegal} />
    </div>
  );
};
