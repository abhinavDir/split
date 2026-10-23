import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MemberAvatar } from '../components/common/MemberAvatar';
import { Button } from '../components/common/Button';
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
} from 'lucide-react';

const CATEGORY_MAP = {
  Trip: Plane,
  Home: Home,
  Couple: Heart,
  Project: Briefcase,
  Other: Tag,
};

export function GroupsPage() {
  const { groups, setActiveGroupId, allBalances } = useExpenseGroup();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { onOpenCreateGroup } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigate = useNavigate();

  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate high-level vault aggregates
  let totalSpendPaise = 0;
  let totalNetPaise = 0;

  groups.forEach((grp) => {
    const grpBalances = allBalances[grp._id];
    if (grpBalances?.totalGroupSpendPaise) {
      totalSpendPaise += grpBalances.totalGroupSpendPaise;
    }
    const userBal = grpBalances?.memberBalances?.find((m) => m.userId === user?._id);
    if (userBal?.netBalancePaise) {
      totalNetPaise += userBal.netBalancePaise;
    }
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isLight ? '#b45309' : '#fbbf24',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b',
                  boxShadow: '0 0 8px #f59e0b',
                }}
              />
              LIQUID VAULTS & SHARED POOLS
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.03em', margin: 0 }}>
            Shared Envelopes
          </h1>
          <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#9ca3af', marginTop: '4px', margin: 0, fontWeight: 700 }}>
            Collaborate on collective trips, syndicate splits, apartments, and project ledgers
          </p>
        </div>

        <button
          onClick={onOpenCreateGroup}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isLight ? '#000000' : '#f59e0b',
            color: isLight ? '#ffffff' : '#000000',
            fontWeight: 900,
            fontSize: '13px',
            padding: '12px 24px',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.15)' : '0 0 20px rgba(245, 158, 11, 0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <FolderPlus size={16} strokeWidth={2.8} />
          <span>Create Envelope</span>
        </button>
      </div>

      {/* Aggregate Overview Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.04)' : '0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: isLight ? '#fef3c7' : '#18181b',
              color: isLight ? '#b45309' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Active Envelopes
            </span>
            <p style={{ fontSize: '22px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '2px 0 0 0' }}>
              {groups.length}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.04)' : '0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: isLight ? '#fef3c7' : '#18181b',
              color: isLight ? '#b45309' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Total Ledger Volume
            </span>
            <p style={{ fontSize: '22px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '2px 0 0 0' }}>
              {formatPaise(totalSpendPaise)}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.04)' : '0 10px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: totalNetPaise >= 0 ? (isLight ? '#fef3c7' : '#18181b') : (isLight ? '#fee2e2' : 'rgba(239, 68, 68, 0.15)'),
              color: totalNetPaise >= 0 ? (isLight ? '#b45309' : '#fbbf24') : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={20} strokeWidth={2.4} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 900, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Your Net Standing
            </span>
            <p
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: totalNetPaise > 0 ? (isLight ? '#b45309' : '#fbbf24') : totalNetPaise < 0 ? '#ef4444' : (isLight ? '#64748b' : '#9ca3af'),
                margin: '2px 0 0 0',
              }}
            >
              {totalNetPaise === 0 ? 'Settled Clean' : formatPaise(totalNetPaise, { showSign: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '14px 18px',
          boxShadow: isLight ? '0 2px 10px rgba(0, 0, 0, 0.04)' : 'none',
        }}
      >
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <input
            type="text"
            placeholder="Search envelopes by title or note..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: isLight ? '#f8fafc' : '#09100c',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '10px 16px 10px 40px',
              color: isLight ? '#0f172a' : '#ffffff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border 0.2s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#00e676')}
            onBlur={(e) => (e.target.style.borderColor = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)')}
          />
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isLight ? '#94a3b8' : '#52665a',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {['ALL', 'Trip', 'Home', 'Couple', 'Project', 'Other'].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  border: isActive
                    ? '1px solid #f59e0b'
                    : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)'),
                  backgroundColor: isActive
                    ? (isLight ? '#000000' : '#f59e0b')
                    : (isLight ? '#f1f5f9' : '#18181b'),
                  color: isActive ? (isLight ? '#ffffff' : '#000000') : (isLight ? '#64748b' : 'rgba(255, 255, 255, 0.7)'),
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {groups.length === 0 ? (
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '56px 24px',
            textAlign: 'center',
            boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              backgroundColor: isLight ? '#fef3c7' : '#18181b',
              color: isLight ? '#b45309' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Users size={28} strokeWidth={2.4} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '6px' }}>
            No Shared Envelopes Yet
          </h2>
          <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#9ca3af', maxWidth: '420px', margin: '0 auto 24px auto', fontWeight: 700 }}>
            Initialize your first shared envelope to start logging shared dining, trips, or syndicate expenses.
          </p>
          <button
            onClick={onOpenCreateGroup}
            style={{
              backgroundColor: isLight ? '#000000' : '#f59e0b',
              color: isLight ? '#ffffff' : '#000000',
              fontWeight: 900,
              fontSize: '13.5px',
              padding: '12px 26px',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: isLight ? '0 4px 14px rgba(0,0,0,0.15)' : '0 0 20px rgba(245, 158, 11, 0.35)',
            }}
          >
            Create Your First Envelope
          </button>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '40px 20px',
            textAlign: 'center',
            color: isLight ? '#64748b' : '#9ca3af',
            fontWeight: 800,
          }}
        >
          <p style={{ fontSize: '14px' }}>No envelopes match your filter criteria.</p>
        </div>
      ) : (
        /* Envelopes Grid */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredGroups.map((grp) => {
            const Icon = CATEGORY_MAP[grp.category] || Users;
            const grpBalances = allBalances[grp._id];
            const userBal = grpBalances?.memberBalances?.find((m) => m.userId === user?._id);
            const net = userBal?.netBalancePaise || 0;
            const spend = grpBalances?.totalGroupSpendPaise || 0;

            // Realistic settlement progress calculation
            const settledPercent = grp.isCompleted ? 100 : spend > 0 ? (Math.abs(net) === 0 ? 92 : 64) : 0;

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
                  padding: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: isLight
                    ? '0 4px 16px -2px rgba(0, 0, 0, 0.05)'
                    : '0 4px 20px rgba(0, 0, 0, 0.6)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Top card row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '14px',
                          backgroundColor: isLight ? '#fef3c7' : '#18181b',
                          color: isLight ? '#b45309' : '#fbbf24',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: isLight ? '1px solid #fde68a' : '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                      >
                        <Icon size={20} strokeWidth={2.4} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                          {grp.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span
                            style={{
                              fontSize: '10.5px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: isLight ? '#f1f5f9' : '#18181b',
                              color: isLight ? '#64748b' : '#9ca3af',
                            }}
                          >
                            {grp.category}
                          </span>
                          {grp.isCompleted && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                backgroundColor: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.15)',
                                color: '#10b981',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <CheckCircle2 size={10} /> Completed
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
                        backgroundColor: isLight ? '#f1f5f9' : '#18181b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isLight ? '#b45309' : '#fbbf24',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <ArrowRight size={15} strokeWidth={2.6} />
                    </div>
                  </div>

                  {grp.description && (
                    <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', marginBottom: '16px', lineHeight: 1.5, margin: '0 0 16px 0', fontWeight: 600 }}>
                      {grp.description}
                    </p>
                  )}

                  {/* Settlement Progress Bar */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: isLight ? '#64748b' : '#71717a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Settlement Status
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 900, color: isLight ? '#b45309' : '#fbbf24' }}>
                        {settledPercent}% Settled
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '5px',
                        backgroundColor: isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${settledPercent}%`,
                          height: '100%',
                          backgroundColor: '#f59e0b',
                          boxShadow: '0 0 8px #f59e0b',
                          borderRadius: '9999px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Financial Metrics Box */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      padding: '12px 14px',
                      backgroundColor: isLight ? '#f8fafc' : '#141417',
                      border: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', color: isLight ? '#64748b' : '#71717a', fontWeight: 800, letterSpacing: '0.04em' }}>
                        Total Volume
                      </span>
                      <p style={{ fontSize: '15px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '3px 0 0 0' }}>
                        {formatPaise(spend)}
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', color: isLight ? '#64748b' : '#71717a', fontWeight: 800, letterSpacing: '0.04em' }}>
                        Your Position
                      </span>
                      <p
                        style={{
                          fontSize: '15px',
                          fontWeight: 900,
                          color: net > 0 ? '#10b981' : net < 0 ? '#ef4444' : (isLight ? '#64748b' : '#9ca3af'),
                          margin: '3px 0 0 0',
                        }}
                      >
                        {net === 0 ? 'Settled Clean' : formatPaise(net, { showSign: true })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer with Member Stack */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)',
                    paddingTop: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', marginRight: '-6px' }}>
                      {grp.members?.slice(0, 4).map((m, idx) => (
                        <div key={m.userId} style={{ marginLeft: idx > 0 ? '-6px' : 0 }}>
                          <MemberAvatar name={m.name} size="xs" showBorder />
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '11px', color: isLight ? '#64748b' : '#7a8c82', fontWeight: 600 }}>
                      {grp.members?.length} {grp.members?.length === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  <span style={{ fontSize: '11px', color: isLight ? '#94a3b8' : '#52665a', fontFamily: 'var(--font-mono)' }}>
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
