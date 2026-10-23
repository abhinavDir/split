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
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#030d07',
        background: 'radial-gradient(ellipse 100% 70% at 50% 20%, #0d2e1f 0%, #061910 50%, #020905 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#040b07',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '32px',
          padding: '40px 36px',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Brand */}
        <div
          onClick={() => navigate('/')}
          style={{
            fontSize: '24px',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: '#ffffff',
            cursor: 'pointer',
            marginBottom: '32px',
            userSelect: 'none',
            textAlign: 'center',
          }}
        >
          tandem
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.55, marginBottom: '28px' }}>
              If an account exists for <strong style={{ color: '#ffffff' }}>{email}</strong>, we've sent password recovery instructions.
            </p>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                width: '100%',
                backgroundColor: '#25a168',
                color: '#ffffff',
                textDecoration: 'none',
                textAlign: 'center',
                padding: '13px',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: '0 4px 16px rgba(37, 161, 104, 0.35)',
              }}
            >
              Return to Sign In
            </Link>
          </div>
        ) : (
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              Reset your password
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.65)',
                marginBottom: '26px',
                lineHeight: 1.5,
              }}
            >
              Enter the email associated with your account and we’ll send a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '8px',
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
                    padding: '14px 22px',
                    fontSize: '14.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: '#25a168',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(37, 161, 104, 0.4)',
                  transition: 'background-color 0.15s ease',
                  marginTop: '8px',
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
