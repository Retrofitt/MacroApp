import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type {
  UserProfile,
  BiologicalSex,
  ActivityLevel,
  UnitPreference,
} from '../types/user';
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg, inchesToCm } from '../utils/units';
import { calculateNavyBodyFat } from '../utils/tdeeCalculator';
import { Sparkles, CheckCircle2, Loader2, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: Partial<UserProfile>) => Promise<void>;
  initialProfile?: UserProfile | null;
  initialGuestMetrics?: {
    sex?: BiologicalSex;
    age?: number;
    heightCm?: number;
    weightKg?: number;
    bodyFat?: number;
    activity?: ActivityLevel;
  } | null;
  unitPreference: UnitPreference;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialProfile,
  initialGuestMetrics,
  unitPreference,
}) => {
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [age, setAge] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(78);
  const [bodyFat, setBodyFat] = useState<string>('');
  const [activity, setActivity] = useState<ActivityLevel>('moderately_active');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // US Navy Tape Measure Helper state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [neckCircumference, setNeckCircumference] = useState<string>('');
  const [waistCircumference, setWaistCircumference] = useState<string>('');
  const [hipCircumference, setHipCircumference] = useState<string>('');

  // Imperial helper state
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(10);
  const [weightLbs, setWeightLbs] = useState<number>(172);

  useEffect(() => {
    // If guest metrics were saved right before registration, prioritize them
    if (initialGuestMetrics) {
      if (initialGuestMetrics.sex) setSex(initialGuestMetrics.sex);
      if (initialGuestMetrics.age) setAge(initialGuestMetrics.age);
      if (initialGuestMetrics.heightCm) {
        setHeightCm(initialGuestMetrics.heightCm);
        const fi = cmToFeetInches(initialGuestMetrics.heightCm);
        setFeet(fi.feet);
        setInches(fi.inches);
      }
      if (initialGuestMetrics.weightKg) {
        setWeightKg(initialGuestMetrics.weightKg);
        setWeightLbs(Math.round(kgToLbs(initialGuestMetrics.weightKg)));
      }
      if (initialGuestMetrics.bodyFat !== undefined) {
        setBodyFat(String(initialGuestMetrics.bodyFat));
      }
      if (initialGuestMetrics.activity) setActivity(initialGuestMetrics.activity);
    } else if (initialProfile) {
      setSex(initialProfile.biologicalSex);
      setAge(initialProfile.age);
      setHeightCm(initialProfile.heightCm);
      setWeightKg(initialProfile.weightKg);
      setBodyFat(initialProfile.bodyFatPercentage ? String(initialProfile.bodyFatPercentage) : '');
      setActivity(initialProfile.activityLevel);

      const fi = cmToFeetInches(initialProfile.heightCm);
      setFeet(fi.feet);
      setInches(fi.inches);
      setWeightLbs(Math.round(kgToLbs(initialProfile.weightKg)));
    }
  }, [initialGuestMetrics, initialProfile]);

  if (!isOpen) return null;

  const handleHeightImperialChange = (newFeet: number, newInches: number) => {
    const validFeet = isNaN(newFeet) ? 0 : newFeet;
    const validInches = isNaN(newInches) ? 0 : newInches;
    setFeet(validFeet);
    setInches(validInches);
    setHeightCm(Math.round(feetInchesToCm(validFeet, validInches)));
  };

  const handleWeightImperialChange = (lbs: number) => {
    const validLbs = isNaN(lbs) ? 0 : lbs;
    setWeightLbs(validLbs);
    setWeightKg(Number(lbsToKg(validLbs).toFixed(1)));
  };

  const handleHeightMetricChange = (cm: number) => {
    const validCm = isNaN(cm) ? 0 : cm;
    setHeightCm(validCm);
    const fi = cmToFeetInches(validCm);
    setFeet(fi.feet);
    setInches(fi.inches);
  };

  const handleWeightMetricChange = (kg: number) => {
    const validKg = isNaN(kg) ? 0 : kg;
    setWeightKg(validKg);
    setWeightLbs(Math.round(kgToLbs(validKg)));
  };

  const handleAutoCalculateBodyFat = (
    neckVal: string,
    waistVal: string,
    hipVal: string
  ) => {
    const n = parseFloat(neckVal);
    const w = parseFloat(waistVal);
    const h = parseFloat(hipVal);

    if (!n || !w || (sex === 'female' && !h)) return;

    const neckCm = unitPreference === 'imperial' ? inchesToCm(n) : n;
    const waistCm = unitPreference === 'imperial' ? inchesToCm(w) : w;
    const hipCm = sex === 'female' ? (unitPreference === 'imperial' ? inchesToCm(h) : h) : undefined;

    const estimatedBF = calculateNavyBodyFat(sex, heightCm, waistCm, neckCm, hipCm);
    if (estimatedBF !== null) {
      setBodyFat(String(estimatedBF));
    }
  };

  const parsedBodyFat = bodyFat ? parseFloat(bodyFat) : undefined;
  const isKatchActive = Boolean(parsedBodyFat && parsedBodyFat > 3 && parsedBodyFat < 60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onComplete({
        biologicalSex: sex,
        age: age || 25,
        heightCm: heightCm || 178,
        weightKg: weightKg || 70,
        bodyFatPercentage: parsedBodyFat,
        activityLevel: activity,
        unitPreference,
        isSetupComplete: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      className="modal-backdrop-fixed"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Keep onboarding focused
        }
      }}
    >
      <div
        className="glass-card animate-modal modal-responsive-card"
        style={{
          border: '1.5px solid var(--color-accent)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Onboarding Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <div
            style={{
              background: 'var(--accent-gradient)',
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              color: '#ffffff',
              boxShadow: 'var(--accent-glow)',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span className="badge" style={{ fontSize: '10px', padding: '1px 7px' }}>
                Onboarding Setup
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Your Metabolic Profile
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Confirm your statistics to personalize your BMR, TDEE, and macro targets
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Sex Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Biological Sex <span style={{ fontWeight: '400', fontSize: '11px', color: 'var(--text-muted)' }}>(for BMR formula)</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSex('male')}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: sex === 'male' ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
                  background: sex === 'male' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                  color: sex === 'male' ? 'var(--color-accent)' : 'var(--text-secondary)',
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
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: sex === 'female' ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
                  background: sex === 'female' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                  color: sex === 'female' ? 'var(--color-accent)' : 'var(--text-secondary)',
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

          {/* Age and Body Fat */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Age <span style={{ fontWeight: '400', fontSize: '11px', color: 'var(--text-muted)' }}>(years)</span>
              </label>
              <input
                type="number"
                min="12"
                max="110"
                placeholder="25"
                value={age || ''}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Body Fat % <span style={{ fontWeight: '400', fontSize: '11px', color: 'var(--text-muted)' }}>(optional)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="3"
                max="60"
                placeholder="e.g. 15"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* US Navy Body Fat Tape Helper Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 0',
              }}
            >
              {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              <span>{showAdvanced ? 'Hide Tape Calculator' : '+ Calculate Body Fat % (US Navy Tape)'}</span>
            </button>

            {showAdvanced && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
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
                      onChange={(e) => {
                        setNeckCircumference(e.target.value);
                        handleAutoCalculateBodyFat(e.target.value, waistCircumference, hipCircumference);
                      }}
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
                      onChange={(e) => {
                        setWaistCircumference(e.target.value);
                        handleAutoCalculateBodyFat(neckCircumference, e.target.value, hipCircumference);
                      }}
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
                        onChange={(e) => {
                          setHipCircumference(e.target.value);
                          handleAutoCalculateBodyFat(neckCircumference, waistCircumference, e.target.value);
                        }}
                        className="input-field"
                        style={{ padding: '6px 8px', fontSize: '12px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Height and Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Height {unitPreference === 'imperial' ? '(ft & in)' : '(cm)'}
              </label>
              {unitPreference === 'imperial' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="3"
                      max="8"
                      placeholder="5"
                      value={feet || ''}
                      onChange={(e) => handleHeightImperialChange(parseInt(e.target.value) || 0, inches)}
                      className="input-field"
                      style={{ paddingRight: '22px' }}
                    />
                    <span style={{ position: 'absolute', right: '8px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>ft</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      max="11"
                      placeholder="10"
                      value={inches || ''}
                      onChange={(e) => handleHeightImperialChange(feet, parseInt(e.target.value) || 0)}
                      className="input-field"
                      style={{ paddingRight: '22px' }}
                    />
                    <span style={{ position: 'absolute', right: '8px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>in</span>
                  </div>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="90"
                    max="250"
                    placeholder="178"
                    value={heightCm || ''}
                    onChange={(e) => handleHeightMetricChange(parseInt(e.target.value) || 0)}
                    className="input-field"
                    style={{ paddingRight: '32px' }}
                  />
                  <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>cm</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Weight {unitPreference === 'imperial' ? '(lbs)' : '(kg)'}
              </label>
              {unitPreference === 'imperial' ? (
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.5"
                    min="50"
                    max="800"
                    placeholder="172"
                    value={weightLbs || ''}
                    onChange={(e) => handleWeightImperialChange(parseFloat(e.target.value) || 0)}
                    className="input-field"
                    style={{ paddingRight: '32px' }}
                  />
                  <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>lbs</span>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="25"
                    max="350"
                    placeholder="78"
                    value={weightKg || ''}
                    onChange={(e) => handleWeightMetricChange(parseFloat(e.target.value) || 0)}
                    className="input-field"
                    style={{ paddingRight: '32px' }}
                  />
                  <span style={{ position: 'absolute', right: '10px', top: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>kg</span>
                </div>
              )}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="sedentary">Sedentary (1.2x) — Little or no exercise</option>
              <option value="lightly_active">Lightly Active (1.375x) — 1 to 3 days/week</option>
              <option value="moderately_active">Moderately Active (1.55x) — 3 to 5 training days/week</option>
              <option value="very_active">Very Active (1.725x) — 6 to 7 intense sessions/week</option>
              <option value="extremely_active">Extremely Active (1.9x) — Physical job & heavy lifting</option>
            </select>
          </div>

          {/* Formula Status Callout */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.06)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--macro-protein)', flexShrink: 0 }} />
            <span>
              {isKatchActive
                ? '⚡ Katch-McArdle Formula active (calibrated with Lean Body Mass).'
                : '✨ Mifflin-St Jeor Formula active (standard metabolic baseline).'}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '6px', fontSize: '14px' }}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Saving Your Metabolic Blueprint...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Save Profile & Open Dashboard</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};
