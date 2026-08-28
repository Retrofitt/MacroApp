import React from 'react';
import { ShieldCheck, Copyright } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        marginTop: '40px',
        paddingTop: '24px',
        paddingBottom: '36px',
        borderTop: '1px solid var(--border-light)',
      }}
    >
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
        }}
      >
        {/* Medical & Nutritional Disclaimer */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <ShieldCheck size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
          <p>
            <strong>Medical & Fitness Disclaimer:</strong> The nutritional, metabolic (BMR/TDEE), and macronutrient calculations provided by Macros (TDEE Calc) are intended strictly for athletic, educational, and informational purposes. They do not constitute medical or clinical advice. Always consult a licensed physician or registered dietitian before starting any significant caloric deficit or fitness protocol.
          </p>
        </div>

        {/* Intellectual Property & Copyright Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '14px',
            marginTop: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Copyright size={13} style={{ color: 'var(--text-muted)' }} />
            <span>{currentYear} <strong>Rafael Mendoza</strong>. All Rights Reserved.</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Designed & Engineered by <a href="https://portfolio.ramendev.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: '600', textDecoration: 'underline' }}>Rafael Mendoza</a></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
            <span className="badge" style={{ fontSize: '10px', padding: '1px 7px' }}>
              Phase 1 Production
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
