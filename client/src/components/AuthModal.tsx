import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Lock, Mail, User as UserIcon, ArrowRight, Loader2, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
  onOpenLegal?: (tab: 'privacy' | 'terms') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
  onOpenLegal,
}) => {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(initialMode === 'register');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Sync mode if initialMode prop changes when opening
  React.useEffect(() => {
    setIsRegisterMode(initialMode === 'register');
    setErrorMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (isRegisterMode) {
        const result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        if (!result.success && result.error) {
          setErrorMessage(result.error);
        } else {
          sessionStorage.setItem('just_signed_up', 'true');
          onSuccess?.();
          onClose();
        }
      } else {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });
        if (!result.success && result.error) {
          setErrorMessage(result.error);
        } else {
          onSuccess?.();
          onClose();
        }
      }
    } finally {
      setIsSubmitting(false);
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
          maxWidth: '460px',
          position: 'relative',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
          }}
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              background: 'var(--accent-gradient)',
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--accent-glow)',
            }}
          >
            <Dumbbell size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              {isRegisterMode ? 'Save your calibrated targets & history' : 'Sign in to access your dashboard'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="alert-error" style={{ marginBottom: '18px' }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegisterMode && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="e.g. iron_lifter"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                name="password"
                required
                placeholder={isRegisterMode ? 'Min 8 chars, 1 uppercase, 1 number' : '••••••••'}
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                style={{ paddingLeft: '42px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', marginTop: '6px' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isRegisterMode ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {isRegisterMode && (
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', margin: '4px 0 0', lineHeight: '1.4' }}>
              By creating an account, you agree to our{' '}
              <button
                type="button"
                onClick={() => onOpenLegal?.('terms')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-emerald)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '11px',
                }}
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => onOpenLegal?.('privacy')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-emerald)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '11px',
                }}
              >
                Privacy Policy
              </button>.
            </p>
          )}
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {isRegisterMode ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMessage(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-emerald)',
              fontWeight: '700',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            {isRegisterMode ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
