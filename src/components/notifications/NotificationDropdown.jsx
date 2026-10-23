import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCheck, Receipt, UserPlus, Scale, Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { formatRelativeTime } from '../../utils/formatters';

export function NotificationDropdown({ onClose }) {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'EXPENSE_ADDED':
        return <Receipt size={16} style={{ color: 'var(--accent-primary)' }} />;
      case 'GROUP_INVITE':
        return <UserPlus size={16} style={{ color: 'var(--color-neutral)' }} />;
      case 'SETTLEMENT_FINALIZED':
        return <Scale size={16} style={{ color: 'var(--color-warning)' }} />;
      default:
        return <Bell size={16} style={{ color: 'var(--text-secondary)' }} />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '360px',
        maxWidth: '90vw',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 110,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 700 }}>Notifications</span>
        <button
          onClick={markAllAsRead}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '12px', padding: '4px 8px' }}
        >
          <CheckCheck size={14} />
          <span>Mark all read</span>
        </button>
      </div>

      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={28} style={{ margin: '0 auto 8px auto', opacity: 0.4 }} />
            <p style={{ fontSize: '13px' }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                markAsRead(n._id);
                if (n.link) navigate(n.link);
                onClose();
              }}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: n.isRead ? 'transparent' : 'var(--accent-subtle)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {n.title}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  {formatRelativeTime(n.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
        <button
          onClick={() => {
            navigate('/notifications');
            onClose();
          }}
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', fontSize: '12px' }}
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
