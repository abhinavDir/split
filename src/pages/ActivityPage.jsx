import React, { useState } from 'react';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { formatPaise, formatRelativeTime, formatDate } from '../utils/formatters';
import { ExpenseDetailModal } from '../components/expenses/ExpenseDetailModal';
import {
  History,
  Receipt,
  Utensils,
  Plane,
  Home,
  Film,
  ShoppingBag,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CATEGORY_ICONS = {
  Food: Utensils,
  Transport: Plane,
  Stay: Home,
  Entertainment: Film,
  Groceries: ShoppingBag,
};

export function ActivityPage() {
  const { expenses, groups, refreshActiveGroup } = useExpenseGroup();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');
  const [selectedExpense, setSelectedExpense] = useState(null);

  const filteredExpenses = expenses.filter((e) => {
    return selectedGroupFilter === 'ALL' || e.groupId?.toString() === selectedGroupFilter.toString();
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '4px',
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
              IMMUTABLE CHRONOLOGICAL AUDIT
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.03em', margin: 0 }}>
            Activity & Audit Trail
          </h1>
          <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#9ca3af', marginTop: '4px', margin: 0, fontWeight: 700 }}>
            Real-time feed of all recorded expenses, multi-party splits, and settlement state updates
          </p>
        </div>

        {/* Group Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} style={{ color: isLight ? '#64748b' : '#9ca3af' }} />
          <select
            value={selectedGroupFilter}
            onChange={(e) => setSelectedGroupFilter(e.target.value)}
            style={{
              backgroundColor: isLight ? '#ffffff' : '#18181b',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '9999px',
              color: isLight ? '#0f172a' : '#ffffff',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 800,
              outline: 'none',
              cursor: 'pointer',
              boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            }}
          >
            <option value="ALL">All Envelopes ({expenses.length})</option>
            {groups.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Feed Card */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : '0 8px 32px rgba(0, 0, 0, 0.7)',
        }}
      >
        {filteredExpenses.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: isLight ? '#94a3b8' : '#6d7f75' }}>
            <History size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '4px' }}>
              No Activity Recorded
            </h4>
            <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#8899a6' }}>No transactions found for the selected filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredExpenses.map((exp) => {
              const Icon = CATEGORY_ICONS[exp.category] || Receipt;
              const isPayer = exp.payerId?.toString() === user?._id?.toString();
              const myShare =
                exp.participants?.find((p) => p.userId?.toString() === user?._id?.toString())?.sharePaise || 0;
              const groupName = groups.find((g) => g._id?.toString() === exp.groupId?.toString())?.name || 'Envelope';

              return (
                <div
                  key={exp._id}
                  onClick={() => setSelectedExpense(exp)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    backgroundColor: isLight ? '#f8fafc' : '#141417',
                    borderRadius: '18px',
                    border: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = isLight ? '#cbd5e1' : 'rgba(245, 158, 11, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '14px',
                        backgroundColor: isLight ? '#fef3c7' : '#18181b',
                        color: isLight ? '#b45309' : '#fbbf24',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: isLight ? '1px solid #fde68a' : '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Icon size={20} strokeWidth={2.4} />
                    </div>

                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                        {exp.description}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          color: isLight ? '#64748b' : '#9ca3af',
                          marginTop: '4px',
                        }}
                      >
                        <span
                          style={{
                            color: isLight ? '#b45309' : '#fbbf24',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: isLight ? '#fef3c7' : 'rgba(245, 158, 11, 0.15)',
                            fontSize: '11px',
                          }}
                        >
                          {groupName}
                        </span>
                        <span>•</span>
                        <span style={{ fontWeight: 700 }}>
                          Paid by <strong style={{ color: isLight ? '#0f172a' : '#ffffff', fontWeight: 900 }}>{isPayer ? 'You' : exp.payerName}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ fontWeight: 700 }}>{formatRelativeTime(exp.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '17px',
                        fontWeight: 900,
                        color: isLight ? '#b45309' : '#fbbf24',
                      }}
                    >
                      {formatPaise(exp.amountPaise)}
                    </span>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 800,
                        color: isPayer ? '#10b981' : '#ef4444',
                        marginTop: '2px',
                        display: 'block',
                      }}
                    >
                      {isPayer ? `You lent ${formatPaise(exp.amountPaise - myShare)}` : `Your share: ${formatPaise(myShare)}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedExpense && (
        <ExpenseDetailModal
          isOpen={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
          expense={selectedExpense}
          onDeleted={() => refreshActiveGroup()}
        />
      )}
    </div>
  );
}
