import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight,
  Plus,
  Check,
  Star,
  Menu,
  X,
  Compass,
  ArrowRight,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CARDS = [
    {
      id: 'lisbon',
      tag: 'TRIP POT',
      title: 'Lisbon, June',
      amount: '$1,840',
      target: 'OF $2,400',
      friends: '5 FRIENDS',
      image: '/landing/lisbon.jpg',
      paidBy: 'Maya paid you $24',
      paidDesc: 'Tacos on Friday • just now',
      requestAmount: '+$24',
    },
    {
      id: 'sunset',
      tag: 'ROAD TRIP',
      title: 'Pacific Coast, July',
      amount: '$2,450',
      target: 'OF $3,000',
      friends: '6 FRIENDS',
      image: '/landing/sunset.jpg',
      paidBy: 'Alex paid you $65',
      paidDesc: 'Van fuel & snacks • 2h ago',
      requestAmount: '+$65',
    },
    {
      id: 'dining',
      tag: 'FLATMATES',
      title: 'Flat 4B Groceries',
      amount: '$920',
      target: 'OF $1,200',
      friends: '3 FRIENDS',
      image: '/landing/dining.jpg',
      paidBy: 'Sam paid you $32',
      paidDesc: 'Sunday brunch pizza • 4h ago',
      requestAmount: '+$32',
    },
  ];

  const currentCard = CARDS[activeSlide];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0a2318',
        background: 'radial-gradient(ellipse 110% 80% at 50% 12%, #1b533a 0%, #103b28 42%, #082216 75%, #04130c 100%)',
        color: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Ambient Radial Glow & Soft Fog at Horizon */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(46, 125, 88, 0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '240px',
          background: 'linear-gradient(to top, rgba(230, 240, 235, 0.12) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* TOP NAVBAR CONTAINER */}
      <header
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 20px 0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 50,
        }}
      >
        {/* Left Floating Capsule: Logo + Nav Items + Menu Hamburger */}
        <div
          style={{
            backgroundColor: 'rgba(9, 28, 19, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '9999px',
            padding: '7px 18px 7px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Logo Brand */}
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                color: '#ffffff',
              }}
            >
              tandem
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
            className="hidden-mobile"
          >
            {['Split'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'Split' || item === 'Pots') {
                    navigate(user ? '/dashboard' : '/login');
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 2px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)')}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Hamburger Menu Icon in Pill */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: '2px',
            }}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Right Action Buttons: Log in + Start for free */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: '#fdf06f',
                color: '#111827',
                border: 'none',
                borderRadius: '9999px',
                padding: '9px 20px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(253, 240, 111, 0.3)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(253, 240, 111, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(253, 240, 111, 0.3)';
              }}
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 12px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)')}
              >
                Log in
              </button>

              <button
                onClick={() => navigate('/register')}
                style={{
                  background: '#fdf06f',
                  color: '#111827',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '9px 22px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(253, 240, 111, 0.3)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  letterSpacing: '-0.01em',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(253, 240, 111, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(253, 240, 111, 0.3)';
                }}
              >
                Start for free
              </button>
            </>
          )}
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '20px',
            right: '20px',
            backgroundColor: 'rgba(8, 26, 17, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '20px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          }}
        >
          {['Pots', 'Split', 'Cards', 'Pricing', 'Stories'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate(user ? '/dashboard' : '/login');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600,
                textAlign: 'left',
                padding: '8px 0',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '9999px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#fdf06f',
              border: 'none',
              color: '#111827',
              padding: '12px',
              borderRadius: '9999px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Start for free
          </button>
        </div>
      )}

      {/* MAIN HERO CONTENT */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '28px 20px 24px 20px',
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 800,
            lineHeight: 1.07,
            letterSpacing: '-0.035em',
            color: '#ffffff',
            maxWidth: '760px',
            margin: '0 auto',
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          Split the bill,
          <br />
          keep the friends.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(14px, 1.4vw, 15.5px)',
            color: 'rgba(255, 255, 255, 0.78)',
            maxWidth: '520px',
            margin: '14px auto 22px auto',
            lineHeight: 1.5,
            fontWeight: 450,
          }}
        >
          The shared wallet for people who do life together. Start a pot, split anything in two taps, settle up before the next round.
        </p>

        {/* CTA Button Row: "Start a pot ↗" + Social Proof Capsule */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '26px',
          }}
        >
          {/* "Start a pot ↗" Pill Button */}
          <button
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            style={{
              background: '#ffffff',
              color: '#0d2217',
              border: 'none',
              borderRadius: '9999px',
              padding: '6px 7px 6px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(0, 0, 0, 0.35)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.35)';
            }}
          >
            <span>Start a pot</span>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#fdf06f',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUpRight size={18} strokeWidth={2.8} />
            </div>
          </button>

          {/* Social Proof Pill */}
          <div
            style={{
              backgroundColor: 'rgba(6, 21, 14, 0.65)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              padding: '6px 18px 6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Overlapping Avatars */}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                alt="Friend 1"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1.5px solid #082216',
                  objectFit: 'cover',
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                alt="Friend 2"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1.5px solid #082216',
                  marginLeft: '-7px',
                  objectFit: 'cover',
                }}
              />
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80"
                alt="Friend 3"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '1.5px solid #082216',
                  marginLeft: '-7px',
                  objectFit: 'cover',
                }}
              />
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
              <Star size={13} fill="#fdf06f" stroke="#fdf06f" />
              <span>4.9</span>
            </div>

            <span style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '12px' }}>|</span>

            {/* Friend Groups Count */}
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.82)' }}>
              2M friend groups
            </span>
          </div>
        </div>

        {/* 3D CAROUSEL / FLOATING CARDS STAGE */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '920px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '380px',
            perspective: '1200px',
          }}
        >
          {/* Left Flanking Card (Sunset Road Trip) */}
          <div
            onClick={() => setActiveSlide(1)}
            style={{
              position: 'absolute',
              left: 'clamp(0px, 10vw, 110px)',
              width: 'clamp(180px, 21vw, 240px)',
              height: 'clamp(260px, 29vw, 330px)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
              transform: 'scale(0.86) rotateY(10deg) translateZ(-60px)',
              opacity: 0.72,
              filter: 'blur(1px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.filter = 'blur(0px)';
              e.currentTarget.style.transform = 'scale(0.9) rotateY(6deg) translateZ(-20px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.72';
              e.currentTarget.style.filter = 'blur(1px)';
              e.currentTarget.style.transform = 'scale(0.86) rotateY(10deg) translateZ(-60px)';
            }}
          >
            <img
              src="/landing/sunset.jpg"
              alt="Road Trip"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
              }}
            />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Pacific Coast, July</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>$2,450 • 6 FRIENDS</p>
            </div>
          </div>

          {/* Right Flanking Card (Friends Dining) */}
          <div
            onClick={() => setActiveSlide(2)}
            style={{
              position: 'absolute',
              right: 'clamp(0px, 10vw, 110px)',
              width: 'clamp(180px, 21vw, 240px)',
              height: 'clamp(260px, 29vw, 330px)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
              transform: 'scale(0.86) rotateY(-10deg) translateZ(-60px)',
              opacity: 0.72,
              filter: 'blur(1px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
              zIndex: 5,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.filter = 'blur(0px)';
              e.currentTarget.style.transform = 'scale(0.9) rotateY(-6deg) translateZ(-20px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.72';
              e.currentTarget.style.filter = 'blur(1px)';
              e.currentTarget.style.transform = 'scale(0.86) rotateY(-10deg) translateZ(-60px)';
            }}
          >
            <img
              src="/landing/dining.jpg"
              alt="Dining"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
              }}
            />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>Flat 4B Groceries</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>$920 • 3 FRIENDS</p>
            </div>
          </div>

          {/* Central Hero Card (Lisbon, June - Active Focus) */}
          <div
            style={{
              position: 'relative',
              width: 'clamp(230px, 27vw, 290px)',
              height: 'clamp(320px, 37vw, 390px)',
              borderRadius: '26px',
              overflow: 'visible',
              zIndex: 20,
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Inner Clipping Container for Photo */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '28px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.14)',
              }}
            >
              <img
                src={currentCard.image}
                alt={currentCard.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* Gradient Vignette over photo */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10, 16, 12, 0.95) 0%, rgba(10, 16, 12, 0.4) 40%, transparent 70%)',
                }}
              />

              {/* Tag Capsule: "• TRIP POT" */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(12, 28, 19, 0.65)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#fdf06f',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: 'rgba(255, 255, 255, 0.95)',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentCard.tag}
                </span>
              </div>

              {/* Bottom Card Overlay: Title + Progress Breakdown */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(15, 24, 18, 0.78)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '18px',
                  padding: '14px 16px',
                  textAlign: 'left',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {currentCard.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  <span style={{ color: '#fdf06f' }}>{currentCard.amount}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{currentCard.target}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>•</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{currentCard.friends}</span>
                </div>
              </div>
            </div>

            {/* Floating Top-Right Notification: "Maya paid you $24" */}
            <div
              style={{
                position: 'absolute',
                top: '55px',
                right: '-46px',
                backgroundColor: 'rgba(18, 30, 23, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '9999px',
                padding: '6px 14px 6px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
                zIndex: 30,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
                alt="Maya"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', margin: 0, whiteSpace: 'nowrap' }}>
                  {currentCard.paidBy}
                </p>
                <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.65)', margin: 0, whiteSpace: 'nowrap' }}>
                  {currentCard.paidDesc}
                </p>
              </div>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#fdf06f',
                  color: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '2px',
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
            </div>

            {/* Floating Bottom-Left Pill: "+ Request $24" */}
            <div
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '-34px',
                backgroundColor: '#ffffff',
                color: '#111827',
                borderRadius: '9999px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                zIndex: 30,
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Plus size={15} strokeWidth={2.8} />
              <span>Request $24</span>
            </div>
          </div>
        </div>

        {/* Carousel Pagination Indicators */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            backgroundColor: 'rgba(10, 26, 17, 0.75)',
            backdropFilter: 'blur(10px)',
            padding: '5px 12px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {CARDS.map((c, idx) => {
            const isActive = idx === activeSlide;
            return (
              <button
                key={c.id}
                onClick={() => setActiveSlide(idx)}
                style={{
                  width: isActive ? '22px' : '6px',
                  height: '5px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.35)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </main>

      {/* FOOTER ACCENT BAR */}
      <footer
        style={{
          width: '100%',
          padding: '16px 20px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(4, 16, 10, 0.85)',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '14px' }}>tandem</span>
            <span>• Smart group shared wallet & settlements</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span
              onClick={() => navigate('/login')}
              style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.8)' }}
            >
              Sign In
            </span>
            <span
              onClick={() => navigate('/register')}
              style={{ cursor: 'pointer', color: '#fdf06f', fontWeight: 600 }}
            >
              Get Started Free →
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
