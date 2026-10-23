import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function MobileNav() {
  const { theme, currentAccent } = useTheme();
  const isLight = theme === 'light';

  const navItemStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    padding: '8px 18px',
    borderRadius: '14px',
    color: isActive
      ? (currentAccent?.primary || '#f59e0b')
      : (isLight ? '#94a3b8' : 'rgba(255, 255, 255, 0.45)'),
    backgroundColor: isActive
      ? (isLight ? (currentAccent?.bg || '#fef3c7') : (currentAccent?.subtle || 'rgba(245, 158, 11, 0.12)'))
      : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    minWidth: '64px',
  });

  const labelStyle = (isActive) => ({
    fontSize: '11px',
    fontWeight: isActive ? 900 : 700,
    letterSpacing: '0.01em',
    lineHeight: 1,
    color: isActive ? (currentAccent?.primary || '#f59e0b') : undefined,
  });

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '66px',
        backgroundColor: isLight ? 'rgba(255, 255, 255, 0.98)' : 'rgba(0, 0, 0, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: isLight ? `1.5px solid ${currentAccent?.primary || '#f59e0b'}35` : `1px solid ${currentAccent?.primary || '#f59e0b'}50`,
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 99,
        padding: '0 20px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: isLight ? `0 -4px 20px ${currentAccent?.glow || 'rgba(0, 0, 0, 0.05)'}` : '0 -4px 25px rgba(0, 0, 0, 0.8)',
        transition: 'all 0.2s ease',
      }}
      className="hidden-desktop"
    >
      {/* 1. Home */}
      <NavLink
        to="/dashboard"
        style={({ isActive }) => navItemStyle(isActive)}
        aria-label="Home"
      >
        {({ isActive }) => (
          <>
            <Home size={22} strokeWidth={isActive ? 2.8 : 2.2} />
            <span style={labelStyle(isActive)}>Home</span>
          </>
        )}
      </NavLink>

      {/* 2. Groups */}
      <NavLink
        to="/groups"
        style={({ isActive }) => navItemStyle(isActive)}
        aria-label="Groups"
      >
        {({ isActive }) => (
          <>
            <Users size={22} strokeWidth={isActive ? 2.8 : 2.2} />
            <span style={labelStyle(isActive)}>Groups</span>
          </>
        )}
      </NavLink>

      {/* 3. Profile */}
      <NavLink
        to="/profile"
        style={({ isActive }) => navItemStyle(isActive)}
        aria-label="Profile"
      >
        {({ isActive }) => (
          <>
            <User size={22} strokeWidth={isActive ? 2.8 : 2.2} />
            <span style={labelStyle(isActive)}>Profile</span>
          </>
        )}
      </NavLink>
    </nav>
  );
}
