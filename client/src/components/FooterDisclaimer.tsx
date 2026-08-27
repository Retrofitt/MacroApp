import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const FooterDisclaimer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '60px',
        paddingTop: '24px',
        paddingBottom: '32px',
        borderTop: '1px solid var(--border-light)',
      }}
    >
      <div
        style={{
          maxWidth: '1140px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          lineHeight: '1.6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <ShieldCheck size={16} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
          <p>
            <strong>Medical & Fitness Disclaimer:</strong> The nutritional, metabolic (BMR/TDEE), and macro calculations provided by MacroApp are for athletic, educational, and informational purposes only. They are not intended as medical, health, or dietary advice, diagnosis, or treatment. Always consult with a licensed physician or registered dietitian before beginning any new caloric deficit, bulking protocol, or rigorous exercise regimen.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '12px',
            marginTop: '4px',
          }}
        >
          <span>© {new Date().getFullYear()} MacroApp. Precision Metabolic & Calorie Engine.</span>
          <span>Phase 1 Production Release</span>
        </div>
      </div>
    </footer>
  );
};
