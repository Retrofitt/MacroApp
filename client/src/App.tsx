import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LiveTDEECalculator, type GuestMetrics } from './components/LiveTDEECalculator';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import { LegalModal, type LegalTab } from './components/LegalModal';
import { userService } from './services/userService';
import type { UnitPreference, ThemePreference } from './types/user';
import { Loader2 } from 'lucide-react';

const MainView: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [unitPreference, setUnitPreference] = useState<UnitPreference>('imperial');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [guestMetricsHandover, setGuestMetricsHandover] = useState<GuestMetrics | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);

  // Legal Modal State (Privacy Policy / Terms of Service)
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  // Theme State: Defaults to light for guests; synced to account profile for signed-in members
  const [theme, setTheme] = useState<ThemePreference>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // When user signs out, reset to standard guest defaults
  useEffect(() => {
    if (!user) {
      setTheme('light');
      setUnitPreference('imperial');
    }
  }, [user]);

  const toggleTheme = async () => {
    const nextTheme: ThemePreference = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);

    // Persist theme to Cloudflare D1 if user is logged in
    if (user) {
      try {
        await userService.updateProfile({ themePreference: nextTheme });
      } catch (err) {
        console.error('Failed to persist theme preference:', err);
      }
    }
  };

  const handleUnitToggle = async (newUnit: UnitPreference) => {
    setUnitPreference(newUnit);

    // Persist unit preference to Cloudflare D1 if user is logged in
    if (user) {
      try {
        await userService.updateProfile({ unitPreference: newUnit });
      } catch (err) {
        console.error('Failed to persist unit preference:', err);
      }
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenLegal = (tab: LegalTab = 'privacy') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  const handleSignUpWithStats = (stats: GuestMetrics) => {
    setGuestMetricsHandover(stats);
    handleOpenAuth('register');
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <Loader2 size={36} style={{ color: 'var(--color-accent)', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading Macro Engine...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar with Theme & Unit Switchers */}
      <Navbar
        unitPreference={unitPreference}
        onUnitToggle={handleUnitToggle}
        onOpenAuth={handleOpenAuth}
        onOpenStatsModal={() => setIsStatsModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Area */}
      <main className="main-content-container">
        {user ? (
          <Dashboard
            unitPreference={unitPreference}
            onUnitToggle={setUnitPreference}
            guestMetricsHandover={guestMetricsHandover}
            isStatsModalOpen={isStatsModalOpen}
            setIsStatsModalOpen={setIsStatsModalOpen}
            onThemeSync={(persistedTheme) => setTheme(persistedTheme)}
            onOpenLegal={handleOpenLegal}
          />
        ) : (
          <LiveTDEECalculator
            unitPreference={unitPreference}
            onUnitToggle={handleUnitToggle}
            onSignUpWithStats={handleSignUpWithStats}
            initialMetrics={guestMetricsHandover ?? undefined}
            onOpenLegal={handleOpenLegal}
          />
        )}
      </main>

      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onOpenLegal={handleOpenLegal}
      />

      {/* Privacy Policy & Terms of Service Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainView />
    </AuthProvider>
  );
};

export default App;
