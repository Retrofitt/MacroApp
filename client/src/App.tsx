import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LiveTDEECalculator, type GuestMetrics } from './components/LiveTDEECalculator';
import { Dashboard } from './components/Dashboard';
import { AuthModal } from './components/AuthModal';
import type { UnitPreference } from './types/user';
import { Loader2 } from 'lucide-react';

const MainView: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [unitPreference, setUnitPreference] = useState<UnitPreference>('imperial');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [guestMetricsHandover, setGuestMetricsHandover] = useState<GuestMetrics | null>(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);

  // Theme Management (Light vs Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('macroapp_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('macroapp_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
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
        onUnitToggle={setUnitPreference}
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
          />
        ) : (
          <LiveTDEECalculator
            unitPreference={unitPreference}
            onUnitToggle={setUnitPreference}
            onSignUpWithStats={handleSignUpWithStats}
            initialMetrics={guestMetricsHandover ?? undefined}
          />
        )}
      </main>

      {/* Auth Modal (Sign In / Sign Up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
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
