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
  ChevronLeft,
  ChevronRight,
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
      percent: 76,
      friends: '5 FRIENDS',
      image: '/landing/lisbon.jpg',
      paidBy: 'Maya paid you $24',
      paidDesc: 'Tacos on Friday • just now',
      requestAmount: '+$24',
      description: 'Shared beach house, surf gear & seafood dinners',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
      ],
    },
    {
      id: 'sunset',
      tag: 'ROAD TRIP',
      title: 'Pacific Coast, July',
      amount: '$2,450',
      target: 'OF $3,000',
      percent: 82,
      friends: '6 FRIENDS',
      image: '/landing/sunset.jpg',
      paidBy: 'Alex paid you $65',
      paidDesc: 'Van fuel & snacks • 2h ago',
      requestAmount: '+$65',
      description: 'Campervan rental, campsite fees & highway tolls',
      avatars: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
      ],
    },
    {
      id: 'dining',
      tag: 'FLATMATES',
      title: 'Flat 4B Groceries',
      amount: '$920',
      target: 'OF $1,200',
      percent: 77,
      friends: '3 FRIENDS',
      image: '/landing/dining.jpg',
      paidBy: 'Sam paid you $32',
      paidDesc: 'Sunday brunch pizza • 4h ago',
      requestAmount: '+$32',
      description: 'Weekly organic groceries, Wi-Fi & Sunday brunch',
      avatars: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
      ],
    },
  ];

  const prevSlideIndex = (activeSlide - 1 + CARDS.length) % CARDS.length;
  const nextSlideIndex = (activeSlide + 1) % CARDS.length;

  const currentCard = CARDS[activeSlide];
  const prevCard = CARDS[prevSlideIndex];
  const nextCard = CARDS[nextSlideIndex];

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
        {/* Left Side: App Name (tandem) */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(9, 28, 19, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '9999px',
            padding: '8px 20px',
            cursor: 'pointer',
            userSelect: 'none',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.15s ease, border-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#2bb673',
              boxShadow: '0 0 10px #2bb673',
            }}
          />
          <span
            style={{
              fontSize: '18px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#ffffff',
            }}
          >
            tandem
          </span>
        </div>

        {/* Right Side: Hamburger Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            backgroundColor: isMobileMenuOpen ? '#fdf06f' : 'rgba(9, 28, 19, 0.78)',
            color: isMobileMenuOpen ? '#111827' : '#ffffff',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: isMobileMenuOpen ? '1px solid #fdf06f' : '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '9999px',
            padding: '9px 15px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            if (!isMobileMenuOpen) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobileMenuOpen) {
              e.currentTarget.style.backgroundColor = 'rgba(9, 28, 19, 0.78)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={20} strokeWidth={2.8} /> : <Menu size={20} strokeWidth={2.5} />}
        </button>
      </header>

      {/* DROPDOWN MENU: ONLY LOGIN & SIGNUP */}
      {isMobileMenuOpen && (
        <div className="landing-nav-dropdown">
          {user ? (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              style={{
                background: '#fdf06f',
                color: '#111827',
                border: 'none',
                padding: '13px 20px',
                borderRadius: '9999px',
                fontWeight: 900,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(253, 240, 111, 0.35)',
              }}
            >
              <span>Go to Dashboard</span>
              <ArrowRight size={17} strokeWidth={2.8} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/login');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  padding: '12px 18px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigate('/register');
                }}
                style={{
                  background: '#fdf06f',
                  border: 'none',
                  color: '#111827',
                  padding: '12px 18px',
                  borderRadius: '9999px',
                  fontWeight: 900,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(253, 240, 111, 0.35)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>Sign Up Free</span>
                <ArrowRight size={17} strokeWidth={2.8} />
              </button>
            </>
          )}
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
              friend groups
            </span>
          </div>
        </div>

        {/* 3D CAROUSEL / FLOATING CARDS STAGE */}
        <div className="landing-carousel-stage">
          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={() => setActiveSlide(prevSlideIndex)}
            style={{
              position: 'absolute',
              left: 'clamp(6px, 2vw, 24px)',
              zIndex: 35,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 24, 16, 0.82)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(8, 24, 16, 0.82)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Previous Trip"
            aria-label="Previous Trip"
          >
            <ChevronLeft size={20} strokeWidth={2.8} />
          </button>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={() => setActiveSlide(nextSlideIndex)}
            style={{
              position: 'absolute',
              right: 'clamp(6px, 2vw, 24px)',
              zIndex: 35,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(8, 24, 16, 0.82)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(8, 24, 16, 0.82)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Next Trip"
            aria-label="Next Trip"
          >
            <ChevronRight size={20} strokeWidth={2.8} />
          </button>

          {/* Left Flanking Card (40% Peek / Side Coverage) */}
          <div
            onClick={() => setActiveSlide(prevSlideIndex)}
            className="landing-flanking-card landing-flanking-left"
            title={`Switch to ${prevCard.title}`}
          >
            <img
              src={prevCard.image}
              alt={prevCard.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
              }}
            />
            {/* Tag */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(8px)',
                borderRadius: '9999px',
                padding: '3px 9px',
                fontSize: '9.5px',
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {prevCard.tag}
            </div>
            {/* Bottom Preview */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(12, 24, 18, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '14px',
                padding: '8px 10px',
                textAlign: 'left',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <p style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {prevCard.title}
              </p>
              <p style={{ fontSize: '10.5px', color: '#fdf06f', fontWeight: 700, margin: '2px 0 0 0' }}>
                {prevCard.amount} • {prevCard.friends}
              </p>
            </div>
          </div>

          {/* Right Flanking Card (40% Peek / Side Coverage) */}
          <div
            onClick={() => setActiveSlide(nextSlideIndex)}
            className="landing-flanking-card landing-flanking-right"
            title={`Switch to ${nextCard.title}`}
          >
            <img
              src={nextCard.image}
              alt={nextCard.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
              }}
            />
            {/* Tag */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(8px)',
                borderRadius: '9999px',
                padding: '3px 9px',
                fontSize: '9.5px',
                fontWeight: 800,
                color: 'rgba(255, 255, 255, 0.9)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {nextCard.tag}
            </div>
            {/* Bottom Preview */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                backgroundColor: 'rgba(12, 24, 18, 0.75)',
                backdropFilter: 'blur(12px)',
                borderRadius: '14px',
                padding: '8px 10px',
                textAlign: 'left',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <p style={{ fontSize: '12.5px', fontWeight: 800, color: '#ffffff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {nextCard.title}
              </p>
              <p style={{ fontSize: '10.5px', color: '#fdf06f', fontWeight: 700, margin: '2px 0 0 0' }}>
                {nextCard.amount} • {nextCard.friends}
              </p>
            </div>
          </div>

          {/* Central Hero Card (100% Focused & Top View) */}
          <div
            style={{
              position: 'relative',
              width: 'clamp(230px, 28vw, 300px)',
              height: 'clamp(330px, 39vw, 410px)',
              borderRadius: '28px',
              overflow: 'visible',
              zIndex: 20,
              boxShadow: '0 28px 70px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.14)',
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
                border: '1px solid rgba(255, 255, 255, 0.18)',
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
                  background: 'linear-gradient(to top, rgba(6, 16, 11, 0.96) 0%, rgba(6, 16, 11, 0.45) 45%, transparent 75%)',
                }}
              />

              {/* Tag Capsule: "• TRIP POT" */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(10, 26, 17, 0.72)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '9999px',
                  padding: '5px 12px',
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
                    boxShadow: '0 0 8px #fdf06f',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 900,
                    letterSpacing: '0.07em',
                    color: 'rgba(255, 255, 255, 0.95)',
                    textTransform: 'uppercase',
                  }}
                >
                  {currentCard.tag}
                </span>
              </div>

              {/* Bottom Card Overlay: Title + Subtitle + Progress Bar + Breakdown */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  right: '14px',
                  backgroundColor: 'rgba(10, 22, 15, 0.84)',
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '20px',
                  padding: '14px 16px',
                  textAlign: 'left',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#ffffff',
                      margin: 0,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {currentCard.title}
                  </h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#2bb673',
                      backgroundColor: 'rgba(43, 182, 115, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(43, 182, 115, 0.3)',
                    }}
                  >
                    {currentCard.percent}%
                  </span>
                </div>

                {/* Subtitle / Activity note */}
                <p
                  style={{
                    fontSize: '11.5px',
                    color: 'rgba(255, 255, 255, 0.72)',
                    margin: '3px 0 8px 0',
                    lineHeight: 1.35,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {currentCard.description}
                </p>

                {/* Funding Progress Bar */}
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      width: `${currentCard.percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #2bb673 0%, #fdf06f 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>

                {/* Amount Target & Friends Stats */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                    <span style={{ color: '#fdf06f', fontWeight: 900, fontSize: '13.5px' }}>{currentCard.amount}</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '11px' }}>{currentCard.target}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Avatars Pile */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {currentCard.avatars?.map((av, i) => (
                        <img
                          key={i}
                          src={av}
                          alt="avatar"
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '1.5px solid #0d2217',
                            marginLeft: i > 0 ? '-6px' : 0,
                            objectFit: 'cover',
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '11px', fontWeight: 600 }}>
                      {currentCard.friends}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Top-Right Notification: "Maya paid you $24" */}
            <div
              className="landing-badge-top"
              style={{
                position: 'absolute',
                top: '52px',
                right: '-38px',
                backgroundColor: 'rgba(14, 28, 20, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '9999px',
                padding: '6px 14px 6px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 14px 34px rgba(0, 0, 0, 0.6)',
                zIndex: 30,
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80"
                alt="Maya"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '11.5px', fontWeight: 800, color: '#ffffff', margin: 0, whiteSpace: 'nowrap' }}>
                  {currentCard.paidBy}
                </p>
                <p style={{ fontSize: '9.5px', color: 'rgba(255, 255, 255, 0.65)', margin: 0, whiteSpace: 'nowrap' }}>
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
                <Check size={11} strokeWidth={3.2} />
              </div>
            </div>

            {/* Floating Bottom-Left Pill: "+ Request $24" */}
            <div
              className="landing-badge-bottom"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              style={{
                position: 'absolute',
                bottom: '72px',
                left: '-28px',
                backgroundColor: '#ffffff',
                color: '#111827',
                borderRadius: '9999px',
                padding: '7px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: 800,
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.5)',
                cursor: 'pointer',
                zIndex: 30,
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Plus size={14} strokeWidth={3} />
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
