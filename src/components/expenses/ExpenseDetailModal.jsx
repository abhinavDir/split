import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { MemberAvatar } from '../common/MemberAvatar';
import { formatPaise, formatDate } from '../../utils/formatters';
import { expenseService } from '../../services/expense.service';
import { Trash2, User, Tag, Receipt, ExternalLink } from 'lucide-react';

export function ExpenseDetailModal({ isOpen, onClose, expense, onDeleted }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!expense) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await expenseService.deleteExpense(expense._id);
      setShowConfirmDelete(false);
      onClose();
      if (onDeleted) onDeleted(expense._id);
    } catch (err) {
      console.error('Failed to delete expense:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={expense.description}
        subtitle={`Recorded on ${formatDate(expense.createdAt)}`}
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Total Header Banner */}
          <div
            style={{
              padding: '22px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', fontWeight: 800 }}>
              Total Split Volume
            </span>
            <h2
              style={{
                fontSize: '34px',
                fontWeight: 900,
                color: 'var(--accent-primary)',
                fontFamily: 'var(--font-mono)',
                margin: '4px 0 0 0',
              }}
            >
              {formatPaise(expense.amountPaise)}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} style={{ color: 'var(--accent-primary)' }} />
                Paid by <strong style={{ color: 'var(--text-primary)' }}>{expense.payerName}</strong>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} style={{ color: 'var(--text-muted)' }} />
                {expense.category || 'General'}
              </span>
            </div>
          </div>

          {/* Individual Member Shares Breakdown */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Allocator Shares ({expense.splitType || 'EQUAL'})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {expense.participants?.map((p) => (
                <div
                  key={p.userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MemberAvatar name={p.name} size="xs" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {formatPaise(p.sharePaise)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Attachment if present */}
          {expense.receiptUrl && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Receipt size={18} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Digital Receipt Proof</span>
              </div>
              <a
                href={expense.receiptUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--accent-primary)',
                  textDecoration: 'none',
                }}
              >
                <span>Inspect</span>
                <ExternalLink size={13} />
              </a>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button
              onClick={() => setShowConfirmDelete(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#f43f5e',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Trash2 size={14} />
              <span>Delete Split</span>
            </button>

            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Split Entry"
        message={`Are you sure you want to remove "${expense.description}"? Group balances will recalculate instantly.`}
        confirmLabel="Delete Split"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </>
  );
}
