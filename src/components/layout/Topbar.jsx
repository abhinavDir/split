import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  Zap,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Palette,
  Compass,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useExpenseGroup } from '../../context/ExpenseGroupContext';
import { useNotifications } from '../../context/NotificationContext';
import { useSocket } from '../../context/SocketContext';
import { useTheme } from '../../context/ThemeContext';
import { MemberAvatar } from '../common/MemberAvatar';
import { NotificationDropdown } from '../notifications/NotificationDropdown';

export function Topbar({ onOpenAddExpense, onOpenMobileDrawer }) {
  const { user, logout } = useAuth();
  const { groups, activeGroupId, setActiveGroupId, activeGroup } = useExpenseGroup();
  const { unreadCount } = useNotifications();
  const { isConnected } = useSocket();
  const { theme, toggleTheme, accent, setAccent, ACCENT_OPTIONS, currentAccent } = useTheme();
  const isLight = theme === 'light';
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';
  const isSolo = location.pathname === '/solo' || location.pathname === '/personal-trips';
  const isMerged = isDashboard || isSolo;

  const navLinks = [
    { label: 'Vault', path: '/dashboard' },
    { label: 'Activity', path: '/activity' },
    { label: 'Envelopes', path: '/groups' },
    { label: 'Analytics', path: '/settlements' },
  ];

  return (
    <header
      style={{
        height: '66px',
        backgroundColor: isMerged
          ? 'transparent'
          : (isLight ? 'rgba(255, 255, 255, 0.98)' : '#000000'),
        backdropFilter: isMerged ? 'none' : 'blur(16px)',
        WebkitBackdropFilter: isMerged ? 'none' : 'blur(16px)',
        borderBottom: isMerged
          ? 'none'
          : (isLight ? `1.5px solid ${currentAccent?.primary || '#f59e0b'}30` : `1.5px solid ${currentAccent?.primary || '#f59e0b'}44`),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: isMerged ? 'absolute' : 'sticky',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 40,
        boxShadow: isMerged
          ? 'none'
          : (isLight ? `0 2px 14px ${currentAccent?.glow || 'rgba(0, 0, 0, 0.03)'}` : '0 4px 25px rgba(0, 0, 0, 0.95)'),
        transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* LEFT: TANDEM ARC BRAND + MULTI-VAULT BADGE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: isMerged
              ? (isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(24, 24, 27, 0.85)')
              : (isLight ? '#f1f5f9' : '#18181b'),
            border: isMerged
              ? (isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)')
              : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.14)'),
            backdropFilter: isMerged ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: isMerged ? 'blur(12px)' : 'none',
            borderRadius: '9999px',
            padding: '6px 16px 6px 6px',
            cursor: 'pointer',
            boxShadow: isMerged
              ? '0 2px 10px rgba(0, 0, 0, 0.06)'
              : (isLight ? '0 1px 2px rgba(0,0,0,0.03)' : '0 2px 10px rgba(0, 0, 0, 0.4)'),
            transition: 'all 0.15s ease',
          }}
        >
          {/* Infinity Loop Logo Icon */}
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: currentAccent?.primary || '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent === 'amber' ? '#000000' : '#ffffff',
              fontWeight: 900,
              boxShadow: `0 0 14px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.5)'}`,
              transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 12c-2-2.5-4-4-6.5-4A4.5 4.5 0 0 0 1 12.5 4.5 4.5 0 0 0 5.5 17c2.5 0 4.5-1.5 6.5-5 2-3.5 4-5 6.5-5a4.5 4.5 0 0 1 4.5 4.5 4.5 4.5 0 0 1-4.5 4.5c-2.5 0-4-1.5-6.5-4Z" />
            </svg>
          </div>

          <span
            style={{
              fontSize: '15px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: isLight ? '#0f172a' : '#ffffff',
            }}
          >
            tandem
          </span>

          <span
            style={{
              backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : (currentAccent?.subtle || 'rgba(245, 158, 11, 0.15)'),
              border: isLight ? `1px solid ${currentAccent?.light || '#fde68a'}` : `1px solid ${currentAccent?.primary || '#f59e0b'}55`,
              color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'),
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginLeft: '4px',
              transition: 'all 0.2s ease',
            }}
            className="hidden-mobile"
          >
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: currentAccent?.primary || '#f59e0b', boxShadow: `0 0 6px ${currentAccent?.primary || '#f59e0b'}` }} />
            Active
          </span>
        </div>
      </div>

      {/* CENTER: PRIMARY NAVIGATION TABS (VAULT, ACTIVITY, ENVELOPES, ANALYTICS) */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '26px',
        }}
        className="hidden-mobile"
      >
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive
                  ? (currentAccent?.primary || '#f59e0b')
                  : (isLight ? '#64748b' : 'rgba(255, 255, 255, 0.65)'),
                fontSize: '14px',
                fontWeight: isActive ? 900 : 700,
                cursor: 'pointer',
                padding: '6px 2px',
                position: 'relative',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = currentAccent?.primary || (isLight ? '#0f172a' : '#ffffff');
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = isLight ? '#64748b' : 'rgba(255, 255, 255, 0.65)';
              }}
            >
              <span>{link.label}</span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2.5px',
                    backgroundColor: currentAccent?.primary || '#f59e0b',
                    borderRadius: '2px',
                    boxShadow: `0 0 8px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.6)'}`,
                    transition: 'all 0.2s ease',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* RIGHT: LIGHT MODE TOGGLE + THEME PALETTE + NOTIFICATIONS + NEW SPLIT + PROFILE + MOBILE MENU */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* LIGHT MODE / DARK MODE TOGGLE BUTTON */}
        <button
          onClick={toggleTheme}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: isMerged
              ? (isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(24, 24, 27, 0.85)')
              : (isLight ? '#f1f5f9' : '#18181b'),
            border: isMerged
              ? (isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)')
              : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.14)'),
            backdropFilter: isMerged ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: isMerged ? 'blur(12px)' : 'none',
            color: isLight ? '#d97706' : '#facc15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isMerged ? '0 2px 8px rgba(0, 0, 0, 0.06)' : (isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'),
          }}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle light/dark mode"
        >
          {isLight ? <Moon size={17} strokeWidth={2.4} /> : <Sun size={17} strokeWidth={2.4} />}
        </button>

        {/* Color Palette Toggle (Works on BOTH Mobile & Desktop) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowPaletteMenu(!showPaletteMenu);
              setShowNotifMenu(false);
              setShowProfileMenu(false);
            }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isMerged
                ? (isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(24, 24, 27, 0.85)')
                : (isLight ? '#f1f5f9' : '#18181b'),
              border: isMerged
                ? (isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)')
                : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.14)'),
              backdropFilter: isMerged ? 'blur(12px)' : 'none',
              WebkitBackdropFilter: isMerged ? 'blur(12px)' : 'none',
              color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: isMerged ? '0 2px 8px rgba(0, 0, 0, 0.06)' : (isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'),
              transition: 'all 0.15s ease',
            }}
            title="Theme Palette"
            aria-label="Change theme accent color"
          >
            <Palette size={16} />
            {/* Active Accent Dot on the button */}
            <span
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentAccent?.previewGradient || currentAccent?.primary || '#f59e0b',
                boxShadow: `0 0 6px ${currentAccent?.primary || '#f59e0b'}`,
                border: isLight ? '1.5px solid #ffffff' : '1.5px solid #18181b',
              }}
            />
          </button>

          {/* Fixed Backdrop for Palette Menu to close on outside tap */}
          {showPaletteMenu && (
            <div
              onClick={() => setShowPaletteMenu(false)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 95,
                background: 'transparent',
              }}
            />
          )}

          {showPaletteMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '20px',
                padding: '16px',
                zIndex: 100,
                width: '260px',
                maxWidth: 'calc(100vw - 32px)',
                boxShadow: isLight ? '0 16px 40px rgba(0, 0, 0, 0.14)' : '0 20px 50px rgba(0, 0, 0, 0.95)',
                animation: 'fadeIn 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Theme Accent
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: currentAccent?.primary || '#f59e0b' }}>
                  {currentAccent?.label || 'Active'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {ACCENT_OPTIONS.map((opt) => {
                  const isSelected = accent === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setAccent(opt.id);
                        setShowPaletteMenu(false);
                      }}
                      style={{
                        height: '42px',
                        borderRadius: '12px',
                        background: opt.previewGradient || opt.primary,
                        border: isSelected
                          ? (isLight ? '3px solid #0f172a' : '3px solid #ffffff')
                          : '2px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        boxShadow: isSelected ? `0 0 14px ${opt.glow}` : '0 2px 6px rgba(0,0,0,0.15)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      title={opt.label}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {isSelected && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={opt.id === 'amber' ? '#000000' : '#ffffff'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <span style={{ fontSize: '10.5px', color: isLight ? '#94a3b8' : '#71717a', fontWeight: 700 }}>
                  Select color to switch full site theme
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell (Desktop only) */}
        <div style={{ position: 'relative' }} className="hidden-mobile">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProfileMenu(false);
              setShowPaletteMenu(false);
            }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isLight ? '#f1f5f9' : '#18181b',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.14)',
              color: isLight ? '#334155' : 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
            }}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: currentAccent?.primary || '#f59e0b',
                  boxShadow: `0 0 8px ${currentAccent?.primary || '#f59e0b'}`,
                }}
              />
            )}
          </button>

          {showNotifMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                zIndex: 100,
              }}
            >
              <NotificationDropdown onClose={() => setShowNotifMenu(false)} />
            </div>
          )}
        </div>

        {/* SLEEK "⚡ New Split" BUTTON (DESKTOP) */}
        <button
          onClick={onOpenAddExpense}
          className="hidden-mobile"
          style={{
            backgroundColor: currentAccent?.primary || '#f59e0b',
            border: 'none',
            color: accent === 'amber' ? '#000000' : '#ffffff',
            borderRadius: '9999px',
            padding: '9px 20px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: `0 0 16px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.4)'}`,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Zap size={14} fill={accent === 'amber' ? '#000000' : '#ffffff'} strokeWidth={2.4} />
          <span>New Split</span>
        </button>

        {/* User Profile Avatar (Desktop only) */}
        <div style={{ position: 'relative' }} className="hidden-mobile">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
              setShowPaletteMenu(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isLight ? (currentAccent?.bg || '#fef3c7') : '#18181b',
                color: isLight ? (currentAccent?.dark || '#b45309') : (currentAccent?.light || '#fbbf24'),
                border: isLight ? `2px solid ${currentAccent?.light || '#fde68a'}` : `2px solid ${currentAccent?.primary || '#f59e0b'}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '13px',
                boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.06)' : `0 0 10px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.25)'}`,
                transition: 'all 0.2s ease',
              }}
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '14px',
                zIndex: 100,
                width: '220px',
                boxShadow: isLight ? '0 10px 30px rgba(0, 0, 0, 0.1)' : '0 16px 40px rgba(0, 0, 0, 0.85)',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ fontSize: '11px', color: isLight ? '#64748b' : 'rgba(255, 255, 255, 0.6)', margin: '2px 0 0 0', fontWeight: 700 }}>
                  {user?.email || ''}
                </p>
              </div>

              <div style={{ height: '1px', backgroundColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)', margin: '10px 0' }} />

              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: '6px 0',
                }}
              >
                <LogOut size={15} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER MENU BUTTON */}
        <button
          onClick={onOpenMobileDrawer}
          className="hidden-desktop"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: isMerged
              ? (isLight ? 'rgba(255, 255, 255, 0.72)' : 'rgba(24, 24, 27, 0.85)')
              : (isLight ? '#f1f5f9' : '#18181b'),
            border: isMerged
              ? (isLight ? '1px solid rgba(255, 255, 255, 0.9)' : `1px solid ${currentAccent?.primary || '#f59e0b'}55`)
              : (isLight ? `1px solid ${currentAccent?.primary || '#f59e0b'}44` : `1px solid ${currentAccent?.primary || '#f59e0b'}55`),
            backdropFilter: isMerged ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: isMerged ? 'blur(12px)' : 'none',
            color: isLight ? (currentAccent?.dark || '#0f172a') : (currentAccent?.light || '#ffffff'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isMerged ? '0 2px 8px rgba(0, 0, 0, 0.06)' : (isLight ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'),
          }}
          aria-label="Open mobile navigation menu"
        >
          <Menu size={18} strokeWidth={2.8} />
        </button>
      </div>
    </header>
  );
}
