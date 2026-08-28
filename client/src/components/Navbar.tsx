import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UnitNotch } from './UnitNotch';
import type { UnitPreference } from '../types/user';
import { LogIn, LogOut, Settings2, UserPlus, User, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  unitPreference: UnitPreference;
  onUnitToggle: (unit: UnitPreference) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenStatsModal?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  unitPreference,
  onUnitToggle,
  onOpenAuth,
  onOpenStatsModal,
  theme,
  onToggleTheme,
}) => {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-light)',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '1180px',
          margin: '0 auto',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--border-light)',
              padding: '4px 5px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <img
              src="/mascot.png"
              alt="Mascot Logo"
              className="mascot-img"
              style={{ width: '22px', height: '22px' }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>Macros</span>
              <span className="navbar-badge-desktop badge" style={{ fontSize: '9px', padding: '1px 5px' }}>TDEE Calc</span>
            </div>
            <p className="navbar-brand-subtitle" style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Metabolic Engine</p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="btn-ghost"
            style={{
              padding: '5px 7px',
              minHeight: '30px',
              borderRadius: 'var(--radius-full)',
              color: theme === 'dark' ? '#fbbf24' : 'var(--text-main)',
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* Global Unit Notch */}
          <UnitNotch unitPreference={unitPreference} onToggle={onUnitToggle} />

          {user ? (
            /* Logged-In User Actions */
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                }}
                className="user-pill-desktop"
              >
                <User size={12} style={{ color: 'var(--accent-emerald)' }} />
                <span>@{user.username}</span>
              </div>

              {onOpenStatsModal && (
                <button
                  onClick={onOpenStatsModal}
                  className="btn-ghost"
                  style={{ padding: '4px 8px', minHeight: '30px', fontSize: '11px' }}
                  title="Body Settings"
                >
                  <Settings2 size={13} />
                  <span className="btn-label-desktop">Stats</span>
                </button>
              )}

              <button
                onClick={logout}
                className="btn-ghost"
                style={{ padding: '4px 8px', minHeight: '30px', fontSize: '11px' }}
                title="Sign Out"
              >
                <LogOut size={13} />
                <span className="btn-label-desktop">Log Out</span>
              </button>
            </div>
          ) : (
            /* Guest / Public CTAs */
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-ghost"
                style={{ padding: '4px 8px', minHeight: '30px', fontSize: '11px' }}
              >
                <LogIn size={13} />
                <span>Log In</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="btn-primary"
                style={{ padding: '4px 9px', minHeight: '30px', fontSize: '11px' }}
              >
                <UserPlus size={13} />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
