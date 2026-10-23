import React, { useState, useEffect } from 'react';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MemberAvatar } from '../components/common/MemberAvatar';
import { Modal } from '../components/common/Modal';
import { SettleDebtModal } from '../components/settlements/SettleDebtModal';
import { settlementService } from '../services/settlement.service';
import { groupService } from '../services/group.service';
import { formatPaise, formatDate } from '../utils/formatters';
import {
  Scale,
  ArrowRight,
  ShieldCheck,
  History,
  Lock,
  Smartphone,
  CheckCircle2,
  QrCode,
  Users,
  Receipt,
  Sparkles,
  Info,
  AlertCircle,
  Check,
  XCircle,
} from 'lucide-react';

export function SettlementsPage() {
  const { groups, activeGroup, balances, refreshActiveGroup, setActiveGroupId, activeGroupId } = useExpenseGroup();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [settlementHistory, setSettlementHistory] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [selectedSettlementId, setSelectedSettlementId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [actionFeedback, setActionFeedback] = useState(null);
  const [disputeTarget, setDisputeTarget] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');

  const fetchHistory = async () => {
    if (activeGroup?._id) {
      setLoadingHistory(true);
      try {
        const res = await settlementService.getSettlementHistory(activeGroup._id);
        if (res?.data?.settlements) {
          setSettlementHistory(res.data.settlements);
        } else {
          setSettlementHistory([]);
        }
      } catch (err) {
        console.error('Error fetching settlement history:', err);
      } finally {
        setLoadingHistory(false);
      }
    }
  };

  useEffect(() => {
    fetchHistory();

    const handleDataChanged = () => {
      fetchHistory();
    };
    window.addEventListener('group:data-changed', handleDataChanged);
    return () => {
      window.removeEventListener('group:data-changed', handleDataChanged);
    };
  }, [activeGroup]);

  const handleConfirmReceived = async (settlementId, transferId) => {
    const key = `${settlementId}-${transferId}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    setActionFeedback(null);
    try {
      const res = await settlementService.confirmReceived(settlementId, transferId);
      setActionFeedback({
        type: 'success',
        message: res.message || 'Payment confirmed and marked as settled!',
      });
      await fetchHistory();
      refreshActiveGroup();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to confirm receipt';
      setActionFeedback({ type: 'error', message: msg });
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!disputeTarget) return;
    const { settlementId, transferId } = disputeTarget;
    const key = `${settlementId}-${transferId}`;
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    setActionFeedback(null);
    try {
      const res = await settlementService.disputePayment(settlementId, transferId, {
        reason: disputeReason.trim() || 'Payment not reflected in bank account',
      });
      setActionFeedback({
        type: 'success',
        message: res.message || 'Payment marked as disputed. Payer has been notified.',
      });
      setDisputeTarget(null);
      setDisputeReason('');
      await fetchHistory();
      refreshActiveGroup();
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to dispute payment';
      setActionFeedback({ type: 'error', message: msg });
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const transfers = balances?.suggestedTransfers || [];

  // Filter transfers where current user is involved
  const yourPendingDebts = transfers.filter((tx) => tx.from.id?.toString() === user?._id?.toString());

  // Helper to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
      case 'verified':
        return (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCircle2 size={12} strokeWidth={2.5} />
            <span>Confirmed</span>
          </span>
        );
      case 'reported':
        return (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: isLight ? '#eff6ff' : 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Smartphone size={12} strokeWidth={2.5} />
            <span>Reported (Verify Bank)</span>
          </span>
        );
      case 'disputed':
        return (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Disputed</span>
          </span>
        );
      default:
        return (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)',
              color: isLight ? '#64748b' : '#9ca3af',
            }}
          >
            Pending
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
              ZERO-SUM DIRECT CLEARINGHOUSE
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.03em', margin: 0 }}>
            Balances & Settlements
          </h1>
          <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#9ca3af', marginTop: '4px', margin: 0, fontWeight: 700 }}>
            Algorithmic debt simplification, instant UPI settlement routing, and finalized group accounts
          </p>
        </div>

        {activeGroup && (
          <button
            onClick={async () => {
              try {
                const res = await groupService.broadcastBill(activeGroup._id);
                const bill = res.data?.bill || res.bill;
                if (bill) {
                  window.dispatchEvent(new CustomEvent('group:bill-preview', { detail: bill }));
                }
              } catch (err) {
                alert(err.response?.data?.error?.message || err.message || 'Failed to generate bill');
              }
            }}
            style={{
              padding: '11px 22px',
              borderRadius: '9999px',
              backgroundColor: isLight ? '#000000' : '#f59e0b',
              border: 'none',
              color: isLight ? '#ffffff' : '#000000',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isLight ? '0 2px 10px rgba(0,0,0,0.15)' : '0 0 20px rgba(245, 158, 11, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <Receipt size={16} strokeWidth={2.4} />
            <span>Generate Real Bill</span>
          </button>
        )}
      </div>

      {/* Group Selector Pills */}
      {groups.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            padding: '12px 16px',
            backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
          }}
        >
          {groups.map((grp) => {
            const isSelected = grp._id === activeGroupId;
            return (
              <button
                key={grp._id}
                onClick={() => setActiveGroupId(grp._id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  border: isSelected
                    ? '1px solid #f59e0b'
                    : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)'),
                  backgroundColor: isSelected
                    ? (isLight ? '#000000' : '#f59e0b')
                    : (isLight ? '#f1f5f9' : '#18181b'),
                  color: isSelected ? (isLight ? '#ffffff' : '#000000') : (isLight ? '#64748b' : 'rgba(255, 255, 255, 0.7)'),
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Users size={14} strokeWidth={2.4} />
                <span>{grp.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Prominent Action Banner for Outstanding Debts */}
      {yourPendingDebts.length > 0 && (
        <div
          style={{
            backgroundColor: isLight ? '#fff1f2' : '#141417',
            border: isLight ? '1px solid #fecdd3' : '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '22px',
            padding: '22px 26px',
            boxShadow: isLight ? '0 4px 16px rgba(244, 63, 94, 0.08)' : '0 8px 30px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  backgroundColor: isLight ? '#ffe4e6' : 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Smartphone size={22} strokeWidth={2.4} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: isLight ? '#9f1239' : '#ffffff', margin: 0 }}>
                  You have {yourPendingDebts.length} pending settlement liability
                </h3>
                <p style={{ fontSize: '13px', color: isLight ? '#e11d48' : '#9ca3af', margin: '4px 0 0 0', fontWeight: 700 }}>
                  Settle instantly via your native UPI app (GPay, PhonePe, Paytm, CRED) with zero fees.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTransfer(yourPendingDebts[0])}
              style={{
                padding: '11px 24px',
                borderRadius: '9999px',
                backgroundColor: isLight ? '#000000' : '#f59e0b',
                color: isLight ? '#ffffff' : '#000000',
                fontWeight: 900,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isLight ? '0 2px 10px rgba(0,0,0,0.15)' : '0 0 20px rgba(245, 158, 11, 0.4)',
              }}
            >
              <QrCode size={15} strokeWidth={2.8} />
              <span>1-Tap Settle via UPI</span>
            </button>
          </div>
        </div>
      )}

      {/* Suggested Simplified Transactions */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.05)' : '0 8px 32px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
            Optimized Direct Transfers ({activeGroup?.name || 'Active Envelope'})
          </h3>
          <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', margin: '4px 0 0 0', fontWeight: 700 }}>
            Greedy graph simplification algorithm eliminates circular debts into minimum cash transfers
          </p>
        </div>

        {transfers.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: isLight ? '#64748b' : '#71717a' }}>
            <ShieldCheck size={42} style={{ color: '#10b981', margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '18px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '4px' }}>
              All Balances Clean & Even
            </h4>
            <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#9ca3af', fontWeight: 700 }}>
              No outstanding obligations remain between collaborators in this envelope.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {transfers.map((tx) => {
              const isPayer = tx.from.id?.toString() === user?._id?.toString();
              const isRecipient = tx.to.id?.toString() === user?._id?.toString();

              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    backgroundColor: isLight ? '#f8fafc' : '#141417',
                    borderRadius: '18px',
                    border: isPayer
                      ? (isLight ? '1px solid #fecdd3' : '1px solid rgba(239, 68, 68, 0.35)')
                      : (isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)'),
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MemberAvatar name={tx.from.name} size="sm" />
                      <span style={{ fontSize: '14px', fontWeight: 800, color: isPayer ? '#ef4444' : (isLight ? '#0f172a' : '#ffffff') }}>
                        {isPayer ? 'You' : tx.from.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isLight ? '#94a3b8' : '#71717a' }}>
                      <ArrowRight size={14} strokeWidth={2.8} style={{ color: isLight ? '#b45309' : '#fbbf24' }} />
                      <span style={{ fontSize: '12px', fontWeight: 800 }}>pays</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MemberAvatar name={tx.to.name} size="sm" />
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: isRecipient ? '#10b981' : (isLight ? '#0f172a' : '#ffffff') }}>
                          {isRecipient ? 'You' : tx.to.name}
                        </span>
                        {tx.to?.upiId && (
                          <span style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-mono)', color: isLight ? '#059669' : '#10b981' }}>
                            UPI: {tx.to.upiId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 900, color: isLight ? '#b45309' : '#fbbf24' }}>
                      {formatPaise(tx.amountPaise)}
                    </span>

                    {isPayer && (
                      <button
                        onClick={() => setSelectedTransfer(tx)}
                        style={{
                          padding: '9px 20px',
                          borderRadius: '9999px',
                          backgroundColor: isLight ? '#000000' : '#f59e0b',
                          border: 'none',
                          color: isLight ? '#ffffff' : '#000000',
                          fontSize: '12.5px',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.15)' : '0 0 16px rgba(245, 158, 11, 0.35)',
                        }}
                      >
                        <QrCode size={13} strokeWidth={2.8} />
                        <span>Pay via UPI</span>
                      </button>
                    )}

                    {isRecipient && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          backgroundColor: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
                          color: isLight ? '#b45309' : '#fbbf24',
                        }}
                      >
                        Awaiting Inflow
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: actionFeedback.type === 'success'
              ? (isLight ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 230, 118, 0.12)')
              : (isLight ? 'rgba(225, 29, 72, 0.1)' : 'rgba(244, 63, 94, 0.15)'),
            color: actionFeedback.type === 'success'
              ? (isLight ? '#059669' : '#00e676')
              : (isLight ? '#e11d48' : '#f43f5e'),
            borderRadius: '16px',
            border: actionFeedback.type === 'success'
              ? (isLight ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(0, 230, 118, 0.3)')
              : (isLight ? '1px solid rgba(225, 29, 72, 0.25)' : '1px solid rgba(244, 63, 94, 0.3)'),
            fontSize: '13px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {actionFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{actionFeedback.message}</span>
        </div>
      )}

      {/* Peer-to-Peer Gateway-Free Disclaimer Banner */}
      <div
        style={{
          padding: '14px 20px',
          backgroundColor: isLight ? '#f0fdf4' : 'rgba(16, 185, 129, 0.08)',
          border: isLight ? '1px solid #bbf7d0' : '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '12.5px',
          color: isLight ? '#166534' : '#6ee7b7',
          lineHeight: 1.5,
        }}
      >
        <Info size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#10b981' }} />
        <div>
          <strong>Direct UPI Settlements (Zero Gateway):</strong> Split Money initiates peer-to-peer payments via native UPI apps without any middleman or third-party payment gateway. Settlement confirmation is manual: payers report their payment, and receivers verify their bank account before confirming receipt.
        </div>
      </div>

      {/* Finalized Settlement History */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.05)' : '0 8px 32px rgba(0, 0, 0, 0.7)',
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
            Settlement Audit Trail & History
          </h3>
          <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#6d7f75', margin: '4px 0 0 0' }}>
            Audited snapshots, direct UPI payment reports, manual receipt confirmations, and disputes
          </p>
        </div>

        {settlementHistory.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: isLight ? '#64748b' : '#6d7f75' }}>
            <History size={36} style={{ margin: '0 auto 10px auto', opacity: 0.4 }} />
            <p style={{ fontSize: '13px' }}>
              No finalized historical settlements on record yet for this envelope.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {settlementHistory.map((s) => {
              const transfersList = s.suggestedTransfers || s.transfers || [];
              return (
                <div
                  key={s._id}
                  style={{
                    padding: '20px',
                    backgroundColor: isLight ? '#f8fafc' : '#040705',
                    borderRadius: '16px',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={15} style={{ color: '#00e676' }} />
                      <span style={{ fontSize: '14px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                        Settlement #{s._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: s.status === 'closed'
                            ? (isLight ? '#ecfdf5' : 'rgba(16, 185, 129, 0.15)')
                            : (isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)'),
                          color: s.status === 'closed' ? '#059669' : '#d97706',
                          textTransform: 'uppercase',
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '12px', color: isLight ? '#94a3b8' : '#6d7f75', fontFamily: 'var(--font-mono)' }}>
                      Finalized {formatDate(s.createdAt)}
                    </span>
                  </div>

                  {s.note && (
                    <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#8899a6', marginBottom: '12px', fontStyle: 'italic', margin: '0 0 14px 0' }}>
                      "{s.note}"
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {transfersList.map((tx, idx) => {
                      const txId = tx.id || tx._id;
                      const debtorId = tx.from?.id || tx.from?._id;
                      const creditorId = tx.to?.id || tx.to?._id;
                      const isDebtor = debtorId?.toString() === user?._id?.toString();
                      const isCreditor = creditorId?.toString() === user?._id?.toString();
                      const actionKey = `${s._id}-${txId}`;
                      const isLoading = actionLoading[actionKey];

                      return (
                        <div
                          key={txId || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            backgroundColor: isLight ? '#ffffff' : '#080d0a',
                            borderRadius: '12px',
                            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.05)',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          {/* Debtor & Creditor info */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: isDebtor ? '#ef4444' : (isLight ? '#0f172a' : '#ffffff') }}>
                                {isDebtor ? 'You' : tx.from?.name}
                              </span>
                              <span style={{ fontSize: '11px', color: isLight ? '#94a3b8' : '#71717a' }}>owes</span>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: isCreditor ? '#10b981' : (isLight ? '#0f172a' : '#ffffff') }}>
                                {isCreditor ? 'You' : tx.to?.name}
                              </span>
                              {tx.to?.upiId && (
                                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isLight ? '#059669' : '#00e676' }}>
                                  ({tx.to.upiId})
                                </span>
                              )}
                              {renderStatusBadge(tx.paymentStatus)}
                            </div>

                            {/* UTR / Reference Info */}
                            {tx.upiReference && (
                              <div style={{ fontSize: '11px', color: isLight ? '#64748b' : '#9ca3af', fontFamily: 'var(--font-mono)' }}>
                                Ref/UTR: <strong>{tx.upiReference}</strong>
                              </div>
                            )}

                            {/* Dispute Reason Warning */}
                            {tx.paymentStatus === 'disputed' && tx.disputeReason && (
                              <div style={{ fontSize: '11.5px', color: '#ef4444', fontWeight: 700 }}>
                                ⚠️ Dispute: {tx.disputeReason}
                              </div>
                            )}
                          </div>

                          {/* Amount and Action Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <strong style={{ fontSize: '15px', fontFamily: 'var(--font-mono)', color: isLight ? '#0f172a' : '#ffffff' }}>
                              {formatPaise(tx.amountPaise)}
                            </strong>

                            {/* Payer Action */}
                            {isDebtor && (tx.paymentStatus === 'pending' || tx.paymentStatus === 'disputed') && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSettlementId(s._id);
                                  setSelectedTransfer(tx);
                                }}
                                style={{
                                  padding: '7px 16px',
                                  borderRadius: '9999px',
                                  backgroundColor: isLight ? '#000000' : '#f59e0b',
                                  color: isLight ? '#ffffff' : '#000000',
                                  fontWeight: 900,
                                  fontSize: '12px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.15)' : '0 0 14px rgba(245, 158, 11, 0.3)',
                                }}
                              >
                                <Smartphone size={13} strokeWidth={2.5} />
                                <span>Pay via UPI</span>
                              </button>
                            )}

                            {isDebtor && tx.paymentStatus === 'reported' && (
                              <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 800 }}>
                                Awaiting Confirmation
                              </span>
                            )}

                            {/* Receiver Actions when payment is reported */}
                            {isCreditor && tx.paymentStatus === 'reported' && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleConfirmReceived(s._id, txId)}
                                  disabled={isLoading}
                                  style={{
                                    padding: '6px 14px',
                                    borderRadius: '9999px',
                                    backgroundColor: '#10b981',
                                    color: '#ffffff',
                                    fontWeight: 900,
                                    fontSize: '11.5px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <Check size={13} strokeWidth={2.8} />
                                  <span>{isLoading ? 'Confirming...' : 'Confirm Received'}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDisputeTarget({ settlementId: s._id, transferId: txId, payerName: tx.from?.name, amountPaise: tx.amountPaise })}
                                  disabled={isLoading}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '9999px',
                                    backgroundColor: 'transparent',
                                    color: '#ef4444',
                                    fontWeight: 800,
                                    fontSize: '11.5px',
                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <XCircle size={13} />
                                  <span>Dispute</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dispute Payment Modal */}
      {disputeTarget && (
        <Modal
          isOpen={!!disputeTarget}
          onClose={() => setDisputeTarget(null)}
          title="Dispute UPI Payment"
          subtitle={`Reporting unverified transfer from ${disputeTarget.payerName || 'debtor'}`}
          maxWidth="440px"
        >
          <form onSubmit={handleDisputeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '12px', color: '#ef4444', lineHeight: 1.45 }}>
              <strong>Notice:</strong> Only dispute if you have actively checked your bank or UPI transaction history and verified that ₹{formatPaise(disputeTarget.amountPaise)} was not credited.
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Reason for Dispute
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Payment not credited to my bank account, or incorrect amount"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setDisputeTarget(null)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading[`${disputeTarget.settlementId}-${disputeTarget.transferId}`]}
                style={{
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {actionLoading[`${disputeTarget.settlementId}-${disputeTarget.transferId}`] ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Settle Debt Modal */}
      {selectedTransfer && (
        <SettleDebtModal
          isOpen={!!selectedTransfer}
          onClose={() => {
            setSelectedTransfer(null);
            setSelectedSettlementId(null);
          }}
          transfer={selectedTransfer}
          settlementId={selectedSettlementId || (settlementHistory[0]?._id)}
          onPaymentRecorded={() => {
            refreshActiveGroup();
            fetchHistory();
          }}
        />
      )}
    </div>
  );
}
