import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  Ghost,
  Bot,
  Gamepad2,
} from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const TESTIMONIALS = [
    {
      quote:
        'Splitting restaurant tabs and weekend trip getaways is now easier than ever. Just scan the receipt, assign drinks, and settle up instantly.',
      author: 'Mas Parjono',
      role: 'Lead Explorer at TripPot',
    },
    {
      quote:
        'We saved over $1,200 on our Europe trip without a single awkward money conversation. Tandem keeps everyone accountable and happy.',
      author: 'Elena Rostova',
      role: 'Lisbon Co-living Host',
    },
    {
      quote:
        'Zero friction UPI and card settlements. As roommates, we split groceries, Wi-Fi, and utilities in two taps every month.',
      author: 'Karan Sharma',
      role: 'Flatmate Organizer',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid email or password');
    }
  };

  const currentTestimonial = TESTIMONIALS[activeTestimonial];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0a1d14',
        background: 'radial-gradient(ellipse 120% 85% at 50% 25%, #133a28 0%, #0c271b 45%, #05140e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 16px',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Main Outer Rounded Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '1060px',
          backgroundColor: '#070c09',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '40px',
          padding: '42px',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '42px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* LEFT COLUMN: BRAND + FORM */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '8px 12px 8px 8px',
            position: 'relative',
            background: 'radial-gradient(circle at 95% 55%, rgba(34, 197, 94, 0.12) 0%, transparent 60%)',
          }}
        >
          <div>
            {/* Top Logo Brand */}
            <div
              onClick={() => navigate('/')}
              style={{
                fontSize: '26px',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#ffffff',
                cursor: 'pointer',
                marginBottom: '44px',
                userSelect: 'none',
                display: 'inline-block',
              }}
            >
              tandem
            </div>

            {/* Form Heading */}
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '26px',
                letterSpacing: '-0.01em',
              }}
            >
              Please Enter your Account details
            </h2>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  borderRadius: '14px',
                  padding: '11px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '20px',
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Email Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#f8fafc',
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
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
                  }}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#f8fafc',
                    marginBottom: '8px',
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '14px 48px 14px 22px',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontSize: '12.5px',
                      color: '#94a3b8',
                      textDecoration: 'underline',
                      fontWeight: 500,
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    Forgot Password
                  </Link>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: '#2bb673',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '15px',
                  fontSize: '15.5px',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 20px rgba(43, 182, 115, 0.4)',
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  marginTop: '6px',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#25a064';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#2bb673';
                }}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Quirky "Aajeeb" Quick Action Icons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '28px',
                marginBottom: '20px',
              }}
            >
              {/* Ghost Mode */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.style.transform = 'scale(0.85) rotate(-10deg)';
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }, 180);
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(0, 0, 0, 0.28)',
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
                }}
                title="Ghost Mode"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) rotate(-6deg)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotate(0)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.28)';
                }}
              >
                <Ghost size={21} color="#7c3aed" strokeWidth={2.4} />
              </button>

              {/* Bot / Cyborg Mode */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.style.transform = 'scale(0.85) rotate(10deg)';
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }, 180);
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(0, 0, 0, 0.28)',
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
                }}
                title="Cyborg Bot"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 150, 105, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.28)';
                }}
              >
                <Bot size={21} color="#059669" strokeWidth={2.4} />
              </button>

              {/* Gamepad / Gamer Mode */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.style.transform = 'scale(0.85) rotate(-8deg)';
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }, 180);
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(0, 0, 0, 0.28)',
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
                }}
                title="Gamer Mode"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) rotate(6deg)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(225, 29, 72, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotate(0)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.28)';
                }}
              >
                <Gamepad2 size={21} color="#e11d48" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* Bottom Link: Create an Account */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link
              to="/register"
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#ffffff',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: VIBRANT EMERALD SHOWCASE CARD */}
        <div
          style={{
            backgroundColor: '#2bb673',
            background: 'linear-gradient(155deg, #32c480 0%, #22a866 100%)',
            borderRadius: '32px',
            padding: '40px 36px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(43, 182, 115, 0.28)',
          }}
        >
          {/* Top-Right Decorative Dark Corner Notch */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '48px',
              height: '48px',
              backgroundColor: '#070c09',
              borderBottomLeftRadius: '32px',
            }}
          />

          {/* Geometric Sunburst Rays Background */}
          <svg
            style={{
              position: 'absolute',
              right: '-40px',
              top: '25%',
              width: '380px',
              height: '380px',
              opacity: 0.22,
              pointerEvents: 'none',
            }}
            viewBox="0 0 200 200"
          >
            <circle cx="150" cy="100" r="8" fill="#ffffff" />
            {[...Array(14)].map((_, i) => {
              const angle = (i * 180) / 13;
              const rad = (angle * Math.PI) / 180;
              const x2 = 150 - Math.cos(rad) * 160;
              const y2 = 100 - Math.sin(rad) * 160;
              return (
                <line
                  key={i}
                  x1="150"
                  y1="100"
                  x2={x2}
                  y2={y2}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
              );
            })}
          </svg>

          {/* Top Testimonial Section */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Header */}
            <h1
              style={{
                fontSize: 'clamp(28px, 3.4vw, 36px)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                margin: 0,
              }}
            >
              What’s our
              <br />
              Splitters Said.
            </h1>

            {/* Quotation Icon */}
            <div
              style={{
                fontSize: '38px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                marginTop: '16px',
                marginBottom: '8px',
                fontFamily: 'serif',
              }}
            >
              “
            </div>

            {/* Quote Body */}
            <p
              style={{
                fontSize: '14.5px',
                lineHeight: 1.6,
                color: '#ffffff',
                margin: 0,
                maxWidth: '380px',
                minHeight: '70px',
                fontWeight: 500,
              }}
            >
              "{currentTestimonial.quote}"
            </p>

            {/* Author */}
            <div style={{ marginTop: '18px' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                {currentTestimonial.author}
              </p>
              <p style={{ fontSize: '13px', color: '#d1fae5', margin: '3px 0 0 0', fontWeight: 500 }}>
                {currentTestimonial.role}
              </p>
            </div>

            {/* Left & Right Slider Controls */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '22px' }}>
              {/* Left Arrow: Light Mint with Dark Arrow */}
              <button
                type="button"
                onClick={() =>
                  setActiveTestimonial((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1))
                }
                style={{
                  width: '42px',
                  height: '38px',
                  borderRadius: '16px',
                  backgroundColor: '#75d8a2',
                  border: 'none',
                  color: '#0b3820',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#89e2b1';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#75d8a2';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ArrowLeft size={18} strokeWidth={2.5} />
              </button>

              {/* Right Arrow: Deep Dark Charcoal with White Arrow */}
              <button
                type="button"
                onClick={() =>
                  setActiveTestimonial((prev) => (prev < TESTIMONIALS.length - 1 ? prev + 1 : 0))
                }
                style={{
                  width: '42px',
                  height: '38px',
                  borderRadius: '16px',
                  backgroundColor: '#091b12',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#102e20';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#091b12';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Bottom White Floating Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '26px',
              padding: '24px 26px 22px 26px',
              position: 'relative',
              marginTop: '34px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
              zIndex: 10,
            }}
          >
            {/* Top-Right Star Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-14px',
                right: '-6px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid #091b12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
              }}
            >
              <Sparkles size={18} color="#091b12" strokeWidth={2.4} />
            </div>

            {/* White Card Title */}
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#090e0c',
                lineHeight: 1.3,
                margin: '0 0 8px 0',
                letterSpacing: '-0.01em',
              }}
            >
              Get your expenses split and settled right now
            </h3>

            {/* White Card Description */}
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.5,
                color: '#475569',
                margin: '0 0 16px 0',
                fontWeight: 450,
              }}
            >
              Be among the first groups to experience the easiest way to organize dinner, travel, and shared flats.
            </p>

            {/* Avatars Row */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                  alt="user 1"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    objectFit: 'cover',
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="user 2"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    marginLeft: '-8px',
                    objectFit: 'cover',
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                  alt="user 3"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    marginLeft: '-8px',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#091b12',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '-8px',
                    border: '2px solid #ffffff',
                  }}
                >
                  +2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
