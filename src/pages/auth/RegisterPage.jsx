import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Ghost,
  Bot,
  Gamepad2,
} from 'lucide-react';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [upiId, setUpiId] = useState('');
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

  // Password validation checks
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    if (upiId.trim() && !/^[\w.-]+@[\w.-]+$/.test(upiId.trim())) {
      setError('Please enter a valid UPI ID (e.g. name@okhdfcbank, user@paytm) or leave blank.');
      return;
    }

    setIsLoading(true);

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };

    if (upiId.trim()) {
      payload.upiId = upiId.trim();
    }

    const res = await register(payload);
    setIsLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed. Please check your details.');
    }
  };

  const currentTestimonial = TESTIMONIALS[activeTestimonial];

  return (
    <div className="auth-page-container">
      {/* Main Outer Rounded Container */}
      <div className="auth-card-box">
        {/* LEFT COLUMN: BRAND + FORM */}
        <div className="auth-form-column">
          <div>
            {/* Top Bar: Back to Landing Page Arrow + Brand Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '22px',
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

            {/* Form Heading - Small but Bold */}
            <h2
              style={{
                fontSize: 'clamp(15px, 2.6vw, 17px)',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '18px',
                letterSpacing: '-0.02em',
                lineHeight: 1.25,
              }}
            >
              Create your Tandem Account
            </h2>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#fca5a5',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Full Name Field */}
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
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  autoComplete="name"
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
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
                  }}
                />
              </div>

              {/* Email Field */}
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
                  placeholder="name@email.com"
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
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
                  }}
                />
              </div>

              {/* UPI ID Field (Optional) */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'rgba(255, 255, 255, 0.85)',
                    marginBottom: '6px',
                  }}
                >
                  <span>UPI ID</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'none', letterSpacing: 0 }}>Optional for quick payouts</span>
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
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
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
                  }}
                />
              </div>

              {/* Password Field */}
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
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="new-password"
                    style={{
                      width: '100%',
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '12px 44px 12px 18px',
                      fontSize: '13px',
                      fontWeight: 800,
                      outline: 'none',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.16)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
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
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Sign Up Button - Small Bold High Contrast */}
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
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 16px rgba(43, 182, 115, 0.4)',
                  transition: 'background-color 0.15s ease, transform 0.15s ease',
                  marginTop: '4px',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#25a064';
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.currentTarget.style.backgroundColor = '#2bb673';
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Quirky "Aajeeb" Quick Action Icons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                marginTop: '18px',
                marginBottom: '8px',
              }}
            >
              {/* Ghost Mode */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.style.transform = 'scale(0.85) rotate(-10deg)';
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }, 180);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
                }}
                title="Ghost Mode"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) rotate(-6deg)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(124, 58, 237, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotate(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.25)';
                }}
              >
                <Ghost size={19} color="#7c3aed" strokeWidth={2.4} />
              </button>

              {/* Bot / Cyborg Mode */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.style.transform = 'scale(0.85) rotate(10deg)';
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }, 180);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
                }}
                title="Cyborg Bot"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(5, 150, 105, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.25)';
                }}
              >
                <Bot size={19} color="#059669" strokeWidth={2.4} />
              </button>

              {/* Gamepad / Gamer Mode */}
              <button
                type="button"
                onClick={(e) => {
                  e.currentTarget.style.transform = 'scale(0.85) rotate(-8deg)';
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }, 180);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s ease',
                }}
                title="Gamer Mode"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) rotate(6deg)';
                  e.currentTarget.style.boxShadow = '0 6px 14px rgba(225, 29, 72, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotate(0)';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.25)';
                }}
              >
                <Gamepad2 size={19} color="#e11d48" strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* Bottom Switch to Login */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800, marginRight: '6px' }}>
              Already have an account?
            </span>
            <Link
              to="/login"
              style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#ffffff',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: VIBRANT EMERALD SHOWCASE CARD */}
        <div className="auth-showcase-column">
          {/* Top-Right Decorative Dark Corner Notch */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '36px',
              height: '36px',
              backgroundColor: '#070c09',
              borderBottomLeftRadius: '24px',
            }}
          />

          {/* Geometric Sunburst Rays Background */}
          <svg
            style={{
              position: 'absolute',
              right: '-20px',
              top: '15%',
              width: '260px',
              height: '260px',
              opacity: 0.16,
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
            {/* Header - Compact & Bold */}
            <h3
              style={{
                fontSize: 'clamp(18px, 3.2vw, 24px)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              What’s our
              <br />
              Splitters Said.
            </h3>

            {/* Quotation Icon */}
            <div
              style={{
                fontSize: '26px',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                marginTop: '10px',
                marginBottom: '4px',
                fontFamily: 'serif',
              }}
            >
              “
            </div>

            {/* Quote Body - Small & Bold */}
            <p
              style={{
                fontSize: '12px',
                lineHeight: 1.5,
                color: '#ffffff',
                margin: 0,
                maxWidth: '100%',
                fontWeight: 700,
              }}
            >
              "{currentTestimonial.quote}"
            </p>

            {/* Author */}
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '12.5px', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                {currentTestimonial.author}
              </p>
              <p style={{ fontSize: '10.5px', color: '#d1fae5', margin: '2px 0 0 0', fontWeight: 800 }}>
                {currentTestimonial.role}
              </p>
            </div>

            {/* Left & Right Slider Controls */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button
                type="button"
                onClick={() =>
                  setActiveTestimonial((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1))
                }
                style={{
                  width: '34px',
                  height: '30px',
                  borderRadius: '12px',
                  backgroundColor: '#75d8a2',
                  border: 'none',
                  color: '#0b3820',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                <ArrowLeft size={15} strokeWidth={2.8} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTestimonial((prev) => (prev < TESTIMONIALS.length - 1 ? prev + 1 : 0))
                }
                style={{
                  width: '34px',
                  height: '30px',
                  borderRadius: '12px',
                  backgroundColor: '#091b12',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
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
                <ArrowRight size={15} strokeWidth={2.8} />
              </button>
            </div>
          </div>

          {/* Bottom White Floating Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '16px 16px 14px 16px',
              position: 'relative',
              marginTop: '20px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.16)',
              zIndex: 10,
              boxSizing: 'border-box',
            }}
          >
            {/* Top-Right Star Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-4px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid #091b12',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
              }}
            >
              <Sparkles size={14} color="#091b12" strokeWidth={2.6} />
            </div>

            {/* White Card Title - Small & Bold */}
            <h4
              style={{
                fontSize: '12.5px',
                fontWeight: 900,
                color: '#090e0c',
                lineHeight: 1.3,
                margin: '0 0 6px 0',
                letterSpacing: '-0.01em',
              }}
            >
              Get your expenses split and settled right now
            </h4>

            {/* White Card Description - Small & Bold */}
            <p
              style={{
                fontSize: '11px',
                lineHeight: 1.45,
                color: '#475569',
                margin: '0 0 10px 0',
                fontWeight: 700,
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
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    objectFit: 'cover',
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                  alt="user 2"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    marginLeft: '-6px',
                    objectFit: 'cover',
                  }}
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                  alt="user 3"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid #ffffff',
                    marginLeft: '-6px',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#091b12',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '-6px',
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
