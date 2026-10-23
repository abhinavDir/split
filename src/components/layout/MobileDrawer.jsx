import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LayoutDashboard,
  Users,
  Scale,
  History,
  Bell,
  User,
  LogOut,
  Zap,
  FolderPlus,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExpenseGroup } from '../../context/ExpenseGroupContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { MemberAvatar } from '../common/MemberAvatar';

export function MobileDrawer({ isOpen, onClose, onOpenAddExpense, onOpenCreateGroup }) {
  const { user, logout } = useAuth();
  const { groups } = useExpenseGroup();
  const { unreadCount } = useNotifications();
  const { theme, currentAccent, accent, setAccent, ACCENT_OPTIONS } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Vault', path: '/dashboard', icon: LayoutDashboard, desc: 'Cockpit & Syndicate Balances' },
    { label: 'Activity & Audit', path: '/activity', icon: History, desc: 'Real-time ledger audit trail' },
    { label: 'Shared Envelopes', path: '/groups', icon: Users, desc: 'Allocated pools & trips', badge: groups.length },
    { label: 'Analytics & Settle', path: '/settlements', icon: Scale, desc: 'P2P UPI clearinghouse' },
    { label: 'Notifications', path: '/notifications', icon: Bell, desc: 'Dispatches & invitations', badge: unreadCount > 0 ? unreadCount : null },
    { label: 'Profile & Settings', path: '/profile', icon: User, desc: 'UPI handle & session keys' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '320px',
              maxWidth: '85vw',
              height: '100vh',
              backgroundColor: isLight ? '#ffffff' : '#050906',
              borderLeft: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: isLight ? '-10px 0 40px rgba(0, 0, 0, 0.15)' : '-10px 0 40px rgba(0, 0, 0, 0.9)',
              zIndex: 1001,
              overflowY: 'auto',
              boxSizing: 'border-box',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div>
              {/* Drawer Top Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 18px',
                  borderBottom: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isLight ? '#0f172a' : (currentAccent?.primary || '#f59e0b'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isLight ? '#ffffff' : (accent === 'amber' ? '#000000' : '#ffffff'),
                      boxShadow: isLight ? '0 2px 6px rgba(15, 23, 42, 0.2)' : `0 0 12px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.5)'}`,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 12c-2-2.5-4-4-6.5-4A4.5 4.5 0 0 0 1 12.5 4.5 4.5 0 0 0 5.5 17c2.5 0 4.5-1.5 6.5-5 2-3.5 4-5 6.5-5a4.5 4.5 0 0 1 4.5 4.5 4.5 4.5 0 0 1-4.5 4.5c-2.5 0-4-1.5-6.5-4Z"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', letterSpacing: '-0.02em' }}>
                      Tandem Arc
                    </span>
                    <span style={{ display: 'block', fontSize: '10px', color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'), fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Mobile Vault
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    color: isLight ? '#64748b' : '#8899a6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User Identity Mini Card */}
              <div
                style={{
                  margin: '14px 16px',
                  padding: '14px',
                  backgroundColor: isLight ? '#f8fafc' : '#080e0a',
                  borderRadius: '16px',
                  border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <MemberAvatar name={user?.name || 'User'} size="md" />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#00e676',
                      border: isLight ? '2px solid #f8fafc' : '2px solid #080e0a',
                      boxShadow: '0 0 6px #00e676',
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || 'User'}
                  </h4>
                  <p style={{ fontSize: '12px', color: isLight ? '#64748b' : '#6d7f75', margin: '2px 0 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email || ''}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px 14px 16px' }}>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAddExpense();
                  }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '9999px',
                    backgroundColor: currentAccent?.primary || '#f59e0b',
                    color: accent === 'amber' ? '#000000' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: `0 0 20px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
                  }}
                >
                  <Zap size={16} fill={accent === 'amber' ? '#000000' : '#ffffff'} strokeWidth={2.4} />
                  <span>New Split ⚡</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenCreateGroup();
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '9999px',
                    backgroundColor: isLight ? '#f1f5f9' : '#0a120e',
                    color: isLight ? '#0f172a' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <FolderPlus size={15} />
                  <span>Create Envelope</span>
                </button>
              </div>

              {/* All Navigation Links */}
              <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: isLight ? '#64748b' : '#52665a', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 12px 4px 12px' }}>
                  Navigation Routes
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '11px 14px',
                        borderRadius: '14px',
                        backgroundColor: isActive
                          ? (isLight ? (currentAccent?.bg || '#fef3c7') : (currentAccent?.subtle || 'rgba(245, 158, 11, 0.15)'))
                          : 'transparent',
                        border: isActive
                          ? (isLight ? `1px solid ${currentAccent?.light || '#fde68a'}` : `1px solid ${currentAccent?.primary || '#f59e0b'}55`)
                          : '1px solid transparent',
                        color: isActive
                          ? (isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'))
                          : (isLight ? '#334155' : '#e2e8f0'),
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            backgroundColor: isActive
                              ? (isLight ? (currentAccent?.bg || '#fef3c7') : (currentAccent?.subtle || 'rgba(245, 158, 11, 0.2)'))
                              : (isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)'),
                            color: isActive
                              ? (currentAccent?.primary || '#f59e0b')
                              : (isLight ? '#475569' : '#8899a6'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: isActive ? 800 : 700, color: isActive ? (isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24')) : (isLight ? '#0f172a' : '#ffffff') }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: '10px', color: isLight ? '#64748b' : '#6d7f75' }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>

                      {item.badge !== undefined && item.badge !== null && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: isActive ? (currentAccent?.primary || '#f59e0b') : (isLight ? '#e2e8f0' : 'rgba(255, 255, 255, 0.08)'),
                            color: isActive ? (accent === 'amber' ? '#000000' : '#ffffff') : (isLight ? '#334155' : '#8899a6'),
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Section */}
            <div
              style={{
                padding: '16px',
                borderTop: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: isLight ? '#f8fafc' : '#040705',
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(244, 63, 94, 0.12)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#f43f5e',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: currentAccent?.primary || '#f59e0b', boxShadow: `0 0 6px ${currentAccent?.primary || '#f59e0b'}` }} />
                <span style={{ fontSize: '10px', color: isLight ? '#64748b' : '#52665a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Multi-Vault Sync Active
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
