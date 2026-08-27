import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import type { UserProfile, TDEEResult, UnitPreference } from '../types/user';
import { ProfileStatsModal } from './ProfileStatsModal';
import { OnboardingModal } from './OnboardingModal';
import { TDEECalculatorView } from './TDEECalculatorView';
import { FooterDisclaimer } from './FooterDisclaimer';
import { cmToFeetInches, kgToLbs } from '../utils/units';
import { Settings2, User, Loader2, CheckCircle2 } from 'lucide-react';
import type { GuestMetrics } from './LiveTDEECalculator';

interface DashboardProps {
  unitPreference: UnitPreference;
  onUnitToggle: (unit: UnitPreference) => void;
  guestMetricsHandover?: GuestMetrics | null;
  isStatsModalOpen: boolean;
  setIsStatsModalOpen: (open: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  unitPreference,
  onUnitToggle,
  guestMetricsHandover,
  isStatsModalOpen,
  setIsStatsModalOpen,
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tdeeResult, setTdeeResult] = useState<TDEEResult | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const fetchProfileData = async () => {
    setIsLoadingProfile(true);
    try {
      const res = await userService.getProfile();
      if (res.success && res.data) {
        setProfile(res.data.profile);
        setTdeeResult(res.data.tdeeResult);
        if (res.data.profile.unitPreference) {
          onUnitToggle(res.data.profile.unitPreference);
        }
        // Trigger onboarding if setup was left incomplete or user came with guest metrics
        if (res.data.profile.isSetupComplete === false || guestMetricsHandover) {
          setShowOnboarding(true);
        }
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSaveProfile = async (updatedFields: Partial<UserProfile>) => {
    const res = await userService.updateProfile({
      ...updatedFields,
      unitPreference,
    });
    if (res.success && res.data) {
      setProfile(res.data.profile);
      setTdeeResult(res.data.tdeeResult);
    }
  };

  const handleCompleteOnboarding = async (updatedFields: Partial<UserProfile>) => {
    await handleSaveProfile(updatedFields);
    setShowOnboarding(false);
  };

  const heightDisplay = profile
    ? unitPreference === 'imperial'
      ? `${cmToFeetInches(profile.heightCm).feet}'${cmToFeetInches(profile.heightCm).inches}"`
      : `${profile.heightCm} cm`
    : '--';

  const weightDisplay = profile
    ? unitPreference === 'imperial'
      ? `${Math.round(kgToLbs(profile.weightKg))} lbs`
      : `${profile.weightKg} kg`
    : '--';

  return (
    <div style={{ width: '100%', maxWidth: '1140px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      {/* User Bio Quick Summary Bar */}
      <section
        className="glass-card"
        style={{
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          border: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              background: 'var(--bg-surface)',
              padding: '14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              color: 'var(--color-accent)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <User size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)' }}>@{user?.username}</h1>
              <span className="badge" style={{ textTransform: 'capitalize' }}>
                <CheckCircle2 size={12} /> {profile?.biologicalSex ?? 'User'}
              </span>
              <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--macro-protein)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                {profile?.activityLevel?.replace('_', ' ') ?? 'Active'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '6px', fontSize: '13px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span>Age: <strong style={{ color: 'var(--text-main)' }}>{profile?.age ?? 25}</strong></span>
              <span>Height: <strong style={{ color: 'var(--text-main)' }}>{heightDisplay}</strong></span>
              <span>Weight: <strong style={{ color: 'var(--text-main)' }}>{weightDisplay}</strong></span>
              {profile?.bodyFatPercentage && (
                <span>Body Fat: <strong style={{ color: 'var(--macro-protein)' }}>{profile.bodyFatPercentage}%</strong></span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsStatsModalOpen(true)}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '13px' }}
        >
          <Settings2 size={16} />
          <span>Update Body Stats</span>
        </button>
      </section>

      {/* Main Content Area */}
      {isLoadingProfile ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Loader2 size={36} style={{ color: 'var(--color-accent)', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Calibrating your personal metabolic blueprint...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* TDEE & 9 Presets Matrix & Weight Forecast */}
          <TDEECalculatorView
            tdeeResult={tdeeResult}
            weightKg={profile?.weightKg ?? 78}
            unitPreference={unitPreference}
            onOpenSettings={() => setIsStatsModalOpen(true)}
          />

          {/* Professional Medical & Dietary Disclaimer */}
          <FooterDisclaimer />
        </div>
      )}

      {/* Onboarding Modal for First Login / Unfinished Stats */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
        initialProfile={profile}
        initialGuestMetrics={guestMetricsHandover}
        unitPreference={unitPreference}
      />

      {/* Profile Stats Settings Modal */}
      <ProfileStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        profile={profile}
        unitPreference={unitPreference}
        onSave={handleSaveProfile}
      />
    </div>
  );
};
