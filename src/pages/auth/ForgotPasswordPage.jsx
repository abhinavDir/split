import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Mail, Sparkles } from 'lucide-react';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="auth-page-container">
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#070c09',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '26px',
          padding: '28px 24px',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85)',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Bar: Back to Landing Page Arrow + Brand Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '6px 14px 6px 8px',
              color: '#ffffff',
              fontSize: '11.5px',
              fontWeight: 900,
              letterSpacing: '0.02em',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
            title="Back to Landing Page"
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: '#2bb673',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={13} strokeWidth={3} />
            </div>
            <span>Home</span>
          </button>

          <div
            onClick={() => navigate('/')}
            style={{
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            tandem
          </div>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h2 style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, marginBottom: '24px' }}>
              If an account exists for <strong style={{ color: '#ffffff' }}>{email}</strong>, we've sent password recovery instructions.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                width: '100%',
                backgroundColor: '#2bb673',
                color: '#ffffff',
                textDecoration: 'none',
                textAlign: 'center',
                padding: '13px 20px',
                borderRadius: '9999px',
                fontWeight: 900,
                fontSize: '13.5px',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 16px rgba(43, 182, 115, 0.35)',
                boxSizing: 'border-box',
              }}
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <div>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              Reset your password
            </h2>
            <p
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.65)',
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              Enter the email associated with your account and we’ll send a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '6px',
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: '#2bb673',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '13px 20px',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(43, 182, 115, 0.4)',
                  transition: 'background-color 0.15s ease',
                  marginTop: '4px',
                  boxSizing: 'border-box',
                }}
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'underline',
                    fontWeight: 500,
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
