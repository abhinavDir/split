import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MemberAvatar } from '../components/common/MemberAvatar';
import { formatPaise, formatDate } from '../utils/formatters';
import {
  Users,
  FolderPlus,
  Search,
  ArrowRight,
  Plane,
  Home,
  Heart,
  Briefcase,
  Tag,
  Sparkles,
  Layers,
  TrendingUp,
  CheckCircle2,
  X,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORY_CONFIG = {
  Trip: { icon: Plane, label: 'Trips', emoji: '✈️', color: '#3b82f6', bgLight: '#eff6ff', bgDark: 'rgba(59, 130, 246, 0.15)' },
  Home: { icon: Home, label: 'House', emoji: '🏠', color: '#10b981', bgLight: '#ecfdf5', bgDark: 'rgba(16, 185, 129, 0.15)' },
  Couple: { icon: Heart, label: 'Couple', emoji: '❤️', color: '#ec4899', bgLight: '#fdf2f8', bgDark: 'rgba(236, 72, 153, 0.15)' },
  Project: { icon: Briefcase, label: 'Project', emoji: '💼', color: '#8b5cf6', bgLight: '#f5f3ff', bgDark: 'rgba(139, 92, 246, 0.15)' },
  Other: { icon: Tag, label: 'Other', emoji: '🏷️', color: '#f59e0b', bgLight: '#fef3c7', bgDark: 'rgba(245, 158, 11, 0.15)' },
};

export function GroupsPage() {
  const { groups, setActiveGroupId, allBalances } = useExpenseGroup();
  const { user } = useAuth();
  const { theme, currentAccent, accent } = useTheme();
  const isLight = theme === 'light';
  const { onOpenCreateGroup, onOpenAddExpense } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'completed'
  const navigate = useNavigate();

  // Deduplicate groups
  const uniqueGroups = useMemo(() => {
    const map = new Map();
    (groups || []).forEach((g) => {
      if (g?._id && !map.has(g._id)) {
        map.set(g._id, g);
      }
    });
    return Array.from(map.values());
  }, [groups]);

  // Dynamic counts for category filter tabs
  const categoryCounts = useMemo(() => {
    const counts = { ALL: uniqueGroups.length };
    uniqueGroups.forEach((g) => {
      const cat = g.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [uniqueGroups]);

  // Aggregate metrics across all envelopes
  const { totalSpendPaise, totalNetPaise, activeCount, completedCount } = useMemo(() => {
    let spend = 0;
    let net = 0;
    let active = 0;
    let completed = 0;

    uniqueGroups.forEach((grp) => {
      if (grp.isCompleted) {
        completed += 1;
      } else {
        active += 1;
      }
      const grpBalances = allBalances[grp._id];
      if (grpBalances?.totalGroupSpendPaise) {
        spend += grpBalances.totalGroupSpendPaise;
      }
      const userBal = grpBalances?.memberBalances?.find(
        (m) => (m.userId?._id || m.userId)?.toString() === user?._id?.toString()
      );
      if (userBal?.netBalancePaise) {
        net += userBal.netBalancePaise;
      }
    });

    return { totalSpendPaise: spend, totalNetPaise: net, activeCount: active, completedCount: completed };
  }, [uniqueGroups, allBalances, user]);

  // Filter groups
  const filteredGroups = useMemo(() => {
    return uniqueGroups.filter((g) => {
      const matchesSearch =
        g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'completed' && g.isCompleted) ||
        (filterStatus === 'active' && !g.isCompleted);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [uniqueGroups, searchTerm, selectedCategory, filterStatus]);

  // Split whole and decimal for spend banner
  const spendWhole = Math.floor(Math.abs(totalSpendPaise) / 100).toLocaleString('en-IN');
  const spendDec = (Math.abs(totalSpendPaise) % 100).toString().padStart(2, '0');

  return (
    <div
      style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '0 0 80px 0',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: isLight ? '#0f172a' : '#ffffff',
      }}
    >
      {/* =========================================================================
          1. APEX HERO BANNER (Fluid, Vibrant & Thematic)
          ========================================================================= */}
      <div
        style={{
          background: isLight
            ? (currentAccent?.gradient || 'linear-gradient(135deg, #ffe082 0%, #ffd54f 35%, #ffca28 75%, #ffbe2b 100%)')
            : (currentAccent?.heroGradientDark || 'radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.14) 0%, transparent 60%), #0c0f14'),
          border: isLight ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '28px',
          padding: '32px 36px',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '26px',
          boxShadow: isLight
            ? `0 12px 36px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.18)'}`
            : '0 20px 50px rgba(0, 0, 0, 0.8)',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Subtle Decorative Wave Contours in Background */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: isLight ? 0.35 : 0.14,
          }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 800 300"
        >
          <path d="M-40 80 C 160 140, 320 20, 540 100 C 680 160, 780 60, 840 110" stroke={isLight ? '#ffffff' : currentAccent?.primary || '#f59e0b'} strokeWidth="1.6" fill="none" />
          <path d="M-40 140 C 180 200, 340 70, 560 160 C 700 220, 800 120, 840 170" stroke={isLight ? '#ffffff' : '#ffffff'} strokeWidth="1.2" strokeDasharray="6 6" fill="none" opacity="0.6" />
          <path d="M-40 200 C 200 270, 380 120, 600 220 C 720 270, 810 180, 840 230" stroke={isLight ? '#ffffff' : currentAccent?.primary || '#f59e0b'} strokeWidth="2" fill="none" />
        </svg>

        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Top Pill Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : '#181b20',
                  color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'),
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: currentAccent?.primary || '#f59e0b', boxShadow: `0 0 8px ${currentAccent?.primary || '#f59e0b'}` }} />
                Syndicate Ledgers & Envelopes
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: isLight ? '#715509' : '#9ca3af',
                }}
              >
                {uniqueGroups.length} Total Envelopes ({activeCount} Active · {completedCount} Settled)
              </span>
            </div>

            {/* Top Right Action Button */}
            <button
              onClick={onOpenCreateGroup}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '9999px',
                backgroundColor: isLight ? '#000000' : (currentAccent?.primary || '#f59e0b'),
                color: isLight ? '#ffffff' : (accent === 'amber' ? '#000000' : '#ffffff'),
                fontSize: '13px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.18)' : `0 4px 18px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <FolderPlus size={16} strokeWidth={3} />
              <span>+ Create Envelope</span>
            </button>
          </div>

          {/* Middle Main Row: Big Aggregate Numbers + Net Standing */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
            }}
          >
            {/* Total Spend */}
            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: isLight ? '#715509' : '#9ca3af',
                }}
              >
                Cumulative Pool Spend
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '2px',
                  marginTop: '4px',
                }}
              >
                <span
                  style={{
                    fontSize: 'clamp(38px, 6vw, 56px)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    color: isLight ? '#0f172a' : '#ffffff',
                  }}
                >
                  {spendWhole}
                </span>
                <span
                  style={{
                    fontSize: 'clamp(20px, 3.2vw, 28px)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: isLight ? '#0f172a' : '#ffffff',
                  }}
                >
                  .{spendDec} ₹
                </span>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 800, color: isLight ? '#715509' : '#9ca3af', margin: '4px 0 0 0' }}>
                Shared across all collective trip, house, and project vaults
              </p>
            </div>

            {/* Net Standing Pill Card */}
            <div
              style={{
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.75)' : '#181b20',
                backdropFilter: 'blur(12px)',
                border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '20px',
                padding: '16px 22px',
                minWidth: '220px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: isLight ? '#64748b' : '#94a3b8' }}>
                  Your Overall Standing
                </span>
                <Sparkles size={14} color={currentAccent?.primary || '#f59e0b'} />
              </div>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: totalNetPaise > 0 ? '#10b981' : totalNetPaise < 0 ? '#ef4444' : (isLight ? '#0f172a' : '#ffffff'),
                  lineHeight: 1.1,
                  marginTop: '2px',
                }}
              >
                {totalNetPaise === 0 ? 'Settled Up' : formatPaise(totalNetPaise, { showSign: true })}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: totalNetPaise > 0 ? '#10b981' : totalNetPaise < 0 ? '#ef4444' : (isLight ? '#64748b' : '#94a3b8'),
                }}
              >
                {totalNetPaise > 0 ? '✓ You are owed funds' : totalNetPaise < 0 ? '⚠️ You owe settlements' : '✓ All accounts clear'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. FILTER & SEARCH CONTROL BAR
          ========================================================================= */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Search envelopes by title or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: isLight ? '#ffffff' : '#0d1117',
              border: isLight ? '1.5px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '9999px',
              padding: '11px 16px 11px 40px',
              color: isLight ? '#0f172a' : '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isLight ? '#94a3b8' : '#64748b',
            }}
          />
          {searchTerm && (
            <X
              size={15}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: isLight ? '#94a3b8' : '#64748b',
              }}
              onClick={() => setSearchTerm('')}
            />
          )}
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['ALL', 'Trip', 'Home', 'Couple', 'Project', 'Other'].map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;
            const emoji = cat === 'ALL' ? '✨' : (CATEGORY_CONFIG[cat]?.emoji || '🏷️');
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  border: isActive
                    ? 'none'
                    : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)'),
                  backgroundColor: isActive
                    ? (currentAccent?.primary || '#f59e0b')
                    : (isLight ? '#ffffff' : '#0d1117'),
                  color: isActive
                    ? (accent === 'amber' ? '#000000' : '#ffffff')
                    : (isLight ? '#64748b' : '#94a3b8'),
                  boxShadow: isActive ? `0 2px 10px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.3)'}` : 'none',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{emoji}</span>
                <span>{cat === 'ALL' ? 'All' : cat}</span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    backgroundColor: isActive
                      ? (accent === 'amber' ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.25)')
                      : (isLight ? '#f1f5f9' : '#1e242c'),
                    color: isActive ? undefined : (isLight ? '#475569' : '#94a3b8'),
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          3. ENVELOPES SHOWCASE GRID
          ========================================================================= */}
      {uniqueGroups.length === 0 ? (
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0d1117',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '60px 24px',
            textAlign: 'center',
            boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : '#181e26',
              color: currentAccent?.primary || '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Users size={30} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 6px 0' }}>
            No Shared Envelopes Yet
          </h2>
          <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#94a3b8', maxWidth: '420px', margin: '0 auto 24px auto', fontWeight: 700 }}>
            Create your first envelope to start logging shared group expenses, travel budgets, or flat splits.
          </p>
          <button
            onClick={onOpenCreateGroup}
            style={{
              backgroundColor: currentAccent?.primary || '#f59e0b',
              color: accent === 'amber' ? '#000000' : '#ffffff',
              fontWeight: 900,
              fontSize: '14px',
              padding: '12px 28px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: `0 4px 16px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
            }}
          >
            + Create Your First Envelope
          </button>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0d1117',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '48px 20px',
            textAlign: 'center',
            color: isLight ? '#64748b' : '#94a3b8',
            fontWeight: 800,
          }}
        >
          <p style={{ fontSize: '15px', margin: 0 }}>No envelopes match "{searchTerm}".</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
            }}
            style={{
              marginTop: '12px',
              background: 'none',
              border: 'none',
              color: currentAccent?.primary || '#f59e0b',
              fontWeight: 900,
              fontSize: '13px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* The Redesigned Modern Envelopes Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px',
          }}
        >
          {filteredGroups.map((grp) => {
            const cat = CATEGORY_CONFIG[grp.category] || CATEGORY_CONFIG.Other;
            const Icon = cat.icon;
            const grpBalances = allBalances[grp._id];
            const userBal = grpBalances?.memberBalances?.find(
              (m) => (m.userId?._id || m.userId)?.toString() === user?._id?.toString()
            );
            const net = userBal?.netBalancePaise || 0;
            const spend = grpBalances?.totalGroupSpendPaise || 0;
            const isDone = grp.isCompleted;

            return (
              <div
                key={grp._id}
                onClick={() => {
                  setActiveGroupId(grp._id);
                  navigate(`/groups/${grp._id}`);
                }}
                style={{
                  backgroundColor: isLight ? '#ffffff' : '#0d1117',
                  border: isLight ? '1.5px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '22px',
                  padding: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isLight ? '0 2px 10px rgba(0,0,0,0.03)' : '0 6px 24px rgba(0,0,0,0.4)',
                  transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = currentAccent?.primary || '#f59e0b';
                  e.currentTarget.style.boxShadow = isLight
                    ? '0 8px 24px rgba(0,0,0,0.08)'
                    : '0 12px 32px rgba(0,0,0,0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = isLight
                    ? '0 2px 10px rgba(0,0,0,0.03)'
                    : '0 6px 24px rgba(0,0,0,0.4)';
                }}
              >
                <div>
                  {/* Top Row: Icon + Category Badge + Arrow launcher */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '13px',
                          backgroundColor: isLight ? cat.bgLight : cat.bgDark,
                          color: cat.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} strokeWidth={2.4} />
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            color: isLight ? cat.color : '#94a3b8',
                          }}
                        >
                          {grp.category || 'Shared Pool'}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                          {isDone ? (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 900,
                                color: '#10b981',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <CheckCircle2 size={11} strokeWidth={3} /> Settled Clean
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                color: currentAccent?.primary || '#f59e0b',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: currentAccent?.primary || '#f59e0b' }} /> Live Pool
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isLight ? '#f8fafc' : '#14181f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: currentAccent?.primary || '#f59e0b',
                      }}
                    >
                      <ArrowRight size={15} strokeWidth={2.8} />
                    </div>
                  </div>

                  {/* Group Name */}
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 900,
                      color: isLight ? '#0f172a' : '#ffffff',
                      margin: '0 0 6px 0',
                      letterSpacing: '-0.02em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {grp.name}
                  </h3>

                  {/* Description snippet */}
                  {grp.description && (
                    <p
                      style={{
                        fontSize: '12.5px',
                        color: isLight ? '#64748b' : '#94a3b8',
                        margin: '0 0 16px 0',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {grp.description}
                    </p>
                  )}

                  {/* Split Cockpit Metric Strip */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      padding: '12px 14px',
                      borderRadius: '14px',
                      backgroundColor: isLight ? '#f8fafc' : '#13171e',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: isLight ? '#64748b' : '#71717a', letterSpacing: '0.04em' }}>
                        Group Spend
                      </span>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginTop: '2px' }}>
                        {formatPaise(spend)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: isLight ? '#64748b' : '#71717a', letterSpacing: '0.04em' }}>
                        Your Share
                      </span>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 900,
                          marginTop: '2px',
                          color: isDone
                            ? '#10b981'
                            : net > 0
                            ? '#10b981'
                            : net < 0
                            ? '#ef4444'
                            : (isLight ? '#64748b' : '#94a3b8'),
                        }}
                      >
                        {isDone ? '0.00 ₹ (Settled)' : net === 0 ? 'Settled Up' : formatPaise(net, { showSign: true })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer: Overlapping Member Avatars + Created Date */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.06)',
                    paddingTop: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', marginRight: '-6px' }}>
                      {(grp.members || []).slice(0, 4).map((m, idx) => (
                        <div key={m.userId?._id || m.userId || idx} style={{ marginLeft: idx > 0 ? '-6px' : 0 }}>
                          <MemberAvatar name={m.name || m.userId?.name} size="xs" showBorder />
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 700 }}>
                      {grp.members?.length || 0} {grp.members?.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: isLight ? '#94a3b8' : '#64748b', fontWeight: 700 }}>
                    {formatDate(grp.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
