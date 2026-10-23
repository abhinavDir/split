import React, { useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownLeft,
  PiggyBank,
  TrendingUp,
  Search,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Repeat,
  Check,
  Receipt,
  Utensils,
  Plane,
  Home,
  Film,
  ShoppingBag,
  Sun,
  Moon,
  Clock,
  Plus,
  Scale,
  FolderPlus,
  History,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { OroveraMascot, PeekMascot } from './OroveraMascot';
import { formatDate, formatRelativeTime } from '../../utils/formatters';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Plane,
  Stay: Home,
  Entertainment: Film,
  Groceries: ShoppingBag,
};

export function MobileDashboardView({
  user,
  expenses = [],
  allExpenses = [],
  groups = [],
  activeGroup,
  setActiveGroupId,
  balances,
  allBalances = {},
  aggregateOwedToYouPaise = 0,
  aggregateYouOwePaise = 0,
  incomingTransfers = [],
  outgoingTransfers = [],
  totalOverallSpendPaise = 0,
  onOpenAddExpense,
  onOpenCreateGroup,
  navigate,
  isLight,
}) {
  const { toggleTheme, currentAccent, accent } = useTheme();
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  // Current user string id
  const currentUserId = (user?._id || user?.id)?.toString();

  // =========================================================================
  // 1. CALCULATE REAL BALANCES & PLATFORM DATA
  // =========================================================================
  let displayPaise = 0;
  let statusBadgeText = 'Getting funds';
  let subtitleText = 'Expected to receive';
  let isReceiving = true;
  let currencyCode = 'INR';

  if (activeGroup) {
    currencyCode = activeGroup.currency || 'INR';
    // Look up user's balance in this active group
    const grpBal = balances || allBalances[activeGroup._id];
    const myMemberBal = grpBal?.memberBalances?.find(
      (m) => m.userId?.toString() === currentUserId
    );

    if (myMemberBal) {
      if (myMemberBal.netBalancePaise > 0) {
        displayPaise = myMemberBal.netBalancePaise;
        statusBadgeText = 'Getting funds';
        subtitleText = 'Expected to receive';
        isReceiving = true;
      } else if (myMemberBal.netBalancePaise < 0) {
        displayPaise = Math.abs(myMemberBal.netBalancePaise);
        statusBadgeText = 'Outgoing debts';
        subtitleText = 'Pending to settle';
        isReceiving = false;
      } else if (grpBal?.totalGroupSpendPaise > 0) {
        displayPaise = grpBal.totalGroupSpendPaise;
        statusBadgeText = 'Settled up';
        subtitleText = 'Group total spent';
        isReceiving = true;
      } else {
        displayPaise = 0;
        statusBadgeText = 'Settled up';
        subtitleText = 'All debts cleared';
        isReceiving = true;
      }
    } else if (grpBal?.totalGroupSpendPaise > 0) {
      displayPaise = grpBal.totalGroupSpendPaise;
      statusBadgeText = 'Group volume';
      subtitleText = 'Total group expenditure';
      isReceiving = true;
    }
  } else {
    // Pooled / All Envelopes view
    if (aggregateOwedToYouPaise > 0) {
      displayPaise = aggregateOwedToYouPaise;
      statusBadgeText = 'Getting funds';
      subtitleText = 'Expected to receive';
      isReceiving = true;
    } else if (aggregateYouOwePaise > 0) {
      displayPaise = aggregateYouOwePaise;
      statusBadgeText = 'Outgoing debts';
      subtitleText = 'Pending to settle';
      isReceiving = false;
    } else if (totalOverallSpendPaise > 0) {
      displayPaise = totalOverallSpendPaise;
      statusBadgeText = 'Vault volume';
      subtitleText = 'Total pooled expenditure';
      isReceiving = true;
    } else {
      displayPaise = 0;
      statusBadgeText = 'Settled up';
      subtitleText = 'All balances cleared';
      isReceiving = true;
    }
  }

  const wholeNumber = Math.floor(Math.abs(displayPaise) / 100).toLocaleString('en-IN');
  const decimalNumber = (Math.abs(displayPaise) % 100).toString().padStart(2, '0');
  const currencySymbol = currencyCode === 'EUR' ? '€' : currencyCode === 'USD' ? '$' : '₹';

  // =========================================================================
  // 2. REAL PENDING TRANSACTIONS COUNT
  // =========================================================================
  let pendingCount = 0;
  if (activeGroup) {
    const grpBal = balances || allBalances[activeGroup._id];
    pendingCount = (grpBal?.suggestedTransfers || []).length;
  } else {
    pendingCount = (incomingTransfers?.length || 0) + (outgoingTransfers?.length || 0);
  }

  // =========================================================================
  // 3. REAL TRANSACTIONS FEED
  // =========================================================================
  // Safely gather all expenses
  const rawPool = allExpenses.length > 0 ? allExpenses : expenses;
  const filteredExpenses = activeGroup
    ? rawPool.filter((e) => {
        const eGroupId = (e.group?._id || e.group || e.groupId?._id || e.groupId)?.toString();
        return eGroupId === activeGroup._id?.toString();
      })
    : rawPool;

  // Deduplicate and pick the latest 10 real expenses
  const seenExp = new Set();
  const realTransactionList = [];
  for (const exp of filteredExpenses) {
    const id = exp._id || exp.id;
    if (id && !seenExp.has(id)) {
      seenExp.add(id);
      realTransactionList.push(exp);
    }
    if (realTransactionList.length >= 10) break;
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '0 0 110px 0',
        backgroundColor: isLight ? '#ffffff' : '#000000',
        minHeight: '100vh',
        color: isLight ? '#0f172a' : '#ffffff',
      }}
    >
      {/* ====================================================================
          TOP SUNNY GOLDEN HERO SECTION (Balance + Mascot + Wave)
          ==================================================================== */}
      <div
        style={{
          background: isLight
            ? (currentAccent?.gradient || 'linear-gradient(180deg, #ffe082 0%, #ffd54f 35%, #ffca28 75%, #ffbe2b 100%)')
            : (currentAccent?.heroGradientDark || '#000000'),
          borderBottom: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
          padding: '76px 0 0 0',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Inner Content with Horizontal Padding */}
        <div style={{ padding: '0 20px' }}>
          {/* ================= 1. ENVELOPE / HUB SELECTOR PILL ================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 20,
              marginBottom: '16px',
            }}
          >
            {/* Center: Floating Capsule Dropdown (Orovera Hub ⌵) */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowGroupPicker(!showGroupPicker)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.72)' : '#18181b',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                  color: isLight ? '#1f2937' : '#ffffff',
                  fontSize: '13px',
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
                <ChevronDown size={14} strokeWidth={3} />
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
                      fontSize: '12px',
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
                          fontSize: '12px',
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
          </div>

        {/* ================= 2. BALANCE ROW & MASCOT ================= */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Top-Left Chip: ↙ Getting funds */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: isLight ? '#ffffff' : '#18181b',
              padding: '4px 12px 4px 6px',
              borderRadius: '9999px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: isLight ? '#fef3c7' : '#27272a',
                color: isReceiving ? '#b45309' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isReceiving ? (
                <ArrowDownLeft size={13} strokeWidth={3} />
              ) : (
                <ArrowUpRight size={13} strokeWidth={3} />
              )}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: isLight ? '#1f2937' : '#ffffff',
              }}
            >
              {statusBadgeText}
            </span>
          </div>

          {/* Giant Bold Balance Numbers: 2,783.00 € / ₹ */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span
                style={{
                  fontSize: '48px',
                  fontWeight: 900,
                  color: isLight ? '#0f172a' : '#ffffff',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {wholeNumber}
              </span>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: isLight ? '#0f172a' : '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                .{decimalNumber} {currencySymbol}
              </span>
            </div>

            <p
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: isLight ? '#715509' : '#9ca3af',
                margin: '6px 0 16px 0',
              }}
            >
              {subtitleText}
            </p>
          </div>

          {/* Top-Right Mascot (8-bit pixel cool glasses & blue QR belly) */}
          <div
            style={{
              position: 'absolute',
              right: '2px',
              top: '-4px',
              zIndex: 10,
            }}
          >
            <OroveraMascot size={110} />
          </div>
        </div>

        {/* ================= 3. FLOATING PENDING PILL ================= */}
        <div
          onClick={() => navigate('/settlements')}
          style={{
            backgroundColor: isLight ? 'rgba(255, 255, 255, 0.68)' : '#18181b',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: isLight ? '1px solid rgba(255, 255, 255, 0.85)' : '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '9999px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            maxWidth: '260px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 15,
          }}
        >
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: currentAccent?.primary || '#f59e0b',
              color: accent === 'amber' ? '#000000' : '#ffffff',
              fontSize: '11px',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 8px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
            }}
          >
            {pendingCount > 0 ? pendingCount : '0'}
          </span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: isLight ? '#1e293b' : '#ffffff',
            }}
          >
            {pendingCount > 0 ? `${pendingCount} Pending transactions` : 'Pending transactions'}
          </span>
          <ChevronRight size={15} color={isLight ? '#1e293b' : '#ffffff'} strokeWidth={3} />
        </div>

        {/* 4 Carousel Dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            marginTop: '12px',
            marginBottom: '4px',
            position: 'relative',
            zIndex: 15,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.25)',
            }}
          />
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isLight ? '#0f172a' : '#ffffff',
            }}
          />
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.25)',
            }}
          />
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isLight ? 'rgba(15, 23, 42, 0.25)' : 'rgba(255, 255, 255, 0.25)',
            }}
          />
        </div>
      </div>

      {/* ================= 4. FULL-WIDTH ORGANIC SNAKE WAVE TRANSITION ================= */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          marginTop: '12px',
          height: '66px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
          background: isLight
            ? (currentAccent?.waveGradient || 'linear-gradient(180deg, #ffca28 0%, #ffbe2b 100%)')
            : '#000000',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Center Peeking Little Mascot Sitting along the Snake Wave */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            zIndex: 12,
            filter: isLight
              ? 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))'
              : 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.6))',
          }}
        >
          <PeekMascot size={58} />
        </div>

        {/* Fluid Organic Snake Wave SVG (Multi-layer flowing wave) */}
        <svg
          viewBox="0 0 400 66"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '66px', display: 'block', marginBottom: '-1px' }}
          preserveAspectRatio="none"
        >
          {/* Back undulating snake wave (translucent depth layer) */}
          <path
            d="M0 38 C45 18 95 12 145 28 C195 44 245 48 295 24 C340 4 375 14 400 22 L400 66 L0 66 Z"
            fill={isLight ? 'rgba(255, 255, 255, 0.38)' : 'rgba(255, 255, 255, 0.10)'}
          />

          {/* Middle accent crest wave */}
          <path
            d="M0 48 C60 26 120 48 180 34 C230 20 280 8 340 22 C370 28 390 26 400 24 L400 66 L0 66 Z"
            fill={isLight ? 'rgba(255, 255, 255, 0.52)' : 'rgba(255, 255, 255, 0.16)'}
          />

          {/* Front primary solid snake wave transitioning into page body */}
          <path
            d="M0 32 C55 12 110 46 175 36 C220 28 260 10 315 16 C355 20 385 36 400 42 L400 66 L0 66 Z"
            fill={isLight ? '#ffffff' : '#000000'}
          />
        </svg>
      </div>
    </div>

      {/* ====================================================================
          BOTTOM SECTION (4 Quick Action Buttons + Transactions List)
          ==================================================================== */}
      <div style={{ padding: '16px 18px 0 18px' }}>
        {/* ================= 5. 4 CIRCULAR BLACK BUTTONS ================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            margin: '8px 0 24px 0',
            textAlign: 'center',
          }}
        >
          {/* Button 1: Add Expense */}
          <div
            onClick={onOpenAddExpense}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: currentAccent?.primary || '#f59e0b',
                color: accent === 'amber' ? '#000000' : '#ffffff',
                border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 16px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.45)'}`,
                transition: 'transform 0.15s ease',
              }}
            >
              <Plus size={24} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', whiteSpace: 'nowrap' }}>
              Add Expense
            </span>
          </div>

          {/* Button 2: Settle Up */}
          <div
            onClick={() => navigate('/settlements')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isLight ? '#000000' : '#18181b',
                border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Scale size={22} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', whiteSpace: 'nowrap' }}>
              Settle Up
            </span>
          </div>

          {/* Button 3: New Group */}
          <div
            onClick={onOpenCreateGroup}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isLight ? '#000000' : '#18181b',
                border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                transition: 'transform 0.15s ease',
              }}
            >
              <FolderPlus size={22} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', whiteSpace: 'nowrap' }}>
              New Group
            </span>
          </div>

          {/* Button 4: Activity */}
          <div
            onClick={() => navigate('/activity')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: isLight ? '#000000' : '#18181b',
                border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
                transition: 'transform 0.15s ease',
              }}
            >
              <History size={22} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', whiteSpace: 'nowrap' }}>
              Activity
            </span>
          </div>
        </div>

        {/* ================= 6. TRANSACTIONS SECTION ================= */}
        <div>
          {/* Header Row: Transactions | 🔍 View All */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: isLight ? '#0f172a' : '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Transactions
            </h2>

            <button
              onClick={() => navigate('/activity')}
              style={{
                background: 'none',
                border: 'none',
                color: isLight ? '#64748b' : '#9ca3af',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Search size={14} strokeWidth={2.8} />
              <span>View All</span>
            </button>
          </div>

          {/* Date Separator */}
          <p
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: isLight ? '#94a3b8' : '#71717a',
              margin: '0 0 16px 0',
            }}
          >
            {formatDate(new Date())}
          </p>

          {/* Real Transactions Feed Items */}
          {realTransactionList.length === 0 ? (
            <div
              style={{
                padding: '36px 20px',
                textAlign: 'center',
                backgroundColor: isLight ? '#f8fafc' : '#0a0a0c',
                borderRadius: '18px',
                border: isLight ? '1px dashed #e2e8f0' : '1px dashed rgba(255,255,255,0.12)',
              }}
            >
              <Clock size={32} style={{ color: isLight ? '#cbd5e1' : '#52525b', margin: '0 auto 10px auto' }} />
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '4px' }}>
                No expenses in {activeGroup?.name || 'vault'} yet
              </h4>
              <p style={{ fontSize: '12px', color: isLight ? '#64748b' : '#a1a1aa', margin: 0 }}>
                Tap "Get" above to record your first shared expense.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {realTransactionList.map((exp, idx) => {
                const isPayer =
                  (exp.payer?._id || exp.payer || exp.payerId)?.toString() === currentUserId;
                const payerDisplayName = exp.payer?.name || exp.payerName || (isPayer ? 'You' : 'Member');
                const expCurrency = exp.currency === 'EUR' ? '€' : exp.currency === 'USD' ? '$' : '₹';
                const amountFormatted = (exp.amountPaise / 100).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

                return (
                  <div
                    key={exp._id || idx}
                    onClick={() => navigate('/activity')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                      border: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '18px',
                      cursor: 'pointer',
                      boxShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.04)' : 'none',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    {/* Left Icon + Description */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : '#27272a',
                          color: isLight ? (currentAccent?.dark || '#d97706') : (currentAccent?.light || '#fbbf24'),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ArrowDownLeft size={18} strokeWidth={2.8} />
                      </div>

                      <div>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 800,
                            color: isLight ? '#0f172a' : '#ffffff',
                            margin: '0 0 4px 0',
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {exp.description}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              color: currentAccent?.primary || '#f59e0b',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <Sparkles size={11} /> New
                          </span>
                          <span style={{ fontSize: '11px', color: isLight ? '#94a3b8' : '#71717a' }}>•</span>
                          <span style={{ fontSize: '11px', color: isLight ? '#64748b' : '#9ca3af' }}>
                            {payerDisplayName} • {formatRelativeTime(exp.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Amount in Bold Accent */}
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: 900,
                          color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'),
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {amountFormatted} {expCurrency}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
