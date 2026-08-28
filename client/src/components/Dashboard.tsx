import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import type { UserProfile, TDEEResult, UnitPreference, SelectedGoal, ThemePreference } from '../types/user';
import { ProfileStatsModal } from './ProfileStatsModal';
import { OnboardingModal } from './OnboardingModal';
import { LegalConsentModal } from './LegalConsentModal';
import { TDEECalculatorView } from './TDEECalculatorView';
import { FeatureRoadmapCard } from './FeatureRoadmapCard';
import { FooterDisclaimer } from './FooterDisclaimer';
import { cmToFeetInches, kgToLbs } from '../utils/units';
import { Settings2, User, Loader2 } from 'lucide-react';
import type { GuestMetrics } from './LiveTDEECalculator';

interface DashboardProps {
  unitPreference: UnitPreference;
  onUnitToggle: (unit: UnitPreference) => void;
  guestMetricsHandover?: GuestMetrics | null;
  isStatsModalOpen: boolean;
  setIsStatsModalOpen: (open: boolean) => void;
  onThemeSync?: (theme: ThemePreference) => void;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  unitPreference,
  onUnitToggle,
  guestMetricsHandover,
  isStatsModalOpen,
  setIsStatsModalOpen,
  onThemeSync,
  onOpenLegal,
}) => {
  const { user, logout } = useAuth();
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
        if (res.data.profile.themePreference) {
          onThemeSync?.(res.data.profile.themePreference);
        }
        // Trigger onboarding ONLY immediately following a new account registration
        const isNewSignup = sessionStorage.getItem('just_signed_up') === 'true';
        if (isNewSignup) {
          sessionStorage.removeItem('just_signed_up');
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
    });
    if (res.success && res.data) {
      setProfile(res.data.profile);
      setTdeeResult(res.data.tdeeResult);
    }
  };

  const handleAcceptLegal = async () => {
    const res = await userService.updateProfile({
      privacyPolicyAccepted: true,
      termsAccepted: true,
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

  const handleGoalChange = async (goal: SelectedGoal) => {
    await handleSaveProfile({ selectedGoal: goal });
  };

  const handleTargetWeightChange = async (targetWeight: number | null) => {
    await handleSaveProfile({ targetGoalWeight: targetWeight });
  };

  const needsLegalConsent = Boolean(
    profile && (!profile.privacyPolicyAccepted || !profile.termsAccepted)
  );

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', width: '100%' }}>
      {/* Top Welcome Header Bar */}
      <div
        className="glass-card responsive-card-padding"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
            }}
          >
            <User size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Welcome back, {user?.username}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {profile ? (
                <>
                  {profile.biologicalSex === 'male' ? 'Male' : 'Female'}, {profile.age} yrs •{' '}
                  {unitPreference === 'imperial'
                    ? `${cmToFeetInches(profile.heightCm).feet}'${cmToFeetInches(profile.heightCm).inches}" • ${Math.round(kgToLbs(profile.weightKg))} lbs`
                    : `${Math.round(profile.heightCm)} cm • ${Math.round(profile.weightKg)} kg`}
                  {profile.bodyFatPercentage ? ` • ${profile.bodyFatPercentage}% BF` : ''}
                </>
              ) : (
                'Loading profile parameters...'
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Settings2 size={16} />
            <span>Update Metrics</span>
          </button>
        </div>
      </div>

      {isLoadingProfile ? (
        <div
          className="glass-card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Loader2 size={32} style={{ color: 'var(--color-accent)', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading metabolic calculation engine...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Phase 2 Feature Roadmap Card */}
          <FeatureRoadmapCard />

          {/* TDEE & Macro Targets Matrix & Weight Forecast */}
          <TDEECalculatorView
            tdeeResult={tdeeResult}
            weightKg={profile?.weightKg ?? 78}
            unitPreference={unitPreference}
            initialSelectedGoal={profile?.selectedGoal ?? 'maintenance'}
            initialTargetWeight={profile?.targetGoalWeight}
            onGoalChange={handleGoalChange}
            onTargetWeightChange={handleTargetWeightChange}
            onOpenSettings={() => setIsStatsModalOpen(true)}
          />

          {/* Professional Medical & Dietary Disclaimer + Copyright */}
          <FooterDisclaimer onOpenLegal={onOpenLegal} />
        </div>
      )}

      {/* Mandatory Privacy & Terms Acceptance Modal */}
      <LegalConsentModal
        isOpen={needsLegalConsent}
        onAccept={handleAcceptLegal}
        onSignOut={logout}
        onViewDocument={(tab) => onOpenLegal?.(tab)}
      />

      {/* Onboarding Modal for First Login / Unfinished Stats */}
      <OnboardingModal
        isOpen={showOnboarding && !needsLegalConsent}
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
