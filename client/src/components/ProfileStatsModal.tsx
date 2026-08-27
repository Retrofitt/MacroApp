import React, { useState, useEffect } from 'react';
import type { UserProfile, BiologicalSex, ActivityLevel, UnitPreference } from '../types/user';
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg } from '../utils/units';
import { X, UserCheck, Sparkles, Loader2 } from 'lucide-react';

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
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleHeightImperialChange = (newFeet: number, newInches: number) => {
    setFeet(newFeet);
    setInches(newInches);
    setHeightCm(Math.round(feetInchesToCm(newFeet, newInches)));
  };

  const handleWeightImperialChange = (lbs: number) => {
    setWeightLbs(lbs);
    setWeightKg(Number(lbsToKg(lbs).toFixed(1)));
  };

  const handleHeightMetricChange = (cm: number) => {
    setHeightCm(cm);
    const fi = cmToFeetInches(cm);
    setFeet(fi.feet);
    setInches(fi.inches);
  };

  const handleWeightMetricChange = (kg: number) => {
    setWeightKg(kg);
    setWeightLbs(Math.round(kgToLbs(kg)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        biologicalSex: sex,
        age,
        heightCm,
        weightKg,
        bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : undefined,
        activityLevel: activity,
        unitPreference,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
      }}
    >
      <div
        className="glass-card animate-modal modal-responsive-card"
        style={{
          maxWidth: '560px',
          position: 'relative',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--accent-gradient)', padding: '8px', borderRadius: '10px', color: '#ffffff', boxShadow: 'var(--accent-glow)' }}>
            <UserCheck size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>Body Statistics & TDEE Settings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Used strictly for precision BMR & macro mathematical models
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Biological Sex (For BMR Metabolic Formula)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setSex('male')}
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: sex === 'male' ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
                  background: sex === 'male' ? 'rgba(16, 185, 129, 0.1)' : '#f8fafc',
                  color: sex === 'male' ? '#059669' : 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer',
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
                  background: sex === 'female' ? 'rgba(16, 185, 129, 0.1)' : '#f8fafc',
                  color: sex === 'female' ? '#059669' : 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Female (-161 BMR)
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Age
              </label>
              <input
                type="number"
                min="12"
                max="110"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Body Fat % (Optional)
              </label>
              <input
                type="number"
                step="0.1"
                min="3"
                max="60"
                placeholder="e.g. 15 (Enables Katch-McArdle)"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Height {unitPreference === 'imperial' ? '(Feet & Inches)' : '(cm)'}
              </label>
              {unitPreference === 'imperial' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="number"
                    min="3"
                    max="8"
                    placeholder="Ft"
                    value={feet}
                    onChange={(e) => handleHeightImperialChange(parseInt(e.target.value) || 0, inches)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder="In"
                    value={inches}
                    onChange={(e) => handleHeightImperialChange(feet, parseInt(e.target.value) || 0)}
                    className="input-field"
                  />
                </div>
              ) : (
                <input
                  type="number"
                  min="90"
                  max="250"
                  value={heightCm}
                  onChange={(e) => handleHeightMetricChange(parseInt(e.target.value) || 0)}
                  className="input-field"
                />
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Weight {unitPreference === 'imperial' ? '(lbs)' : '(kg)'}
              </label>
              {unitPreference === 'imperial' ? (
                <input
                  type="number"
                  step="0.5"
                  value={weightLbs}
                  onChange={(e) => handleWeightImperialChange(parseFloat(e.target.value) || 0)}
                  className="input-field"
                />
              ) : (
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => handleWeightMetricChange(parseFloat(e.target.value) || 0)}
                  className="input-field"
                />
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Activity Level
            </label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityLevel)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="sedentary">Sedentary (1.2x) — Little to no formal exercise</option>
              <option value="lightly_active">Lightly Active (1.375x) — 1 to 3 light sessions/week</option>
              <option value="moderately_active">Moderately Active (1.55x) — 3 to 5 training sessions/week</option>
              <option value="very_active">Very Active (1.725x) — 6 to 7 intense sessions/week</option>
              <option value="extremely_active">Extremely Active (1.9x) — Daily intense lifting & physical job</option>
            </select>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Sparkles size={18} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <span>
              {bodyFat
                ? 'Katch-McArdle formula enabled: Uses your Lean Body Mass for athlete-grade accuracy.'
                : 'Mifflin-St Jeor formula enabled: Accurate standard baseline for general population.'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Saving...
                </>
              ) : (
                'Save & Calculate'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
