import React from 'react';
import { Database, Utensils, QrCode, LineChart, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const FeatureRoadmapCard: React.FC = () => {
  return (
    <div
      className="glass-card responsive-card-padding"
      style={{
        border: '1px solid var(--border-light)',
        background: 'var(--bg-surface)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)' }}>
              Member Dashboard & Roadmap
            </h3>
            <span className="badge">
              <Sparkles size={13} /> Active & Upcoming
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>
            What’s live today and what’s currently in development for your account
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {/* Live Feature: Profile Memory */}
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--color-accent)',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                }}
              >
                <Database size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                Profile Memory
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <CheckCircle2 size={10} /> Active
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Your body stats, activity level, body fat, and customized calorie targets are securely stored and synced across your devices.
          </p>
        </div>

        {/* Planned Feature: Macro Tracking */}
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: 'var(--macro-protein)',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                }}
              >
                <Utensils size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                Macro & Calorie Tracking
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(100, 116, 139, 0.1)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-light)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Clock size={10} /> Planned
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Log daily meals, monitor real-time protein/carb/fat bars against your targets, and manage recurring meal plans.
          </p>
        </div>

        {/* Planned Feature: Barcode Scanning */}
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--macro-carbs)',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                }}
              >
                <QrCode size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                Barcode Scanner
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(100, 116, 139, 0.1)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-light)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Clock size={10} /> Planned
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Instantly scan food packaging barcodes via mobile camera for verified nutritional and macro lookups.
          </p>
        </div>

        {/* Planned Feature: Weekly Tracker & Weight Log */}
        <div
          style={{
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: 'rgba(236, 72, 153, 0.1)',
                  color: 'var(--macro-fats)',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                }}
              >
                <LineChart size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                Weekly Progress Tracker
              </span>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(100, 116, 139, 0.1)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-light)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <Clock size={10} /> Planned
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Track weigh-ins with moving averages, compare actual weight change against your forecast, and adapt targets dynamically.
          </p>
        </div>
      </div>
    </div>
  );
};
