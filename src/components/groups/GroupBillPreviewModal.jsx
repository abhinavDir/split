import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { formatPaise, formatDate, formatRelativeTime } from '../../utils/formatters';
import {
  Receipt,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function GroupBillPreviewModal({ isOpen, onClose, billData }) {
  useEffect(() => {
    if (isOpen && billData) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  }, [isOpen, billData]);

  if (!billData) return null;

  const expenses = billData.expenses || [];
  const transfers = billData.suggestedTransfers || [];
  const memberBalances = billData.memberBalances || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Envelope Digital Receipt"
      subtitle={`Verified cryptographic breakdown for ${billData.groupName}`}
      maxWidth="620px"
    >
      <div id="printable-bill-receipt" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Live Broadcast Banner */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: 'rgba(0, 230, 118, 0.1)',
            border: '1px solid rgba(0, 230, 118, 0.25)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#00e676',
                boxShadow: '0 0 8px #00e676',
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
              Broadcasted by {billData.broadcastBy?.name || 'Admin'}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#6d7f75', fontFamily: 'var(--font-mono)' }}>
            {formatDate(billData.broadcastAt)}
          </span>
        </div>

        {/* Digital Receipt Card */}
        <div
          style={{
            backgroundColor: '#040705',
            border: '1px dashed rgba(0, 230, 118, 0.35)',
            borderRadius: '18px',
            padding: '24px 22px',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '1px dashed rgba(255, 255, 255, 0.08)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#00e676', marginBottom: '4px' }}>
              <Receipt size={18} />
              <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                TANDEM ARC LEDGER INVOICE
              </span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '4px 0', letterSpacing: '-0.02em' }}>
              {billData.groupName}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#6d7f75' }}>
              <span>{billData.category}</span>
              <span>•</span>
              <span style={{ color: billData.isCompleted ? '#00e676' : '#8899a6' }}>
                {billData.isCompleted ? '✓ Completed Envelope' : '● Active Liquidity'}
              </span>
            </div>
          </div>

          {/* Spend Summary */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
            }}
          >
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.04em' }}>
                Total Managed Volume
              </span>
              <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                {formatPaise(billData.totalGroupSpendPaise || 0)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, letterSpacing: '0.04em' }}>
                Recorded Splits
              </span>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '2px' }}>
                {expenses.length} Splits
              </div>
            </div>
          </div>

          {/* Itemized Expenses Table */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '8px' }}>
              Itemized Splits ({expenses.length})
            </h4>

            {expenses.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>
                No expenses recorded in this envelope.
              </p>
            ) : (
              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {expenses.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{exp.description}</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Paid by {exp.payerName} • {formatRelativeTime(exp.createdAt)}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatPaise(exp.amountPaise)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Final Settlement Transfers */}
          {transfers.length > 0 && (
            <div style={{ borderTop: '1px dashed var(--border-medium)', paddingTop: '14px', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 800, marginBottom: '8px' }}>
                Final Direct Transfers ({transfers.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {transfers.map((tx, idx) => (
                  <div
                    key={tx.id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-tertiary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: 'var(--color-negative)' }}>{tx.from?.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>pays</span>
                      <ArrowRight size={12} style={{ color: 'var(--accent-primary)' }} />
                      <strong style={{ color: 'var(--accent-primary)' }}>{tx.to?.name}</strong>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {formatPaise(tx.amountPaise)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Balance Roster */}
          {memberBalances.length > 0 && (
            <div style={{ borderTop: '1px dashed var(--border-medium)', paddingTop: '14px' }}>
              <h4 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)', fontWeight: 800, marginBottom: '8px' }}>
                Member Net Position
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                {memberBalances.map((m) => {
                  const net = m.netBalancePaise || 0;
                  const isPositive = net > 0;
                  const isZero = net === 0;
                  return (
                    <div
                      key={m.userId}
                      style={{
                        padding: '8px 10px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '11px',
                      }}
                    >
                      <div style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{m.name}</div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          color: isZero ? 'var(--text-muted)' : isPositive ? 'var(--color-positive)' : 'var(--color-negative)',
                          marginTop: '2px',
                        }}
                      >
                        {formatPaise(net, { showSign: true })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '9px 18px',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer size={15} />
            <span>Print Receipt</span>
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '9px 24px',
              borderRadius: '9999px',
              backgroundColor: 'var(--accent-primary)',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px var(--accent-glow)',
            }}
          >
            <CheckCircle2 size={16} strokeWidth={2.5} />
            <span>Got It ⚡</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
