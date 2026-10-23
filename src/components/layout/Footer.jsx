import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Lock,
  Layers,
  Heart,
  Scale,
  Sparkles,
} from 'lucide-react';

export function Footer() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  return (
    <>
      {/* ===================== DESKTOP WEBSITE FOOTER ===================== */}
      <footer
        className="hidden-mobile"
        style={{
          backgroundColor: isLight ? '#ffffff' : '#000000',
          borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
          padding: '64px 32px 36px 32px',
          marginTop: 'auto',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Top Section: Brand + Status Capsule */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '28px',
              paddingBottom: '40px',
              borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Brand Logo & Mission */}
            <div style={{ maxWidth: '420px' }}>
              <div
                onClick={() => navigate('/dashboard')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  marginBottom: '14px',
                }}
              >
                {/* Infinity Loop Logo Icon */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isLight ? '#0f172a' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isLight ? '#ffffff' : '#000000',
                    fontWeight: 900,
                    boxShadow: isLight
                      ? '0 2px 6px rgba(15, 23, 42, 0.2)'
                      : '0 0 14px rgba(245, 158, 11, 0.5)',
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 12c-2-2.5-4-4-6.5-4A4.5 4.5 0 0 0 1 12.5 4.5 4.5 0 0 0 5.5 17c2.5 0 4.5-1.5 6.5-5 2-3.5 4-5 6.5-5a4.5 4.5 0 0 1 4.5 4.5 4.5 4.5 0 0 1-4.5 4.5c-2.5 0-4-1.5-6.5-4Z" />
                  </svg>
                </div>

                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    color: isLight ? '#0f172a' : '#ffffff',
                  }}
                >
                  tendem
                </span>
              </div>

              <p
                style={{
                  fontSize: '13.5px',
                  color: isLight ? '#64748b' : '#9ca3af',
                  lineHeight: 1.6,
                  margin: '0 0 16px 0',
                  fontWeight: 700,
                }}
              >
                Smart zero-sum expense sharing platform with greedy graph debt simplification.
              </p>

              {/* Security Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? '#f8fafc' : '#141417',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  color: isLight ? '#475569' : '#a1a1aa',
                }}
              >
              </div>
            </div>

            {/* Live Infrastructure Status Capsule */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 18px',
                borderRadius: '18px',
                backgroundColor: isLight ? '#f8fafc' : '#0a0a0c',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 10px #10b981',
                }}
              />
              {/* <div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                  Operational Sync Active
                </div>
                <div style={{ fontSize: '11px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 700, marginTop: '1px' }}>
                  MongoDB Real-Time Socket Gateway
                </div>
              </div> */}
            </div>
          </div>

          {/* Links Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '36px',
              padding: '40px 0',
            }}
          >
            {/* Column 1: Platform */}
            <div>
              <h4
                style={{
                  fontSize: '11.5px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isLight ? '#0f172a' : '#ffffff',
                  marginBottom: '16px',
                }}
              >
                Platform
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  { label: 'Syndicate Vault', path: '/dashboard' },
                  { label: 'Shared Envelopes', path: '/groups' },
                  { label: 'Audit Trail', path: '/activity' },
                  { label: 'Direct Settlements', path: '/settlements' },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        color: isLight ? '#64748b' : '#9ca3af',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = isLight ? '#0f172a' : '#f59e0b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isLight ? '#64748b' : '#9ca3af';
                      }}
                    >
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Solutions */}
            <div>
              <h4
                style={{
                  fontSize: '11.5px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isLight ? '#0f172a' : '#ffffff',
                  marginBottom: '16px',
                }}
              >
                Use Cases
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  'Group Travel & Trips',
                  'Apartment Roommates',
                  'Dining & Bill Splitting',
                  'Syndicate Investments',
                  'Event Organizing',
                ].map((text) => (
                  <li key={text}>
                    <span style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 700 }}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Features */}
            <div>
              <h4
                style={{
                  fontSize: '11.5px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isLight ? '#0f172a' : '#ffffff',
                  marginBottom: '16px',
                }}
              >
                Technology
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  'Graph Debt Simplification',
                  'Liquid Split Studio',
                  'Instant UPI QR Codes',
                  'Multi-Vault Sync',
                  'Real-Time WebSocket Hub',
                ].map((text) => (
                  <li key={text}>
                    <span style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 700 }}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Trust & Compliance */}
            <div>
              <h4
                style={{
                  fontSize: '11.5px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: isLight ? '#0f172a' : '#ffffff',
                  marginBottom: '16px',
                }}
              >
                Integrity
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {[
                  'Zero Hidden Charges',
                  'Deterministic Accounting',
                  'Privacy First Policy',
                  'Direct Peer-to-Peer',
                  'Open Source Architecture',
                ].map((text) => (
                  <li key={text}>
                    <span style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 700 }}>
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Badges */}
          <div
            style={{
              paddingTop: '28px',
              borderTop: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <p
              style={{
                fontSize: '12.5px',
                color: isLight ? '#64748b' : '#71717a',
                margin: 0,
                fontWeight: 700,
              }}
            >
              © {new Date().getFullYear()} Split Money. High-precision financial engineering.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: isLight ? '#b45309' : '#fbbf24',
                  textTransform: 'uppercase',
                }}
              >
                UPI 2.0 Ready
              </span>
              <span style={{ color: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)' }}>•</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  color: '#10b981',
                  textTransform: 'uppercase',
                }}
              >
                Zero-Fee Direct Settlements
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================== MOBILE WATERMARK ONLY ===================== */}
      {/* Shown exclusively on mobile viewports (< 768px via hidden-desktop) */}
      <div
        className="hidden-desktop"
        style={{
          textAlign: 'center',
          padding: '28px 16px 88px 16px',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '11.5px',
            fontWeight: 900,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: isLight ? '#0f172a' : '#f59e0b',
              color: isLight ? '#ffffff' : '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '10px',
            }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12c-2-2.5-4-4-6.5-4A4.5 4.5 0 0 0 1 12.5 4.5 4.5 0 0 0 5.5 17c2.5 0 4.5-1.5 6.5-5 2-3.5 4-5 6.5-5a4.5 4.5 0 0 1 4.5 4.5 4.5 4.5 0 0 1-4.5 4.5c-2.5 0-4-1.5-6.5-4Z" />
            </svg>
          </div>
          <span>tendem • App v0.1</span>
        </div>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '9.5px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: isLight ? '#94a3b8' : 'rgba(255, 255, 255, 0.25)',
            textTransform: 'uppercase',
          }}
        >
          Secured Zero-Sum Direct Clearing
        </p>
      </div>
    </>
  );
}
