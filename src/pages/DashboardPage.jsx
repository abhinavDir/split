import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useTheme } from '../context/ThemeContext';
import { formatPaise, formatDate, formatRelativeTime } from '../utils/formatters';
import { expenseService } from '../services/expense.service';
import {
  QrCode,
  Sparkles,
  Zap,
  ArrowRight,
  Bell,
  Check,
  Users,
  Lock,
  FolderPlus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  ChevronRight,
  Search,
  PiggyBank,
  Clock,
} from 'lucide-react';
import { MobileDashboardView } from '../components/dashboard/MobileDashboardView';
import { OroveraMascot } from '../components/dashboard/OroveraMascot';

export function DashboardPage() {
  const { user } = useAuth();
  const { theme, currentAccent, accent } = useTheme();
  const isLight = theme === 'light';
  const {
    groups,
    expenses,
    activeGroup,
    setActiveGroupId,
    balances,
    aggregateOwedToYouPaise,
    aggregateYouOwePaise,
    allBalances,
  } = useExpenseGroup();
  const { onOpenAddExpense, onOpenCreateGroup } = useOutletContext();
  const navigate = useNavigate();

  // QR Modal state
  const [showQrModal, setShowQrModal] = useState(false);
  const [nudgeSent, setNudgeSent] = useState(false);
  const [reweightActive, setReweightActive] = useState(false);

  // Liquid Split Studio interactive state
  const [currency, setCurrency] = useState('INR');
  const [totalBill, setTotalBill] = useState(1000);
  const [allocations, setAllocations] = useState([]);
  const [allExpensesList, setAllExpensesList] = useState([]);

  // Fetch real expenses across all user groups for comprehensive mobile transactions feed
  useEffect(() => {
    let isMounted = true;
    async function loadAllGroupExpenses() {
      if (!groups || groups.length === 0) return;
      try {
        const promises = groups.map(async (g) => {
          try {
            const res = await expenseService.getExpenses(g._id);
            return res?.data?.expenses || [];
          } catch {
            return [];
          }
        });
        const results = await Promise.all(promises);
        const aggregated = results.flat();
        aggregated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (isMounted) {
          setAllExpensesList(aggregated);
        }
      } catch (err) {
        console.error('Error fetching all group expenses:', err);
      }
    }
    loadAllGroupExpenses();
    return () => {
      isMounted = false;
    };
  }, [groups, expenses]);

  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  // Deduplicated unique groups
  const uniqueGroups = useMemo(() => {
    const map = new Map();
    (groups || []).forEach((g) => {
      if (g?._id && !map.has(g._id)) {
        map.set(g._id, g);
      }
    });
    return Array.from(map.values());
  }, [groups]);

  // Overall Vault pooled sum across all groups (paise)
  const totalOverallSpendPaise = useMemo(() => {
    let sum = 0;
    Object.values(allBalances || {}).forEach((b) => {
      sum += b?.totalGroupSpendPaise || 0;
    });
    return sum;
  }, [allBalances]);

  // Unique members across all groups (no duplicates)
  const uniqueMembers = useMemo(() => {
    const map = new Map();
    if (user?._id) {
      map.set(user._id.toString(), {
        id: user._id.toString(),
        name: `${user.name || 'You'} (You)`,
        initial: (user.name?.[0] || 'U').toUpperCase(),
        isMe: true,
      });
    }

    uniqueGroups.forEach((g) => {
      (g.members || []).forEach((m, idx) => {
        const mId = m.userId?._id || m.userId || m._id || `m-${g._id}-${idx}`;
        const mIdStr = mId.toString();
        if (!map.has(mIdStr)) {
          const mName = m.name || m.userId?.name || m.email || m.userId?.email || `Member ${map.size + 1}`;
          map.set(mIdStr, {
            id: mIdStr,
            name: mIdStr === user?._id?.toString() ? `${mName} (You)` : mName,
            initial: (mName[0] || 'M').toUpperCase(),
            isMe: mIdStr === user?._id?.toString(),
          });
        }
      });
    });

    return Array.from(map.values());
  }, [uniqueGroups, user]);

  // Deduplicated real incoming transfers (Where current user is creditor: tx.to === user)
  const incomingTransfers = useMemo(() => {
    const list = [];
    const seen = new Set();

    Object.entries(allBalances || {}).forEach(([grpId, grpBal]) => {
      const grp = uniqueGroups.find((g) => g._id === grpId);
      (grpBal?.suggestedTransfers || []).forEach((tx, idx) => {
        if (tx.to?.id?.toString() === user?._id?.toString() && tx.amountPaise > 0) {
          const key = `${grpId}-${tx.from?.id || idx}-${tx.amountPaise}`;
          if (!seen.has(key)) {
            seen.add(key);
            list.push({
              id: key,
              fromName: tx.from?.name || tx.from?.email || 'Group Member',
              groupName: grp?.name || 'Shared Envelope',
              amountPaise: tx.amountPaise,
              groupId: grpId,
            });
          }
        }
      });
    });

    return list;
  }, [allBalances, uniqueGroups, user]);

  // Deduplicated real outgoing transfers (Where current user is debtor: tx.from === user)
  const outgoingTransfers = useMemo(() => {
    const list = [];
    const seen = new Set();

    Object.entries(allBalances || {}).forEach(([grpId, grpBal]) => {
      const grp = uniqueGroups.find((g) => g._id === grpId);
      (grpBal?.suggestedTransfers || []).forEach((tx, idx) => {
        if (tx.from?.id?.toString() === user?._id?.toString() && tx.amountPaise > 0) {
          const key = `${grpId}-${tx.to?.id || idx}-${tx.amountPaise}`;
          if (!seen.has(key)) {
            seen.add(key);
            list.push({
              id: key,
              toName: tx.to?.name || tx.to?.email || 'Group Member',
              groupName: grp?.name || 'Shared Envelope',
              amountPaise: tx.amountPaise,
              groupId: grpId,
            });
          }
        }
      });
    });

    return list;
  }, [allBalances, uniqueGroups, user]);

  // Dynamically synchronize Liquid Split Studio allocations with real group members
  useEffect(() => {
    const targetGroup = activeGroup || (uniqueGroups.length > 0 ? uniqueGroups[0] : null);
    if (targetGroup?.members && targetGroup.members.length > 0) {
      const count = targetGroup.members.length;
      const basePercent = Math.floor(100 / count);
      const remainder = 100 - basePercent * count;

      const newAllocations = targetGroup.members.map((m, idx) => {
        const memberId = m.userId?._id || m.userId || m._id || `alloc-${idx}`;
        const memberName = m.name || m.userId?.name || m.email || m.userId?.email || `Member ${idx + 1}`;
        const isMe = memberId?.toString() === user?._id?.toString();
        return {
          id: memberId.toString(),
          name: isMe ? `${memberName} (You)` : memberName,
          initial: (memberName[0] || 'M').toUpperCase(),
          percent: basePercent + (idx === 0 ? remainder : 0),
        };
      });
      setAllocations(newAllocations);
    } else if (user) {
      setAllocations([
        {
          id: user._id?.toString() || 'me',
          name: `${user.name || 'You'} (You)`,
          initial: (user.name?.[0] || 'U').toUpperCase(),
          percent: 100,
        },
      ]);
    }
  }, [activeGroup, uniqueGroups, user]);

  const handleSliderChange = (id, newPercent) => {
    const val = Number(newPercent);
    setAllocations((prev) => {
      const target = prev.find((p) => p.id === id);
      if (!target) return prev;
      const diff = val - target.percent;
      const others = prev.filter((p) => p.id !== id);
      const otherTotal = others.reduce((acc, p) => acc + p.percent, 0);

      return prev.map((p) => {
        if (p.id === id) return { ...p, percent: val };
        if (otherTotal === 0) return { ...p, percent: Math.max(0, Math.round((100 - val) / (others.length || 1))) };
        const adjusted = Math.max(0, Math.round(p.percent - diff * (p.percent / otherTotal)));
        return { ...p, percent: adjusted };
      });
    });
  };

  const handleEqualize = () => {
    if (allocations.length === 0) return;
    const base = Math.floor(100 / allocations.length);
    const remainder = 100 - base * allocations.length;
    setAllocations((prev) =>
      prev.map((p, idx) => ({ ...p, percent: base + (idx === 0 ? remainder : 0) }))
    );
  };

  const handleAddTip = () => {
    setTotalBill((prev) => Math.round(prev * 1.18));
  };

  const totalAllocatedPercent = allocations.reduce((acc, p) => acc + p.percent, 0);

  // Settlement ratio for radial gauge
  const settlementPercent = useMemo(() => {
    if (totalOverallSpendPaise === 0) return 100;
    if (aggregateYouOwePaise === 0) return 100;
    const ratio = Math.round(((totalOverallSpendPaise - aggregateYouOwePaise) / totalOverallSpendPaise) * 100);
    return Math.max(10, Math.min(100, ratio));
  }, [totalOverallSpendPaise, aggregateYouOwePaise]);

  // State for desktop envelope switcher dropdown
  const [showDesktopGroupPicker, setShowDesktopGroupPicker] = useState(false);

  // Desktop new format balance computation
  let desktopDisplayPaise = 0;
  let desktopStatusBadgeText = 'Getting funds';
  let desktopSubtitleText = 'Expected to receive';
  let desktopIsReceiving = true;
  let desktopCurrencyCode = 'INR';

  if (activeGroup) {
    desktopCurrencyCode = activeGroup.currency || 'INR';
    const grpBal = balances || allBalances[activeGroup._id];
    const myMemberBal = grpBal?.memberBalances?.find(
      (m) => m.userId?.toString() === (user?._id || user?.id)?.toString()
    );

    if (myMemberBal) {
      if (myMemberBal.netBalancePaise > 0) {
        desktopDisplayPaise = myMemberBal.netBalancePaise;
        desktopStatusBadgeText = 'Getting funds';
        desktopSubtitleText = 'Expected to receive';
        desktopIsReceiving = true;
      } else if (myMemberBal.netBalancePaise < 0) {
        desktopDisplayPaise = Math.abs(myMemberBal.netBalancePaise);
        desktopStatusBadgeText = 'Outgoing debts';
        desktopSubtitleText = 'Pending to settle';
        desktopIsReceiving = false;
      } else if (grpBal?.totalGroupSpendPaise > 0) {
        desktopDisplayPaise = grpBal.totalGroupSpendPaise;
        desktopStatusBadgeText = 'Settled up';
        desktopSubtitleText = 'Group total spent';
        desktopIsReceiving = true;
      } else {
        desktopDisplayPaise = 0;
        desktopStatusBadgeText = 'Settled up';
        desktopSubtitleText = 'All debts cleared';
        desktopIsReceiving = true;
      }
    } else if (grpBal?.totalGroupSpendPaise > 0) {
      desktopDisplayPaise = grpBal.totalGroupSpendPaise;
      desktopStatusBadgeText = 'Group volume';
      desktopSubtitleText = 'Total group expenditure';
      desktopIsReceiving = true;
    }
  } else {
    if (aggregateOwedToYouPaise > 0) {
      desktopDisplayPaise = aggregateOwedToYouPaise;
      desktopStatusBadgeText = 'Getting funds';
      desktopSubtitleText = 'Expected to receive';
      desktopIsReceiving = true;
    } else if (aggregateYouOwePaise > 0) {
      desktopDisplayPaise = aggregateYouOwePaise;
      desktopStatusBadgeText = 'Outgoing debts';
      desktopSubtitleText = 'Pending to settle';
      desktopIsReceiving = false;
    } else if (totalOverallSpendPaise > 0) {
      desktopDisplayPaise = totalOverallSpendPaise;
      desktopStatusBadgeText = 'Vault volume';
      desktopSubtitleText = 'Total pooled expenditure';
      desktopIsReceiving = true;
    } else {
      desktopDisplayPaise = 0;
      desktopStatusBadgeText = 'Settled up';
      desktopSubtitleText = 'All balances cleared';
      desktopIsReceiving = true;
    }
  }

  const desktopWholeNumber = Math.floor(Math.abs(desktopDisplayPaise) / 100).toLocaleString('en-IN');
  const desktopDecimalNumber = (Math.abs(desktopDisplayPaise) % 100).toString().padStart(2, '0');
  const desktopCurrencySymbol = desktopCurrencyCode === 'EUR' ? '€' : desktopCurrencyCode === 'USD' ? '$' : '₹';
  const desktopPendingCount = activeGroup
    ? (balances?.suggestedTransfers || allBalances[activeGroup._id]?.suggestedTransfers || []).length
    : (incomingTransfers?.length || 0) + (outgoingTransfers?.length || 0);

  // Desktop real transaction list
  const desktopFilteredExpenses = activeGroup
    ? allExpensesList.filter((e) => (e.group?._id || e.group || e.groupId?._id || e.groupId)?.toString() === activeGroup._id?.toString())
    : allExpensesList;
  const desktopRecentTransactions = desktopFilteredExpenses.slice(0, 8);

  return (
    <div
      style={{
        width: '100%',
        color: isLight ? '#0f172a' : '#ffffff',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ===================== MOBILE VIEW (Exact image match for mobile devices) ===================== */}
      <div className="hidden-desktop">
        <MobileDashboardView
          user={user}
          expenses={
            allExpensesList.length > 0
              ? (activeGroup ? (expenses.length > 0 ? expenses : allExpensesList.filter(e => e.groupId?.toString() === activeGroup._id?.toString())) : allExpensesList)
              : expenses
          }
          allExpenses={allExpensesList}
          groups={uniqueGroups}
          activeGroup={activeGroup}
          setActiveGroupId={setActiveGroupId}
          balances={balances}
          allBalances={allBalances}
          aggregateOwedToYouPaise={aggregateOwedToYouPaise}
          aggregateYouOwePaise={aggregateYouOwePaise}
          incomingTransfers={incomingTransfers}
          outgoingTransfers={outgoingTransfers}
          totalOverallSpendPaise={totalOverallSpendPaise}
          onOpenAddExpense={onOpenAddExpense}
          onOpenCreateGroup={onOpenCreateGroup}
          navigate={navigate}
          isLight={isLight}
        />
      </div>

      {/* ===================== DESKTOP VIEW (Large screens) ===================== */}
      <div
        className="hidden-mobile"
        style={{
          padding: '88px 32px 64px 32px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* ================= 1. APEX GOLDEN HERO BANNER ================= */}
        <div
          style={{
            background: isLight
              ? (currentAccent?.gradient || 'linear-gradient(135deg, #ffe082 0%, #ffd54f 35%, #ffca28 75%, #ffbe2b 100%)')
              : (currentAccent?.heroGradientDark || 'radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 55%), #000000'),
            border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '28px',
            padding: '36px 40px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '26px',
            boxShadow: isLight
              ? `0 12px 36px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.18)'}`
              : '0 20px 50px rgba(0, 0, 0, 0.9)',
            transition: 'background 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Top Row: Hub Selector Capsule + Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Center/Left: Floating Hub Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDesktopGroupPicker(!showDesktopGroupPicker)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.75)' : '#18181b',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.18)',
                  color: isLight ? '#1f2937' : '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{activeGroup?.name || 'Orovera Hub'}</span>
                <ChevronDown size={15} strokeWidth={3} />
              </button>

              {/* Dropdown Menu */}
              {showDesktopGroupPicker && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    width: '260px',
                    backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                    border: isLight ? '1px solid #fde68a' : '1px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '20px',
                    padding: '8px',
                    zIndex: 100,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
                  }}
                >
                  <div
                    onClick={() => {
                      setActiveGroupId(null);
                      setShowDesktopGroupPicker(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
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

                  {uniqueGroups.map((g) => {
                    const isSelected = activeGroup?._id === g._id;
                    return (
                      <div
                        key={g._id}
                        onClick={() => {
                          setActiveGroupId(g._id);
                          setShowDesktopGroupPicker(false);
                        }}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '12px',
                          fontSize: '13px',
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

            {/* Right Status Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.75)' : '#18181b',
                  padding: '5px 14px 5px 8px',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: isLight ? '#fef3c7' : '#27272a',
                    color: desktopIsReceiving ? '#b45309' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {desktopIsReceiving ? (
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
                  {desktopStatusBadgeText}
                </span>
              </span>
            </div>
          </div>

          {/* Middle Row: Massive Balance & Mascot */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Balance + Subtitle + Pending Pill */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span
                  style={{
                    fontSize: 'clamp(44px, 5vw, 64px)',
                    fontWeight: 900,
                    color: isLight ? '#0f172a' : '#ffffff',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  {desktopWholeNumber}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(24px, 2.8vw, 32px)',
                    fontWeight: 900,
                    color: isLight ? '#0f172a' : '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  .{desktopDecimalNumber} {desktopCurrencySymbol}
                </span>
              </div>

              <p
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: isLight ? '#715509' : '#9ca3af',
                  margin: '8px 0 20px 0',
                }}
              >
                {desktopSubtitleText}
              </p>

              {/* Floating Pending Pill Button */}
              <div
                onClick={() => navigate('/settlements')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.72)' : '#18181b',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '9999px',
                  padding: '9px 18px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '22px',
                    height: '22px',
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
                  {desktopPendingCount}
                </span>
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 800,
                    color: isLight ? '#1e293b' : '#ffffff',
                  }}
                >
                  {desktopPendingCount > 0 ? `${desktopPendingCount} Pending transactions` : 'All debts settled'}
                </span>
                <ChevronRight size={16} color={isLight ? '#1e293b' : '#ffffff'} strokeWidth={3} />
              </div>
            </div>

            {/* Mascot Container */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <OroveraMascot size={135} />
            </div>
          </div>

          {/* 4 Circular Action Buttons Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: isLight ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid rgba(255, 255, 255, 0.12)',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Button 1: Send */}
            <div
              onClick={() => navigate('/settlements')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isLight ? '#000000' : '#18181b',
                  border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <ArrowUpRight size={20} strokeWidth={2.8} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                Send
              </span>
            </div>

            {/* Button 2: Get */}
            <div
              onClick={onOpenAddExpense}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isLight ? '#000000' : '#18181b',
                  border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <ArrowDownLeft size={20} strokeWidth={2.8} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                Get
              </span>
            </div>

            {/* Button 3: Collect */}
            <div
              onClick={onOpenCreateGroup}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isLight ? '#000000' : '#18181b',
                  border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <PiggyBank size={20} strokeWidth={2.4} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                Collect
              </span>
            </div>

            {/* Button 4: Stats */}
            <div
              onClick={() => navigate('/activity')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: isLight ? '#000000' : '#18181b',
                  border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.15s ease',
                }}
              >
                <TrendingUp size={20} strokeWidth={2.8} />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                Stats
              </span>
            </div>
          </div>
        </div>

        {/* ================= 2. DESKTOP 2-COLUMN GRID ================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)',
            gap: '24px',
            marginBottom: '26px',
          }}
        >
          {/* LEFT: REAL TRANSACTIONS FEED CARD */}
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '26px',
              padding: '28px',
              boxShadow: isLight
                ? '0 10px 30px -5px rgba(0, 0, 0, 0.05)'
                : '0 20px 50px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* Header: Transactions | View All */}
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
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Search size={15} strokeWidth={2.8} />
                <span>View All ({desktopFilteredExpenses.length})</span>
              </button>
            </div>

            {/* Date Header */}
            <p
              style={{
                fontSize: '13px',
                fontWeight: 800,
                color: isLight ? '#94a3b8' : '#71717a',
                margin: '0 0 20px 0',
              }}
            >
              {formatDate(new Date())}
            </p>

            {/* Transactions Feed Items */}
            {desktopRecentTransactions.length === 0 ? (
              <div
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: isLight ? '#f8fafc' : '#141417',
                  borderRadius: '20px',
                  border: isLight ? '1px dashed #e2e8f0' : '1px dashed rgba(255,255,255,0.12)',
                }}
              >
                <Clock size={36} style={{ color: isLight ? '#cbd5e1' : '#52525b', margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '6px' }}>
                  No expenses recorded in {activeGroup?.name || 'vault'} yet
                </h4>
                <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#a1a1aa', margin: 0 }}>
                  Click "Get" above to record your first shared expense.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {desktopRecentTransactions.map((exp, idx) => {
                  const isPayer =
                    (exp.payer?._id || exp.payer || exp.payerId)?.toString() === (user?._id || user?.id)?.toString();
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
                        padding: '14px 16px',
                        backgroundColor: isLight ? '#f8fafc' : '#141417',
                        border: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '18px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      {/* Left Icon + Description */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : '#27272a',
                            color: isLight ? (currentAccent?.dark || '#d97706') : (currentAccent?.light || '#fbbf24'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <ArrowDownLeft size={20} strokeWidth={2.8} />
                        </div>

                        <div>
                          <h4
                            style={{
                              fontSize: '15px',
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
                                fontSize: '12px',
                                fontWeight: 800,
                                color: currentAccent?.primary || '#f59e0b',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <Sparkles size={12} /> New
                            </span>
                            <span style={{ fontSize: '12px', color: isLight ? '#94a3b8' : '#71717a' }}>•</span>
                            <span style={{ fontSize: '12px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 700 }}>
                              {payerDisplayName} • {formatRelativeTime(exp.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Amount in Bold Accent */}
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontSize: '17px',
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

          {/* RIGHT: INFLOW & OUTFLOW COMMITMENTS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Card 1: INFLOW (Real Creditor Balance) */}
            <div
              style={{
                backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '22px 24px',
                boxShadow: isLight
                  ? '0 8px 24px -4px rgba(0, 0, 0, 0.05)'
                  : '0 12px 36px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.07em', color: isLight ? '#64748b' : 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                  INFLOW RECEIVABLES
                </span>
                <span
                  style={{
                    backgroundColor: incomingTransfers.length > 0 ? (isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.2)') : (isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)'),
                    color: incomingTransfers.length > 0 ? '#b45309' : (isLight ? '#94a3b8' : 'rgba(255, 255, 255, 0.5)'),
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  {incomingTransfers.length} Pending
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>
                    You Are Owed
                  </span>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    +{formatPaise(aggregateOwedToYouPaise)}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setNudgeSent(true);
                    setTimeout(() => setNudgeSent(false), 2200);
                  }}
                  disabled={incomingTransfers.length === 0}
                  style={{
                    backgroundColor: nudgeSent ? (isLight ? '#ecfdf5' : '#14231b') : (isLight ? '#000000' : '#18181b'),
                    border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '9px 18px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: incomingTransfers.length === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: incomingTransfers.length === 0 ? 0.5 : 1,
                  }}
                >
                  {nudgeSent ? <Check size={14} /> : <Bell size={14} />}
                  <span>{nudgeSent ? 'Nudge Sent!' : 'Nudge All'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: OUTFLOW (Real Debtor Balance) */}
            <div
              style={{
                backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '22px 24px',
                boxShadow: isLight
                  ? '0 8px 24px -4px rgba(0, 0, 0, 0.05)'
                  : '0 12px 36px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.07em', color: isLight ? '#64748b' : 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
                  OUTFLOW COMMITMENT
                </span>
                <span
                  style={{
                    backgroundColor: outgoingTransfers.length > 0 ? 'rgba(239, 68, 68, 0.12)' : (isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)'),
                    color: outgoingTransfers.length > 0 ? '#ef4444' : '#10b981',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  {outgoingTransfers.length > 0 ? `${outgoingTransfers.length} Action Needed` : 'All Squared Up'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.6)', fontWeight: 700 }}>
                    Your Due Share
                  </span>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                    -{formatPaise(aggregateYouOwePaise)}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/settlements')}
                  disabled={outgoingTransfers.length === 0}
                  style={{
                    backgroundColor: isLight ? '#000000' : '#18181b',
                    border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    padding: '9px 18px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: outgoingTransfers.length === 0 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: outgoingTransfers.length === 0 ? 0.5 : 1,
                  }}
                >
                  <Zap size={14} fill="#ffffff" strokeWidth={2.4} />
                  <span>Settle Up</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. LOWER GRID: ENVELOPES + LIQUID SPLIT STUDIO ================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
            gap: '24px',
          }}
        >
          {/* ===================== LEFT: REAL ACTIVE SHARED ENVELOPES ===================== */}
          <div>
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                Active Shared Envelopes
              </h3>
              <button
                onClick={() => navigate('/groups')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isLight ? '#b45309' : '#fbbf24',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span>View All ({uniqueGroups.length})</span>
                <ArrowRight size={15} strokeWidth={2.8} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {uniqueGroups.length === 0 ? (
                /* Clean Empty State */
                <div
                  style={{
                    backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '40px 24px',
                    textAlign: 'center',
                    boxShadow: isLight
                      ? '0 8px 24px -4px rgba(0, 0, 0, 0.05)'
                      : '0 12px 36px rgba(0, 0, 0, 0.7)',
                  }}
                >
                  <FolderPlus size={40} color="#f59e0b" style={{ margin: '0 auto 14px auto', opacity: 0.9 }} />
                  <h4 style={{ fontSize: '18px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 6px 0' }}>
                    No Shared Envelopes Yet
                  </h4>
                  <p style={{ fontSize: '13px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.6)', maxWidth: '360px', margin: '0 auto 20px auto' }}>
                    Create your first shared envelope to track pooled expenses, split bills, and settle balances in real-time.
                  </p>
                  <button
                    onClick={onOpenCreateGroup}
                    style={{
                      backgroundColor: isLight ? '#000000' : '#f59e0b',
                      border: 'none',
                      color: isLight ? '#ffffff' : '#000000',
                      borderRadius: '9999px',
                      padding: '12px 26px',
                      fontSize: '13.5px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.15)' : '0 0 20px rgba(245, 158, 11, 0.35)',
                    }}
                  >
                    + Create First Envelope
                  </button>
                </div>
              ) : (
                /* Real Database Envelopes */
                uniqueGroups.slice(0, 3).map((grp) => {
                  const grpBal = allBalances[grp._id];
                  const totalSpend = grpBal?.totalGroupSpendPaise || 0;
                  const myBal = grpBal?.memberBalances?.find((m) => m.userId?.toString() === user?._id?.toString());
                  const netPaise = myBal?.netBalancePaise || 0;

                  return (
                    <div
                      key={grp._id}
                      onClick={() => {
                        setActiveGroupId(grp._id);
                        navigate(`/groups/${grp._id}`);
                      }}
                      style={{
                        backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                        border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '22px',
                        padding: '20px 22px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isLight
                          ? '0 4px 16px -2px rgba(0, 0, 0, 0.05)'
                          : '0 10px 30px rgba(0, 0, 0, 0.6)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '14px',
                              backgroundColor: isLight ? '#fef3c7' : '#18181b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isLight ? '#b45309' : '#fbbf24',
                              flexShrink: 0,
                            }}
                          >
                            <Users size={20} strokeWidth={2.4} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 900,
                                  textTransform: 'uppercase',
                                  color: isLight ? '#b45309' : '#fbbf24',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                {(grp.category || 'SHARED').toUpperCase()}
                              </span>
                              {grp.isCompleted && (
                                <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', backgroundColor: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)', color: isLight ? '#64748b' : 'rgba(255,255,255,0.7)' }}>
                                  COMPLETED
                                </span>
                              )}
                            </div>
                            <h4 style={{ fontSize: '16px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                              {grp.name}
                            </h4>
                            <p style={{ fontSize: '12px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.55)', margin: '2px 0 0 0', fontWeight: 700 }}>
                              {grp.members?.length || 1} {grp.members?.length === 1 ? 'member' : 'members'} · {grp.description || 'Active shared ledger'}
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '18px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>
                            {formatPaise(totalSpend)}
                          </div>
                          <div style={{ fontSize: '11px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.5)', marginTop: '2px', fontWeight: 700 }}>
                            Total Spend
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {netPaise > 0 ? (
                            <span style={{ color: '#10b981', fontWeight: 800 }}>
                              +{formatPaise(netPaise)} (You are owed)
                            </span>
                          ) : netPaise < 0 ? (
                            <span style={{ color: '#ef4444', fontWeight: 800 }}>
                              -{formatPaise(Math.abs(netPaise))} (You owe)
                            </span>
                          ) : (
                            <span style={{ color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.65)', fontWeight: 800 }}>
                              Settled Up
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '12px', color: isLight ? '#b45309' : '#fbbf24', fontWeight: 800 }}>
                          Open Envelope →
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ===================== RIGHT: LIQUID SPLIT STUDIO ===================== */}
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '26px',
              padding: '28px',
              boxShadow: isLight
                ? '0 10px 30px -5px rgba(0, 0, 0, 0.06)'
                : '0 20px 50px rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Studio Header + Currency Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentAccent?.primary || '#f59e0b', boxShadow: `0 0 10px ${currentAccent?.primary || '#f59e0b'}` }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                    Liquid Split Studio
                  </h3>
                </div>

                {/* Currency Selector Pills */}
                <div style={{ display: 'flex', backgroundColor: isLight ? '#f1f5f9' : '#18181b', padding: '3px', borderRadius: '9999px', border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.08)' }}>
                  {['INR', 'USD', 'EUR'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      style={{
                        backgroundColor: currency === c ? (isLight ? '#000000' : (currentAccent?.primary || '#f59e0b')) : 'transparent',
                        color: currency === c ? (isLight ? '#ffffff' : (accent === 'amber' ? '#000000' : '#ffffff')) : (isLight ? '#64748b' : 'rgba(255,255,255,0.6)'),
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Bill Input & Quick Adjusters */}
              <div
                style={{
                  backgroundColor: isLight ? '#f8fafc' : '#141417',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  marginBottom: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '10.5px', fontWeight: 900, color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.55)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    TOTAL BILL AMOUNT
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff' }}>{currencySymbol}</span>
                    <input
                      type="number"
                      value={totalBill}
                      onChange={(e) => setTotalBill(Math.max(1, Number(e.target.value) || 0))}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '28px',
                        fontWeight: 900,
                        color: isLight ? '#0f172a' : '#ffffff',
                        outline: 'none',
                        width: '140px',
                      }}
                    />
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleEqualize}
                    style={{
                      backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : (currentAccent?.subtle || 'rgba(245, 158, 11, 0.15)'),
                      border: isLight ? `1px solid ${currentAccent?.light || '#fde68a'}` : `1px solid ${currentAccent?.primary || '#f59e0b'}55`,
                      color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'),
                      borderRadius: '9999px',
                      padding: '7px 16px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    Equalize Split
                  </button>
                  <button
                    onClick={handleAddTip}
                    style={{
                      backgroundColor: isLight ? '#f1f5f9' : '#18181b',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.85)',
                      borderRadius: '9999px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    +18% Tip
                  </button>
                </div>
              </div>

              {/* Real Participants Allocation Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allocations.map((alloc) => {
                  const memberShare = ((totalBill * alloc.percent) / 100).toFixed(2);
                  return (
                    <div key={alloc.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : '#18181b',
                              color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'),
                              fontSize: '11px',
                              fontWeight: 900,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: isLight ? `1px solid ${currentAccent?.light || '#fde68a'}` : `1px solid ${currentAccent?.primary || '#f59e0b'}55`,
                            }}
                          >
                            {alloc.initial}
                          </div>
                          <span style={{ fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>{alloc.name}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.55)', fontWeight: 800 }}>
                            {alloc.percent}%
                          </span>
                          <span style={{ fontSize: '13.5px', fontWeight: 900, color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24') }}>
                            {currencySymbol}{memberShare}
                          </span>
                        </div>
                      </div>

                      {/* Range Slider with Glowing Accent Track */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={alloc.percent}
                        onChange={(e) => handleSliderChange(alloc.id, e.target.value)}
                        style={{
                          width: '100%',
                          accentColor: currentAccent?.primary || '#f59e0b',
                          height: '5px',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Live Total + Dispatch Split Button */}
            <div style={{ marginTop: '28px', paddingTop: '16px', borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px', fontSize: '12.5px', fontWeight: 800, color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24') }}>
                <Lock size={13} strokeWidth={2.8} />
                <span>
                  Live Allocation Total: {totalAllocatedPercent}% ({currencySymbol}{totalBill}.00)
                </span>
              </div>

              <button
                onClick={() => onOpenAddExpense()}
                style={{
                  width: '100%',
                  backgroundColor: isLight ? '#000000' : (currentAccent?.primary || '#f59e0b'),
                  border: 'none',
                  color: isLight ? '#ffffff' : (accent === 'amber' ? '#000000' : '#ffffff'),
                  borderRadius: '9999px',
                  padding: '16px',
                  fontSize: '15px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: isLight ? '0 4px 20px rgba(0, 0, 0, 0.2)' : `0 0 30px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Record Split Request</span>
                <Zap size={18} fill={isLight ? '#ffffff' : '#000000'} strokeWidth={2.5} />
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.45)', margin: '10px 0 0 0', fontWeight: 700 }}>
                Live Database Synchronized · Instant Zero-Friction Settlement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Ping Modal */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: isLight ? 'rgba(15, 23, 42, 0.5)' : 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isLight ? '#ffffff' : '#0a100d',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '26px',
              padding: '32px',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: isLight ? '0 20px 40px -15px rgba(0,0,0,0.15)' : '0 24px 70px rgba(0, 0, 0, 0.9)',
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '8px' }}>
              QR Ping Instant Settle
            </h3>
            <p style={{ fontSize: '13px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.65)', marginBottom: '20px' }}>
              Scan with any UPI app to settle directly into the account.
            </p>

            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '18px',
                display: 'inline-block',
                marginBottom: '20px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0',
              }}
            >
              <QrCode size={180} color="#000000" />
            </div>

            <p style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', margin: '0 0 20px 0' }}>
              VPA: {user?.upiId || `${user?.name?.toLowerCase().replace(/\s+/g, '') || 'vault'}@okhdfcbank`}
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              style={{
                width: '100%',
                backgroundColor: isLight ? '#f1f5f9' : '#152019',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isLight ? '#0f172a' : '#ffffff',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
