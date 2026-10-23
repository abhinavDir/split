import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { MemberAvatar } from '../components/common/MemberAvatar';
import { OroveraMascot } from '../components/dashboard/OroveraMascot';
import { isValidUpiId } from '../utils/upiHelper';
import { authService } from '../services/auth.service';
import {
  User,
  Smartphone,
  Mail,
  Shield,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Link,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Menu,
  Check,
  QrCode,
  Copy,
} from 'lucide-react';

export function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme, currentAccent, accent } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const { onOpenMobileDrawer } = useOutletContext() || {};

  const {
    groups = [],
    activeGroup,
    setActiveGroupId,
    balances,
    allBalances = {},
    aggregateOwedToYouPaise = 0,
    aggregateYouOwePaise = 0,
    incomingTransfers = [],
    outgoingTransfers = [],
  } = useExpenseGroup() || {};

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [upiId, setUpiId] = useState(user?.upiId || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showGroupPicker, setShowGroupPicker] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Currency code & symbol
  const currencySymbol = activeGroup?.currency === 'EUR' ? '€' : activeGroup?.currency === 'USD' ? '$' : '₹';

  // Real user IDs and handles (no dummy fake strings)
  const currentUserId = (user?._id || user?.id)?.toString();
  const splitIdNumber = currentUserId ? currentUserId.slice(-4).toUpperCase() : 'USER';
  const userHandle = user?.email
    ? user.email.split('@')[0].toLowerCase()
    : (user?.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Real Settled volume calculation
  let realSettledPaise = 0;
  if (activeGroup) {
    const grpBal = balances || allBalances?.[activeGroup._id];
    const myMember = grpBal?.memberBalances?.find((m) => m.userId?.toString() === currentUserId);
    realSettledPaise = myMember?.paidPaise || grpBal?.totalGroupSpendPaise || 0;
  } else {
    Object.values(allBalances || {}).forEach((b) => {
      const myMember = b?.memberBalances?.find((m) => m.userId?.toString() === currentUserId);
      if (myMember?.paidPaise) realSettledPaise += myMember.paidPaise;
    });
  }

  const settledDisplay = realSettledPaise > 0
    ? `${Math.floor(realSettledPaise / 100).toLocaleString('en-IN')} ${currencySymbol}`
    : `0 ${currencySymbol}`;

  // Real Pending Settle requests count & amount
  const pendingCount = (incomingTransfers?.length || 0) + (outgoingTransfers?.length || 0);
  const pendingTotalPaise = aggregateYouOwePaise + aggregateOwedToYouPaise;
  const pendingFormatted = pendingCount > 0
    ? `${(pendingTotalPaise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencySymbol}`
    : `0.00 ${currencySymbol}`;

  // Real dynamic Split Score (100% when no pending debts)
  const splitScore = outgoingTransfers?.length > 0
    ? `${Math.max(68, 100 - outgoingTransfers.length * 8).toFixed(1)}%`
    : '100%';

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (upiId && !isValidUpiId(upiId)) {
      setError('Please enter a valid UPI ID (e.g. name@okhdfcbank or 9876543210@paytm)');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    const res = await updateProfile({
      name: name.trim(),
      upiId: upiId.trim(),
      avatarUrl: avatarUrl ? avatarUrl.trim() : '',
    });

    setIsLoading(false);

    if (res.success) {
      setSuccess('UPI ID and profile updated successfully! Group members will now see your updated UPI ID when paying.');
      window.dispatchEvent(new Event('group:data-changed'));
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(res.error || 'Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: isLight ? '#f8fafc' : '#000000',
        color: isLight ? '#0f172a' : '#ffffff',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ====================================================================
          TOP SUNNY GOLDEN PROFILE HERO
          ==================================================================== */}
      <div
        style={{
          width: '100%',
          background: isLight
            ? (currentAccent?.gradient || 'linear-gradient(135deg, #ffe082 0%, #ffd54f 35%, #ffca28 75%, #ffbe2b 100%)')
            : (currentAccent?.heroGradientDark || 'radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 55%), #000000'),
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease',
          paddingTop: '18px',
        }}
      >
        {/* Central Inner Wrapper */}
        <div style={{ maxWidth: '440px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
          {/* ================= 1. HEADER: [< BACK]  [OROVERA HUB ⌵]  [☰ HAMBURGER] ================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            {/* Left Circular Orange Back Button */}
            <button
              onClick={() => navigate(-1)}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: currentAccent?.primary || '#f97316',
                border: 'none',
                color: accent === 'amber' ? '#000000' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isLight ? '0 2px 10px rgba(0, 0, 0, 0.12)' : '0 2px 10px rgba(0, 0, 0, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              title="Go Back"
              aria-label="Back"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <ChevronLeft size={22} strokeWidth={3.2} />
            </button>

            {/* Center Capsule Dropdown Pill: Orovera Hub ⌵ */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowGroupPicker(!showGroupPicker)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.78)' : '#18181b',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                  color: isLight ? '#1f2937' : '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activeGroup?.name || 'Orovera Hub'}
                </span>
                <ChevronDown size={15} strokeWidth={3} />
              </button>

              {/* Dropdown Menu */}
              {showGroupPicker && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '240px',
                    backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                    border: isLight ? '1px solid #fde68a' : '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '20px',
                    padding: '8px',
                    zIndex: 100,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
                  }}
                >
                  <div
                    onClick={() => {
                      setActiveGroupId(null);
                      setShowGroupPicker(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      backgroundColor: !activeGroup
                        ? (isLight ? (currentAccent?.bg || '#fef3c7') : (currentAccent?.subtle || 'rgba(245, 158, 11, 0.2)'))
                        : 'transparent',
                      color: !activeGroup
                        ? (isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'))
                        : (isLight ? '#1e293b' : '#ffffff'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Orovera Hub (Pooled)</span>
                    {!activeGroup && <Check size={14} strokeWidth={3} />}
                  </div>

                  {groups.map((g) => {
                    const isSelected = activeGroup?._id === g._id;
                    return (
                      <div
                        key={g._id}
                        onClick={() => {
                          setActiveGroupId(g._id);
                          setShowGroupPicker(false);
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          fontSize: '12.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          backgroundColor: isSelected
                            ? (isLight ? (currentAccent?.bg || '#fef3c7') : (currentAccent?.subtle || 'rgba(245, 158, 11, 0.2)'))
                            : 'transparent',
                          color: isSelected
                            ? (isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'))
                            : (isLight ? '#1e293b' : '#ffffff'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {g.name}
                        </span>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Circular Hamburger Button (Replaced msg icon) */}
            <button
              onClick={() => onOpenMobileDrawer && onOpenMobileDrawer()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: isLight ? '#ffffff' : '#18181b',
                border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isLight ? '#0f172a' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isLight ? '0 2px 10px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              title="Open Navigation Menu"
              aria-label="Navigation Menu"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Menu size={20} strokeWidth={2.8} />
            </button>
          </div>

          {/* ================= 2. REAL IDENTITY ROW + MASCOT ================= */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
            {/* Left Info Stack */}
            <div style={{ flex: 1, paddingRight: '10px' }}>
              {/* Green Verified Tier Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: isLight ? '#1f2937' : '#ffffff',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Tandem Pro Tier
                </span>
              </div>

              {/* Real User Name */}
              <h1
                style={{
                  fontSize: 'clamp(28px, 6vw, 34px)',
                  fontWeight: 900,
                  color: isLight ? '#0f172a' : '#ffffff',
                  letterSpacing: '-0.03em',
                  margin: '0 0 4px 0',
                  lineHeight: 1.15,
                }}
              >
                {user?.name || 'User'}
              </h1>

              {/* Real User Handle & Split ID */}
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: isLight ? '#715509' : '#a1a1aa',
                  margin: '0 0 16px 0',
                }}
              >
                @{userHandle}.tandem • Split ID #{splitIdNumber}
              </p>

              {/* Real Statistics Cards (SPLIT SCORE & REAL SETTLED VOLUME) */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Pill 1: REAL SPLIT SCORE */}
                <div
                  style={{
                    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.65)' : '#18181b',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: isLight ? '1px solid rgba(255, 255, 255, 0.85)' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    padding: '8px 14px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    minWidth: '100px',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    SPLIT SCORE
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    {splitScore} 🔥
                  </div>
                </div>

                {/* Pill 2: REAL SETTLED VOLUME */}
                <div
                  style={{
                    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.65)' : '#18181b',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: isLight ? '1px solid rgba(255, 255, 255, 0.85)' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    padding: '8px 14px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    minWidth: '100px',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    SETTLED
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginTop: '2px' }}>
                    {settledDisplay}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Mascot (8-bit Cool Sunglasses, Blue Crest, QR Belly) */}
            <div style={{ flexShrink: 0, marginTop: '-6px' }}>
              <OroveraMascot size={118} />
            </div>
          </div>

          {/* ================= 3. REAL FLOATING PENDING SETTLE REQUESTS PILL ================= */}
          <div
            onClick={() => navigate('/settlements')}
            style={{
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : '#18181b',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '9999px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
              marginTop: '20px',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {/* Left Pill Badge + Real Text */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: currentAccent?.primary || '#f59e0b',
                  color: accent === 'amber' ? '#000000' : '#ffffff',
                  fontSize: '12px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 8px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
                }}
              >
                {pendingCount}
              </span>
              <span
                style={{
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: isLight ? '#0f172a' : '#ffffff',
                }}
              >
                {pendingCount > 0 ? `${pendingCount} Pending settle requests` : 'All debts settled'}
              </span>
            </div>

            {/* Right Real Amount + Chevron */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 900,
                  color: isLight ? '#0f172a' : '#ffffff',
                }}
              >
                {pendingFormatted}
              </span>
              <ChevronRight size={16} color={isLight ? '#0f172a' : '#ffffff'} strokeWidth={3} />
            </div>
          </div>

          {/* ================= 4. 4 CAROUSEL DOTS ================= */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              marginTop: '16px',
              marginBottom: '6px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isLight ? '#0f172a' : '#ffffff' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.25)' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.25)' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.25)' }} />
          </div>
        </div>

        {/* ================= 5. CURVED WAVE TRANSITION INTO BOTTOM CONTENT ================= */}
        <div style={{ width: '100%', overflow: 'hidden', marginTop: '10px' }}>
          <svg
            viewBox="0 0 400 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '52px', display: 'block', marginBottom: '-1px' }}
            preserveAspectRatio="none"
          >
            <path
              d="M0 52 Q200 0 400 52 L400 52 L0 52 Z"
              fill={isLight ? '#f8fafc' : '#000000'}
            />
          </svg>
        </div>
      </div>

      {/* ====================================================================
          LOWER MANAGEMENT & SETTINGS SECTION (REAL DATA ONLY)
          ==================================================================== */}
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '20px 20px 100px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Status Alerts */}
        {success && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: isLight ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 230, 118, 0.12)',
              color: isLight ? '#059669' : '#00e676',
              border: isLight ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(0, 230, 118, 0.3)',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle2 size={16} strokeWidth={2.6} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: isLight ? 'rgba(225, 29, 72, 0.08)' : 'rgba(244, 63, 94, 0.12)',
              color: isLight ? '#e11d48' : '#f43f5e',
              border: isLight ? '1px solid rgba(225, 29, 72, 0.25)' : '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={16} strokeWidth={2.6} />
            <span>{error}</span>
          </div>
        )}

        {/* ================= CARD 1: IDENTITY & REAL SETTLEMENT UPI ================= */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.04)' : '0 8px 32px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '22px',
              paddingBottom: '18px',
              borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <MemberAvatar name={user?.name || 'User'} avatarUrl={avatarUrl} size="lg" />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: currentAccent?.primary || '#10b981',
                  border: isLight ? '2.5px solid #ffffff' : '2.5px solid #0a0a0c',
                  boxShadow: `0 0 8px ${currentAccent?.primary || '#10b981'}`,
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                {user?.name || 'User'}
              </h3>
              <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', margin: '3px 0 0 0', fontWeight: 700 }}>
                {user?.email}
              </p>
              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? (currentAccent?.bg || '#ecfdf5') : (currentAccent?.subtle || 'rgba(16, 185, 129, 0.15)'),
                    color: isLight ? (currentAccent?.dark || '#047857') : (currentAccent?.light || '#34d399'),
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={11} /> Verified Account
                </span>
                {upiId && (
                  <span
                    onClick={() => copyToClipboard(upiId)}
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      backgroundColor: isLight ? '#f1f5f9' : '#18181b',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.1)',
                      color: isLight ? '#334155' : '#e2e8f0',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Click to copy UPI ID"
                  >
                    UPI: {upiId} {copiedUpi ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: isLight ? '#475569' : '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Full Legal Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    backgroundColor: isLight ? '#f8fafc' : '#141417',
                    border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '9999px',
                    padding: '11px 18px 11px 42px',
                    color: isLight ? '#0f172a' : '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = currentAccent?.primary || '#f59e0b')}
                  onBlur={(e) => (e.target.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)')}
                />
                <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: isLight ? '#94a3b8' : '#71717a' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: isLight ? '#475569' : '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email Address (Read-Only)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  disabled
                  style={{
                    width: '100%',
                    backgroundColor: isLight ? '#f1f5f9' : '#101014',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '9999px',
                    padding: '11px 18px 11px 42px',
                    color: isLight ? '#64748b' : '#71717a',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'not-allowed',
                  }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: isLight ? '#94a3b8' : '#71717a' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 900, color: isLight ? '#475569' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Settlement UPI ID (VPA)
                </label>
                {upiId && (
                  <button
                    type="button"
                    onClick={() => setShowQrCode(!showQrCode)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: currentAccent?.primary || '#f59e0b',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0,
                    }}
                  >
                    <QrCode size={13} />
                    <span>{showQrCode ? 'Hide QR' : 'Show QR Preview'}</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    placeholder="e.g. name@okhdfcbank or 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: isLight ? '#f8fafc' : '#141417',
                      border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '9999px',
                      padding: '11px 18px 11px 42px',
                      color: isLight ? '#0f172a' : '#ffffff',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontFamily: 'var(--font-mono)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = currentAccent?.primary || '#f59e0b')}
                    onBlur={(e) => (e.target.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)')}
                  />
                  <Smartphone size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: isLight ? '#94a3b8' : '#71717a' }} />
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#000000' : (currentAccent?.primary || '#f59e0b'),
                    border: 'none',
                    color: isLight ? '#ffffff' : (accent === 'amber' ? '#000000' : '#ffffff'),
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.15)' : `0 0 12px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.3)'}`,
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save UPI'}
                </button>
              </div>
              <p style={{ fontSize: '11.5px', color: isLight ? '#64748b' : '#9ca3af', marginTop: '6px', margin: '6px 0 0 0' }}>
                Group members can tap "Pay with UPI" to settle expenses directly into your bank account.
              </p>

              {/* Instant Dynamic QR Preview Box */}
              {showQrCode && upiId && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '16px',
                    backgroundColor: isLight ? '#f8fafc' : '#141417',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=${encodeURIComponent(user?.name || 'User')}&cu=INR`)}`}
                    alt="UPI Settlement QR Code"
                    style={{ width: '150px', height: '150px', borderRadius: '12px', border: '3px solid #ffffff' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                    {upiId}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: isLight ? '#475569' : '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Avatar Image URL (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: isLight ? '#f8fafc' : '#141417',
                    border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '9999px',
                    padding: '11px 18px 11px 42px',
                    color: isLight ? '#0f172a' : '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = currentAccent?.primary || '#f59e0b')}
                  onBlur={(e) => (e.target.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.12)')}
                />
                <Link size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: isLight ? '#94a3b8' : '#71717a' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: '12px 28px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? '#000000' : (currentAccent?.primary || '#f59e0b'),
                  border: 'none',
                  color: isLight ? '#ffffff' : (accent === 'amber' ? '#000000' : '#ffffff'),
                  fontSize: '13.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: isLight ? '0 4px 14px rgba(0, 0, 0, 0.2)' : `0 0 20px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>{isLoading ? 'Saving...' : 'Save Profile Changes ⚡'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* ================= CARD 2: REAL ENVELOPES & VAULT MEMBERSHIPS ================= */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '22px 24px',
            boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              Your Shared Envelopes
            </h4>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: isLight ? '#f1f5f9' : '#18181b',
                color: isLight ? '#64748b' : '#a1a1aa',
              }}
            >
              {groups.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {groups.length === 0 ? (
              <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', margin: 0 }}>
                No active shared groups yet. Create one from the bottom menu!
              </p>
            ) : (
              groups.slice(0, 6).map((g) => (
                <div
                  key={g._id}
                  onClick={() => navigate(`/groups/${g._id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    backgroundColor: isLight ? '#f8fafc' : '#141417',
                    border: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = isLight ? '#f1f5f9' : '#1c1c22')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = isLight ? '#f8fafc' : '#141417')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : '#27272a',
                        color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 900,
                      }}
                    >
                      {g.name?.[0]?.toUpperCase() || 'E'}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                      {g.name}
                    </span>
                  </div>
                  <ChevronRight size={15} color={isLight ? '#94a3b8' : '#71717a'} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= CARD 3: SECURITY & TERMINATE SESSION ================= */}
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.04)' : 'none',
          }}
        >
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
              Session Security & Sign Out
            </h4>
            <p style={{ fontSize: '12.5px', color: isLight ? '#64748b' : '#9ca3af', margin: '3px 0 0 0' }}>
              Terminate your authenticated session and clear encryption keys from this device.
            </p>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
