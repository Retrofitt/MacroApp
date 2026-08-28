import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Check, ArrowRight, Loader2, LogOut, ExternalLink } from 'lucide-react';

interface LegalConsentModalProps {
  isOpen: boolean;
  onAccept: () => Promise<void>;
  onSignOut: () => void;
  onViewDocument: (tab: 'privacy' | 'terms') => void;
}

export const LegalConsentModal: React.FC<LegalConsentModalProps> = ({
  isOpen,
  onAccept,
  onSignOut,
  onViewDocument,
}) => {
  const [privacyChecked, setPrivacyChecked] = useState<boolean>(false);
  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isComplete = privacyChecked && termsChecked;

  const handleAccept = async () => {
    if (!isComplete || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onAccept();
    } catch (err: unknown) {
      console.error('Failed to submit legal acceptances:', err);
      setError(err instanceof Error ? err.message : 'Failed to update acceptance status. Please try again.');
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="modal-backdrop-fixed"
      style={{
        zIndex: 9999, // Ensure it floats above onboarding or any other modals
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      }}
    >
      <div
        className="glass-card animate-modal modal-responsive-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '28px 24px',
          position: 'relative',
          boxShadow: 'var(--shadow-card)',
          border: '1.5px solid var(--border-focus)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              marginBottom: '12px',
            }}
          >
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 6px' }}>
            Terms & Privacy Update
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
            To protect your account and ensure full compliance, please review and accept our updated Privacy Policy and Terms of Service.
          </p>
        </div>

        {error && (
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
            {error}
          </div>
        )}

        {/* Checkbox Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '22px' }}>
          {/* Privacy Policy Checkbox Card */}
          <div
            onClick={() => setPrivacyChecked(!privacyChecked)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: privacyChecked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-primary)',
              border: privacyChecked ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="checkbox"
              id="consent-privacy"
              checked={privacyChecked}
              onChange={(e) => setPrivacyChecked(e.target.checked)}
              style={{
                marginTop: '3px',
                width: '18px',
                height: '18px',
                accentColor: 'var(--color-accent)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label
                  htmlFor="consent-privacy"
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  I accept the Privacy Policy
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDocument('privacy');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-accent)',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  <span>Review</span>
                  <ExternalLink size={11} />
                </button>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: '1.4' }}>
                Guarantees your personal metrics are stored securely and never sold or shared with third-party advertisers.
              </p>
            </div>
          </div>

          {/* Terms of Service & Disclaimer Checkbox Card */}
          <div
            onClick={() => setTermsChecked(!termsChecked)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: termsChecked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-primary)',
              border: termsChecked ? '1.5px solid var(--color-accent)' : '1px solid var(--border-light)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="checkbox"
              id="consent-terms"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              style={{
                marginTop: '3px',
                width: '18px',
                height: '18px',
                accentColor: 'var(--color-accent)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label
                  htmlFor="consent-terms"
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '700',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  I accept the Terms of Service & Health Disclaimer
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDocument('terms');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-accent)',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  <span>Review</span>
                  <ExternalLink size={11} />
                </button>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: '1.4' }}>
                Confirms metabolic estimates are for informational use and not a substitute for professional medical advice.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            disabled={!isComplete || isSubmitting}
            onClick={handleAccept}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '700',
              opacity: !isComplete || isSubmitting ? 0.6 : 1,
              cursor: !isComplete || isSubmitting ? 'not-allowed' : 'pointer',
              justifyContent: 'center',
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Recording Agreement...</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Accept & Continue</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onSignOut}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '12px',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={13} />
            <span>Decline & Sign Out</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
