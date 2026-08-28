import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, FileText, Lock, Scale, HeartPulse, Check } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

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
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: '0',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'var(--accent-gradient)',
                padding: '8px',
                borderRadius: '8px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {activeTab === 'privacy' ? <ShieldCheck size={20} /> : <Scale size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service & Disclaimer'}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Last updated: August 2026 • Effective immediately
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-light)',
            background: 'var(--bg-secondary)',
            padding: '0 24px',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: '700',
              color: activeTab === 'privacy' ? 'var(--color-accent)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'privacy' ? '2.5px solid var(--color-accent)' : '2.5px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <Lock size={15} />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: '700',
              color: activeTab === 'terms' ? 'var(--color-accent)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'terms' ? '2.5px solid var(--color-accent)' : '2.5px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <FileText size={15} />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            fontSize: '13px',
            lineHeight: '1.65',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {activeTab === 'privacy' ? (
            <>
              {/* Privacy Highlights Card */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <ShieldCheck size={18} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                  <strong>Our Privacy Commitment:</strong> We do <u>not</u> sell, rent, monetize, or share your personal information or health metrics with third-party advertisers or data brokers. Your data is used exclusively to operate your account and compute your metabolic calculations.
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  1. Information We Collect
                </h3>
                <p style={{ margin: '0 0 8px' }}>
                  When you use Macros, we may collect the following types of information:
                </p>
                <ul style={{ margin: '0 0 8px', paddingLeft: '20px' }}>
                  <li><strong>Account Credentials:</strong> Email address, username, and encrypted password (hashed with bcrypt).</li>
                  <li><strong>Fitness & Body Metrics:</strong> Age, biological sex, height, weight, body fat percentage, circumference measurements (neck, waist, hip), activity level, and calorie/macro goals.</li>
                  <li><strong>Technical & Authentication Data:</strong> Secure HTTP-only session cookies and JSON Web Tokens (JWT) necessary to keep you securely logged in.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  2. How We Use Your Information
                </h3>
                <p style={{ margin: 0 }}>
                  Your data is used strictly to provide the core functionality of the service: calculating personalized Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), macronutrient breakdowns, and weight projection timelines.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  3. Data Security & Encryption
                </h3>
                <p style={{ margin: 0 }}>
                  We implement industry-standard security safeguards. All data is transmitted exclusively over encrypted HTTPS connections. Passwords are irreversibly hashed before storage using bcrypt with high salt rounds. We never store plain-text passwords.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  4. Third-Party Sharing & Cookies
                </h3>
                <p style={{ margin: 0 }}>
                  We do not use third-party tracking pixels or behavioral advertising cookies. Essential cookies are used solely for session authentication and maintaining your unit/theme preferences.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  5. Your Rights & Data Deletion
                </h3>
                <p style={{ margin: 0 }}>
                  You have the right to access, update, or request the permanent deletion of your profile data at any time. To request account deletion, you may contact the administrator via the contact details below.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Medical Warning Alert */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <HeartPulse size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '12px', color: 'var(--text-main)' }}>
                  <strong>Important Health & Medical Disclaimer:</strong> Macros (TDEE Calc) is an educational, fitness, and informational tool. It does <u>not</u> provide medical diagnosis, clinical treatment, or healthcare advice. Always consult a licensed medical professional or registered dietitian before beginning any caloric restriction, deficit, or fitness regimen.
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  1. Acceptance of Terms
                </h3>
                <p style={{ margin: 0 }}>
                  By accessing or using Macros (https://macros.ramendev.io), you agree to be bound by these Terms of Service. If you do not agree to all terms, please discontinue use of the application.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  2. Nature of Metabolic Calculations & Estimates
                </h3>
                <p style={{ margin: 0 }}>
                  Calorie, BMR, TDEE, macro ratios, and weight forecast dates are mathematical estimations calculated using peer-reviewed scientific formulas (Mifflin-St Jeor and Katch-McArdle). Individual metabolic rates vary based on genetics, hormonal factors, and daily expenditure. These figures are guidelines, not guarantees.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  3. User Accounts & Acceptable Use
                </h3>
                <p style={{ margin: 0 }}>
                  You are responsible for maintaining the confidentiality of your account credentials. You agree not to attempt unauthorized access, reverse-engineer, disrupt server infrastructure, or use automated scrapers on the application.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  4. Limitation of Liability & "AS-IS" Warranty
                </h3>
                <p style={{ margin: 0 }}>
                  The application is provided strictly on an <strong>"AS IS"</strong> and <strong>"AS AVAILABLE"</strong> basis without warranties of any kind. Under no circumstances shall the developer or service operator be liable for any indirect, incidental, health-related, or consequential damages resulting from the use or inability to use this service.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px' }}>
                  5. Intellectual Property
                </h3>
                <p style={{ margin: 0 }}>
                  All software design, interface components, algorithms, and source code are the intellectual property of Rafael Mendoza (RamenDev).
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-surface)',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Questions? Contact <a href="mailto:rafaelmendoza94.coding@gmail.com" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>rafaelmendoza94.coding@gmail.com</a>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '12px', padding: '8px 18px' }}
          >
            <Check size={14} />
            <span>I Understand</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
