import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { UserProfile, BiologicalSex, ActivityLevel, UnitPreference } from '../types/user';
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg, inchesToCm } from '../utils/units';
import { calculateNavyBodyFat } from '../utils/tdeeCalculator';
import { X, UserCheck, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface ProfileStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  unitPreference: UnitPreference;
  onSave: (updated: Partial<UserProfile>) => Promise<void>;
}

export const ProfileStatsModal: React.FC<ProfileStatsModalProps> = ({
  isOpen,
  onClose,
  profile,
  unitPreference,
  onSave,
}) => {
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [age, setAge] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(78);
  const [bodyFat, setBodyFat] = useState<string>('');
  const [activity, setActivity] = useState<ActivityLevel>('moderately_active');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // US Navy Tape Measure Helper state
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [neckCircumference, setNeckCircumference] = useState<string>('');
  const [waistCircumference, setWaistCircumference] = useState<string>('');
  const [hipCircumference, setHipCircumference] = useState<string>('');

  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(10);
  const [weightLbs, setWeightLbs] = useState<number>(172);

  useEffect(() => {
    if (profile) {
      setSex(profile.biologicalSex);
      setAge(profile.age);
      setHeightCm(profile.heightCm);
      setWeightKg(profile.weightKg);
      setBodyFat(profile.bodyFatPercentage ? String(profile.bodyFatPercentage) : '');
      setActivity(profile.activityLevel);

      const fi = cmToFeetInches(profile.heightCm);
      setFeet(fi.feet);
      setInches(fi.inches);
      setWeightLbs(Math.round(kgToLbs(profile.weightKg)));
      setSaveError(null);
    }
  }, [profile, isOpen, unitPreference]);

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
    setSaveError(null);
    try {
      await onSave({
        biologicalSex: sex,
        age: age || 25,
        heightCm: heightCm || 178,
        weightKg: weightKg || 70,
        bodyFatPercentage: parsedBodyFat,
        activityLevel: activity,
        unitPreference,
      });
      onClose();
    } catch (err: unknown) {
      console.error('Failed to save profile stats:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      className="modal-backdrop-fixed"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card animate-modal modal-responsive-card"
        style={{
          position: 'relative',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="modal-close-icon"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
          }}
          title="Close"
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '10px', color: '#ffffff', boxShadow: 'var(--accent-glow)' }}>
            <UserCheck size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>Body Statistics & TDEE Settings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Used for precision BMR & macro mathematical models
            </p>
          </div>
        </div>

        {saveError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            {saveError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Biological Sex (For BMR Metabolic Formula)
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Age (years)
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
                Body Fat % (Optional)
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
