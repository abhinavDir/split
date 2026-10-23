import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { formatRelativeTime } from '../utils/formatters';
import { Bell, CheckCheck, Receipt, UserPlus, Scale, Check, Radio, Smartphone, AlertCircle } from 'lucide-react';

export function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'EXPENSE') return n.type === 'EXPENSE_ADDED';
    if (filter === 'INVITE') return n.type === 'GROUP_INVITE';
    if (filter === 'SETTLEMENT') {
      return ['SETTLEMENT_FINALIZED', 'PAYMENT_RECEIVED', 'PAYMENT_REPORTED', 'PAYMENT_CONFIRMED', 'PAYMENT_DISPUTED'].includes(n.type);
    }
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'EXPENSE_ADDED':
        return <Receipt size={18} style={{ color: isLight ? '#059669' : '#00e676' }} />;
      case 'GROUP_INVITE':
        return <UserPlus size={18} style={{ color: isLight ? '#0284c7' : '#38bdf8' }} />;
      case 'SETTLEMENT_FINALIZED':
      case 'PAYMENT_CONFIRMED':
        return <Scale size={18} style={{ color: isLight ? '#d97706' : '#f59e0b' }} />;
      case 'PAYMENT_REPORTED':
      case 'PAYMENT_RECEIVED':
        return <Smartphone size={18} style={{ color: isLight ? '#0284c7' : '#38bdf8' }} />;
      case 'PAYMENT_DISPUTED':
        return <AlertCircle size={18} style={{ color: '#ef4444' }} />;
      default:
        return <Bell size={18} style={{ color: isLight ? '#059669' : '#00e676' }} />;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
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
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isLight ? '#059669' : '#00e676',
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
                  backgroundColor: isLight ? '#059669' : '#00e676',
                  boxShadow: isLight ? '0 0 8px rgba(5, 150, 105, 0.4)' : '0 0 8px #00e676',
                }}
              />
              REAL-TIME DISPATCH FEED
            </span>
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.03em', margin: 0 }}>
            Notifications & Signals
          </h1>
          <p style={{ fontSize: '14px', color: isLight ? '#64748b' : '#8899a6', marginTop: '4px', margin: 0 }}>
            Instant notifications for expense splits, shared invites, and finalized settlements
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          style={{
            padding: '9px 18px',
            borderRadius: '9999px',
            backgroundColor: isLight ? '#ffffff' : '#070c09',
            border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.1)',
            color: isLight ? '#0f172a' : '#ffffff',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <CheckCheck size={15} style={{ color: isLight ? '#059669' : '#00e676' }} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '10px 14px',
          backgroundColor: isLight ? '#f1f5f9' : '#060a08',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '16px',
        }}
      >
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'UNREAD', label: 'Unread Only' },
          { id: 'EXPENSE', label: 'Expenses' },
          { id: 'INVITE', label: 'Invitations' },
          { id: 'SETTLEMENT', label: 'Settlements' },
        ].map((t) => {
          const isActive = filter === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                border: isActive
                  ? (isLight ? '1px solid #059669' : '1px solid rgba(0, 230, 118, 0.5)')
                  : (isLight ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.08)'),
                backgroundColor: isActive
                  ? (isLight ? '#ffffff' : 'rgba(0, 230, 118, 0.12)')
                  : (isLight ? 'transparent' : '#070c09'),
                color: isActive
                  ? (isLight ? '#059669' : '#00e676')
                  : (isLight ? '#64748b' : '#8899a6'),
                boxShadow: isActive && isLight ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Notification List */}
      <div
        style={{
          backgroundColor: isLight ? '#ffffff' : '#070c09',
          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: isLight ? '0 4px 20px -2px rgba(0, 0, 0, 0.05)' : '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: isLight ? '#94a3b8' : '#6d7f75' }}>
            <Bell size={38} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '4px' }}>
              No notifications to display
            </h3>
            <p style={{ fontSize: '13px', color: isLight ? '#64748b' : '#8899a6' }}>You are completely caught up with all vault activity.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((n) => (
              <div
                key={n._id}
                onClick={() => {
                  markAsRead(n._id);
                  if (n.link) navigate(n.link);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  backgroundColor: n.isRead
                    ? (isLight ? '#f8fafc' : '#040705')
                    : (isLight ? 'rgba(5, 150, 105, 0.05)' : 'rgba(0, 230, 118, 0.04)'),
                  borderRadius: '14px',
                  border: n.isRead
                    ? (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)')
                    : (isLight ? '1px solid rgba(5, 150, 105, 0.35)' : '1px solid rgba(0, 230, 118, 0.35)'),
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isLight ? '#059669' : 'rgba(0, 230, 118, 0.4)';
                  e.currentTarget.style.backgroundColor = isLight ? '#f1f5f9' : '#070c09';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = n.isRead
                    ? (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.06)')
                    : (isLight ? 'rgba(5, 150, 105, 0.35)' : 'rgba(0, 230, 118, 0.35)');
                  e.currentTarget.style.backgroundColor = n.isRead
                    ? (isLight ? '#f8fafc' : '#040705')
                    : (isLight ? 'rgba(5, 150, 105, 0.05)' : 'rgba(0, 230, 118, 0.04)');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getIcon(n.type)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', margin: '0 0 2px 0' }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: '13px', color: isLight ? '#475569' : '#8899a6', margin: 0 }}>
                      {n.message}
                    </p>
                    <span
                      style={{
                        fontSize: '11px',
                        color: isLight ? '#94a3b8' : '#52665a',
                        marginTop: '4px',
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                </div>

                {!n.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(n._id);
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isLight ? 'rgba(5, 150, 105, 0.12)' : 'rgba(0, 230, 118, 0.15)',
                      border: 'none',
                      color: isLight ? '#059669' : '#00e676',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Mark read"
                  >
                    <Check size={15} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
