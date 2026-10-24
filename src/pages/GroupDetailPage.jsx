import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { Modal } from '../components/common/Modal';
import { MemberAvatar } from '../components/common/MemberAvatar';
import { InviteMemberModal } from '../components/groups/InviteMemberModal';
import { SettleDebtModal } from '../components/settlements/SettleDebtModal';
import { ExpenseDetailModal } from '../components/expenses/ExpenseDetailModal';
import { AddExpenseModal } from '../components/expenses/AddExpenseModal';
import { formatPaise, formatRelativeTime, formatDate } from '../utils/formatters';
import {
  Users,
  PlusCircle,
  UserPlus,
  Scale,
  Receipt,
  Utensils,
  Plane,
  Home,
  Film,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Lock,
  Sparkles,
  QrCode,
  CheckCircle2,
  Unlock,
  Radio,
  Layers,
  Smartphone,
} from 'lucide-react';
import { groupService } from '../services/group.service';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Plane,
  Stay: Home,
  Entertainment: Film,
  Groceries: ShoppingBag,
};

export function GroupDetailPage() {
  const { groupId } = useParams();
  const { groups, expenses, balances, loading, activeGroupId, setActiveGroupId, fetchGroupData, refreshGroups } = useExpenseGroup();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const { joinGroupRoom, leaveGroupRoom } = useSocket();

  const [activeTab, setActiveTab] = useState('EXPENSES'); // EXPENSES, BALANCES, MEMBERS
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedTransferForPayment, setSelectedTransferForPayment] = useState(null);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [directGroup, setDirectGroup] = useState(null);
  const [directLoading, setDirectLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);

  // Directly fetch group if not already loaded in context
  useEffect(() => {
    let isMounted = true;
    async function loadDirectGroup() {
      if (!groupId) return;
      const cached = groups.find((g) => g._id === groupId);
      if (cached) {
        setDirectGroup(cached);
        return;
      }
      setDirectLoading(true);
      try {
        const res = await groupService.getGroupById(groupId);
        if (isMounted && res?.data?.group) {
          setDirectGroup(res.data.group);
          setNotFound(false);
        }
      } catch (err) {
        if (isMounted) {
          setNotFound(true);
        }
      } finally {
        if (isMounted) setDirectLoading(false);
      }
    }
    loadDirectGroup();
    return () => {
      isMounted = false;
    };
  }, [groupId, groups]);

  const handleBroadcastBill = async () => {
    setIsBroadcasting(true);
    try {
      const res = await groupService.broadcastBill(groupId);
      const bill = res.data?.bill || res.bill;
      if (bill) {
        window.dispatchEvent(new CustomEvent('group:bill-preview', { detail: bill }));
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to generate bill preview');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleCompleteTrip = () => {
    setIsConfirmCompleteOpen(true);
  };

  const confirmCompleteTrip = async () => {
    setIsConfirmCompleteOpen(false);
    setIsTogglingStatus(true);
    try {
      const res = await groupService.completeTrip(groupId);
      if (res?.data?.group) {
        setDirectGroup(res.data.group);
      }
      await refreshGroups();
      await fetchGroupData(groupId);

      // Automatically generate and broadcast full bill so everyone sees the bill on completion
      try {
        const billRes = await groupService.broadcastBill(groupId);
        const bill = billRes.data?.bill || billRes.bill;
        if (bill) {
          window.dispatchEvent(new CustomEvent('group:bill-preview', { detail: bill }));
        }
      } catch (billErr) {
        console.error('Error generating final bill:', billErr);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to complete trip');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleReopenTrip = async () => {
    setIsTogglingStatus(true);
    try {
      const res = await groupService.reopenTrip(groupId);
      if (res?.data?.group) {
        setDirectGroup(res.data.group);
      }
      await refreshGroups();
      await fetchGroupData(groupId);
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to reopen trip');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Live status update across browser screens
  useEffect(() => {
    const handleStatusChanged = (e) => {
      if (e.detail?.groupId === groupId) {
        setDirectGroup((prev) =>
          prev ? { ...prev, isCompleted: e.detail.isCompleted, status: e.detail.status } : prev
        );
        refreshGroups();
      }
    };
    window.addEventListener('group:status-changed', handleStatusChanged);
    return () => {
      window.removeEventListener('group:status-changed', handleStatusChanged);
    };
  }, [groupId, refreshGroups]);

  // Sync route param groupId with active group context
  useEffect(() => {
    if (groupId) {
      if (activeGroupId !== groupId) {
        setActiveGroupId(groupId);
      }
      fetchGroupData(groupId);
    }
  }, [groupId, activeGroupId, setActiveGroupId, fetchGroupData]);

  // Join group socket room for live updates
  useEffect(() => {
    if (groupId) {
      joinGroupRoom(groupId);
      return () => {
        leaveGroupRoom(groupId);
      };
    }
  }, [groupId, joinGroupRoom, leaveGroupRoom]);

  const group = groups.find((g) => g._id === groupId) || directGroup;

  // Loading skeleton state
  if ((loading || directLoading) && !group) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="skeleton" style={{ height: '180px', borderRadius: '22px' }} />
        <div className="skeleton" style={{ height: '260px', borderRadius: '22px' }} />
      </div>
    );
  }

  // If group is not found or URL was tempered, cleanly redirect to dashboard
  if (!group && notFound) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!group) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div className="skeleton" style={{ height: '180px', borderRadius: '22px' }} />
      </div>
    );
  }

  // Check if current user is an Admin
  const currentMember = group.members?.find((m) => m.userId?.toString() === user?._id?.toString());
  const isAdmin = currentMember?.role === 'ADMIN' || group.createdBy?.toString() === user?._id?.toString();

  // Personal balance in this group
  const myBalance = balances?.memberBalances?.find((m) => m.userId?.toString() === user?._id?.toString());
  const netPaise = myBalance?.netBalancePaise || 0;
  const isNetPositive = netPaise > 0;
  const isNetZero = netPaise === 0;

  const groupExpenses = expenses;
  const transfers = balances?.suggestedTransfers || [];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Group Hero Header */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : '#070c09',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '22px',
          padding: '28px 30px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isLight
            ? '0 8px 30px -4px rgba(0, 0, 0, 0.06)'
            : '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Ambient backlight glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '360px',
            height: '100%',
            background: isNetPositive
              ? (isLight ? 'radial-gradient(circle at top right, rgba(0, 230, 118, 0.08) 0%, transparent 70%)' : 'radial-gradient(circle at top right, rgba(0, 230, 118, 0.12) 0%, transparent 70%)')
              : (isLight ? 'radial-gradient(circle at top right, rgba(244, 63, 94, 0.06) 0%, transparent 70%)' : 'radial-gradient(circle at top right, rgba(244, 63, 94, 0.1) 0%, transparent 70%)'),
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? '#ecfdf5' : 'rgba(0, 230, 118, 0.12)',
                  color: '#059669',
                  border: '1px solid rgba(0, 230, 118, 0.25)',
                  letterSpacing: '0.04em',
                }}
              >
                {group.category}
              </span>
              <span style={{ fontSize: '12px', color: isLight ? '#64748b' : '#6d7f75' }}>
                Created {formatDate(group.createdAt)}
              </span>
              {group.isCompleted ? (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#ecfdf5' : 'rgba(0, 230, 118, 0.15)',
                    color: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <CheckCircle2 size={12} /> Trip Finalized
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)',
                    color: '#059669',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00e676', boxShadow: '0 0 6px #00e676' }} />
                  Live Sync Active
                </span>
              )}
              {isAdmin && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)',
                    color: isLight ? '#334155' : '#e2e8f0',
                  }}
                >
                  ★ Admin
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.03em', margin: 0 }}>
              {group.name}
            </h1>
            {group.description && (
              <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#8899a6', marginTop: '6px', margin: '6px 0 0 0' }}>
                {group.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            {!group.isCompleted ? (
              <>
                <button
                  onClick={() => setIsInviteOpen(true)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#f1f5f9' : '#0a120e',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: isLight ? '#0f172a' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <UserPlus size={15} />
                  <span>Invite</span>
                </button>

                <button
                  onClick={handleBroadcastBill}
                  disabled={isBroadcasting}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#ecfdf5' : '#0a120e',
                    border: '1px solid rgba(0, 230, 118, 0.3)',
                    color: '#059669',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Receipt size={15} />
                  <span>{isBroadcasting ? 'Broadcasting...' : '⚡ Broadcast Bill'}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={handleCompleteTrip}
                    disabled={isTogglingStatus}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '9999px',
                      backgroundColor: isLight ? '#f1f5f9' : '#0a120e',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: isLight ? '#0f172a' : '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CheckCircle2 size={15} style={{ color: '#00e676' }} />
                    <span>Complete Trip</span>
                  </button>
                )}

                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '9999px',
                    backgroundColor: '#00e676',
                    border: 'none',
                    color: '#000000',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 20px rgba(0, 230, 118, 0.35)',
                  }}
                >
                  <PlusCircle size={16} strokeWidth={2.5} />
                  <span>Add Split ⚡</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleBroadcastBill}
                  disabled={isBroadcasting}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#ecfdf5' : '#0a120e',
                    border: '1.5px solid rgba(0, 230, 118, 0.4)',
                    color: isLight ? '#059669' : '#00e676',
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    boxShadow: '0 2px 12px rgba(0, 230, 118, 0.2)',
                  }}
                >
                  <Receipt size={16} strokeWidth={2.4} />
                  <span>{isBroadcasting ? 'Generating Bill...' : 'View Final Bill 🧾'}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={handleReopenTrip}
                    disabled={isTogglingStatus}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '9999px',
                      backgroundColor: isLight ? '#fffbeb' : '#0a120e',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#d97706',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Unlock size={15} />
                    <span>Reopen Trip</span>
                  </button>
                )}

                <div
                  style={{
                    padding: '10px 18px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.04)',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isLight ? '#64748b' : '#6d7f75',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Lock size={14} />
                  <span>Expenses Closed</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4 Financial Highlight Tiles */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#040705',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: '10px', color: isLight ? '#64748b' : '#52665a', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Total Envelope Volume
            </span>
            <p style={{ fontSize: '22px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
              {formatPaise(balances?.totalGroupSpendPaise || 0)}
            </p>
          </div>

          <div
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#040705',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: '10px', color: isLight ? '#64748b' : '#52665a', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Your Net Standing
            </span>
            <p
              style={{
                fontSize: '22px',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                margin: '4px 0 0 0',
                color: isNetZero ? (isLight ? '#64748b' : '#8899a6') : isNetPositive ? '#059669' : '#e11d48',
              }}
            >
              {isNetZero ? 'Settled Clean' : formatPaise(netPaise, { showSign: true })}
            </p>
          </div>

          <div
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#040705',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: '10px', color: isLight ? '#64748b' : '#52665a', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Active Allocators
            </span>
            <p style={{ fontSize: '22px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: '4px 0 0 0' }}>
              {group.members?.length || 0}
            </p>
          </div>

          <div
            style={{
              backgroundColor: isLight ? '#f8fafc' : '#040705',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '14px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: '10px', color: isLight ? '#64748b' : '#52665a', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Clearing Settlements
            </span>
            <p
              style={{
                fontSize: '22px',
                fontWeight: 900,
                color: transfers.length > 0 ? '#d97706' : '#059669',
                margin: '4px 0 0 0',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {transfers.length === 0 ? '0 (Settled)' : transfers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'EXPENSES', label: `Split Ledger (${groupExpenses.length})` },
          { id: 'BALANCES', label: `Direct Clearinghouse (${transfers.length})` },
          { id: 'MEMBERS', label: `Allocators (${group.members?.length || 0})` },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #00e676' : '2px solid transparent',
                color: isActive ? '#059669' : (isLight ? '#64748b' : '#8899a6'),
                fontWeight: isActive ? 800 : 600,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Expenses List */}
      {activeTab === 'EXPENSES' && (
        <div>
          {groupExpenses.length === 0 ? (
            <div
              style={{
                backgroundColor: isLight ? '#ffffff' : '#070c09',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '20px',
                padding: '56px 20px',
                textAlign: 'center',
                boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: isLight ? '#ecfdf5' : 'rgba(0, 230, 118, 0.1)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Receipt size={26} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: isLight ? '#0f172a' : '#ffffff' }}>
                No Expenses Logged Yet
              </h3>
              <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#8899a6', marginBottom: '22px', maxWidth: '420px', margin: '0 auto 22px auto' }}>
                {group.isCompleted
                  ? 'This envelope was closed with zero recorded splits.'
                  : 'Record your first dinner, villa booking, or shared transport split.'}
              </p>
              {!group.isCompleted && (
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  style={{
                    backgroundColor: '#00e676',
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: '13px',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(0, 230, 118, 0.35)',
                  }}
                >
                  Record First Split ⚡
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {groupExpenses.map((exp) => {
                const Icon = CATEGORY_ICONS[exp.category] || Receipt;
                const isPayer = exp.payerId?.toString() === user?._id?.toString();
                const myShare = exp.participants?.find((p) => p.userId?.toString() === user?._id?.toString())?.sharePaise || 0;

                return (
                  <div
                    key={exp._id}
                    onClick={() => setSelectedExpense(exp)}
                    style={{
                      backgroundColor: isLight ? '#ffffff' : '#070c09',
                      border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isLight ? '0 2px 8px rgba(0, 0, 0, 0.04)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 230, 118, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          backgroundColor: isLight ? '#ecfdf5' : 'rgba(0, 230, 118, 0.1)',
                          color: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(0, 230, 118, 0.2)',
                        }}
                      >
                        <Icon size={20} />
                      </div>

                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                          {exp.description}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: isLight ? '#64748b' : '#6d7f75', marginTop: '4px' }}>
                          <span>
                            Paid by <strong style={{ color: isLight ? '#0f172a' : '#e2e8f0' }}>{isPayer ? 'You' : exp.payerName}</strong>
                          </span>
                          <span>•</span>
                          <span>{formatRelativeTime(exp.createdAt)}</span>
                          <span>•</span>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)',
                              color: isLight ? '#64748b' : '#9ca3af',
                            }}
                          >
                            {exp.splitType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '16px',
                          fontWeight: 900,
                          fontFamily: 'var(--font-mono)',
                          color: isLight ? '#0f172a' : '#ffffff',
                        }}
                      >
                        {formatPaise(exp.amountPaise)}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          color: isPayer ? '#059669' : '#e11d48',
                          marginTop: '2px',
                          display: 'block',
                        }}
                      >
                        {isPayer
                          ? `You lent ${formatPaise(exp.amountPaise - myShare)}`
                          : myShare > 0
                          ? `Your share: ${formatPaise(myShare)}`
                          : 'Not involved'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Balances & Simplified Transfers */}
      {activeTab === 'BALANCES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Direct Transfers */}
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : '#070c09',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                Optimized Direct Clearinghouse
              </h3>
              <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#6d7f75', margin: '4px 0 0 0' }}>
                Algorithmic debt simplification minimizes cross-transfers to zero redundancy
              </p>
            </div>

            {transfers.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center', color: isLight ? '#64748b' : '#6d7f75' }}>
                <CheckCircle2 size={38} style={{ color: '#00e676', margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '4px' }}>
                  All Accounts Clean & Settled
                </h4>
                <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#8899a6' }}>
                  No outstanding liabilities exist within this envelope.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transfers.map((tx) => {
                  const isDebtor = tx.from.id?.toString() === user?._id?.toString();
                  const isCreditor = tx.to.id?.toString() === user?._id?.toString();

                  return (
                    <div
                      key={tx.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        backgroundColor: isLight ? '#f8fafc' : '#040705',
                        borderRadius: '14px',
                        border: isDebtor
                          ? '1px solid rgba(0, 230, 118, 0.4)'
                          : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)'),
                        flexWrap: 'wrap',
                        gap: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MemberAvatar name={tx.from.name} size="sm" />
                          <span style={{ fontSize: '14px', fontWeight: 700, color: isDebtor ? '#e11d48' : (isLight ? '#0f172a' : '#ffffff') }}>
                            {isDebtor ? 'You' : tx.from.name}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isLight ? '#94a3b8' : '#52665a' }}>
                          <ArrowRight size={14} style={{ color: '#00e676' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>owes</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MemberAvatar name={tx.to.name} size="sm" />
                          <div>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: isCreditor ? '#059669' : (isLight ? '#0f172a' : '#ffffff') }}>
                              {isCreditor ? 'You' : tx.to.name}
                            </span>
                            {tx.to?.upiId && (
                              <span style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: isLight ? '#059669' : '#00e676' }}>
                                UPI: {tx.to.upiId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: isLight ? '#0f172a' : '#ffffff' }}>
                          {formatPaise(tx.amountPaise)}
                        </span>

                        {isDebtor && (
                          <button
                            onClick={() => setSelectedTransferForPayment(tx)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '9999px',
                              backgroundColor: '#00e676',
                              border: 'none',
                              color: '#000000',
                              fontSize: '12px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 0 14px rgba(0, 230, 118, 0.3)',
                            }}
                          >
                            <QrCode size={13} strokeWidth={2.5} />
                            <span>Pay with UPI</span>
                          </button>
                        )}
                        {isCreditor && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              backgroundColor: isLight ? '#ecfdf5' : 'rgba(0, 230, 118, 0.12)',
                              color: '#059669',
                            }}
                          >
                            Awaiting receipt
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Member Balance Sheet */}
          <div
            style={{
              backgroundColor: isLight ? '#ffffff' : '#070c09',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '16px', color: isLight ? '#0f172a' : '#ffffff' }}>
              Allocators Balance Matrix
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)', color: isLight ? '#64748b' : '#52665a', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '10px 12px' }}>Allocator</th>
                    <th style={{ padding: '10px 12px' }}>Total Paid</th>
                    <th style={{ padding: '10px 12px' }}>Total Share</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right' }}>Net Standing</th>
                  </tr>
                </thead>
                <tbody>
                  {balances?.memberBalances?.map((m) => {
                    const isPositive = m.netBalancePaise > 0;
                    const isZero = m.netBalancePaise === 0;

                    return (
                      <tr key={m.userId} style={{ borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MemberAvatar name={m.name} size="xs" />
                            <span style={{ fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff' }}>
                              {m.name} {m.userId?.toString() === user?._id?.toString() && '(You)'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', fontFamily: 'var(--font-mono)', color: isLight ? '#334155' : '#e2e8f0' }}>
                          {formatPaise(m.totalPaidPaise)}
                        </td>
                        <td style={{ padding: '14px 12px', fontFamily: 'var(--font-mono)', color: isLight ? '#334155' : '#e2e8f0' }}>
                          {formatPaise(m.totalSharePaise)}
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                          <span style={{ color: isZero ? (isLight ? '#64748b' : '#6d7f75') : isPositive ? '#059669' : '#e11d48' }}>
                            {formatPaise(m.netBalancePaise, { showSign: true })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Allocators & Members */}
      {activeTab === 'MEMBERS' && (
        <div
          style={{
            backgroundColor: isLight ? '#ffffff' : '#070c09',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                Active Allocators
              </h3>
              <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#6d7f75', margin: '4px 0 0 0' }}>
                {group.members?.length} collaborators joined {group.name}
              </p>
            </div>
            {!group.isCompleted ? (
              <button
                onClick={() => setIsInviteOpen(true)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  backgroundColor: '#00e676',
                  border: 'none',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 16px rgba(0, 230, 118, 0.3)',
                }}
              >
                <UserPlus size={14} />
                <span>Invite Allocator</span>
              </button>
            ) : (
              <span
                style={{
                  backgroundColor: isLight ? '#fff1f2' : 'rgba(244, 63, 94, 0.1)',
                  color: '#e11d48',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Lock size={12} /> Member Roster Locked
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {group.members?.map((m) => {
              const isOwner = group.createdBy?.toString() === m.userId?.toString();
              return (
                <div
                  key={m.userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    backgroundColor: isLight ? '#f8fafc' : '#040705',
                    borderRadius: '14px',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <MemberAvatar name={m.name} avatarUrl={m.avatarUrl} size="md" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                          {m.name}
                        </h4>
                        {m.role === 'ADMIN' && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: isLight ? '#ecfdf5' : 'rgba(0, 230, 118, 0.15)',
                              color: '#059669',
                            }}
                          >
                            Admin
                          </span>
                        )}
                        {isOwner && (
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
                              color: isLight ? '#334155' : '#e2e8f0',
                            }}
                          >
                            Creator
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: isLight ? '#64748b' : '#6d7f75' }}>
                          {m.email}
                        </span>
                        {m.upiId ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontFamily: 'var(--font-mono)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: isLight ? '#ecfdf5' : 'rgba(0, 230, 118, 0.12)',
                              color: isLight ? '#059669' : '#00e676',
                              border: isLight ? '1px solid #d1fae5' : '1px solid rgba(0, 230, 118, 0.2)',
                            }}
                          >
                            <Smartphone size={10} />
                            {m.upiId}
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: '11px',
                              color: isLight ? '#94a3b8' : '#52665a',
                              fontStyle: 'italic',
                            }}
                          >
                            (No UPI set)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '12px', color: isLight ? '#94a3b8' : '#52665a', fontFamily: 'var(--font-mono)' }}>
                    Joined {formatDate(m.joinedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Modals */}
      {isAddExpenseOpen && (
        <AddExpenseModal
          isOpen={isAddExpenseOpen}
          onClose={() => setIsAddExpenseOpen(false)}
          onOpenCreateGroup={() => {
            setIsAddExpenseOpen(false);
            navigate('/groups');
          }}
        />
      )}

      {isInviteOpen && (
        <InviteMemberModal
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          group={group}
        />
      )}

      {selectedExpense && (
        <ExpenseDetailModal
          isOpen={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
          expense={selectedExpense}
          onDeleted={() => fetchGroupData(group._id)}
        />
      )}

      {selectedTransferForPayment && (
        <SettleDebtModal
          isOpen={!!selectedTransferForPayment}
          onClose={() => setSelectedTransferForPayment(null)}
          transfer={selectedTransferForPayment}
          onPaymentRecorded={() => fetchGroupData(group._id)}
        />
      )}

      {/* Confirmation Modal: Complete Trip & Finalize All Settlements */}
      {isConfirmCompleteOpen && (
        <Modal
          isOpen={isConfirmCompleteOpen}
          onClose={() => setIsConfirmCompleteOpen(false)}
          title="Complete Trip & Settle All Accounts ⚡"
          subtitle="Finalize this envelope and generate the master itemized ledger"
          maxWidth="480px"
        >
          <div style={{ textAlign: 'center', padding: '10px 4px 6px 4px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: 'rgba(0, 230, 118, 0.12)',
                border: '1px solid rgba(0, 230, 118, 0.3)',
                color: '#00e676',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 4px 16px rgba(0, 230, 118, 0.2)',
              }}
            >
              <CheckCircle2 size={32} strokeWidth={2.4} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Are you sure you want to complete this trip?
            </h3>

            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '22px' }}>
              All settlements and balances will be marked as finalized. Once completed, your active dashboard amount will become <strong>0.00 ₹</strong>, and everyone's complete itemized bill will be generated immediately for all members to view.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={confirmCompleteTrip}
                disabled={isTogglingStatus}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '9999px',
                  backgroundColor: '#00e676',
                  border: 'none',
                  color: '#000000',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0, 230, 118, 0.35)',
                }}
              >
                <CheckCircle2 size={18} strokeWidth={2.6} />
                <span>{isTogglingStatus ? 'Finalizing...' : 'Yes, Complete Trip & View Bill 🧾'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsConfirmCompleteOpen(false)}
                disabled={isTogglingStatus}
                style={{
                  width: '100%',
                  padding: '11px 20px',
                  borderRadius: '9999px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
