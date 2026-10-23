import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/formatters';

export function MemberAvatar({
  name,
  avatarUrl,
  size = 'md',
  role = null,
  showBorder = false,
}) {
  const sizeMap = {
    xs: { dim: 24, fontSize: '10px' },
    sm: { dim: 32, fontSize: '12px' },
    md: { dim: 40, fontSize: '14px' },
    lg: { dim: 52, fontSize: '18px' },
  }[size] || { dim: 40, fontSize: '14px' };

  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          width: `${sizeMap.dim}px`,
          height: `${sizeMap.dim}px`,
          borderRadius: '50%',
          backgroundColor: avatarUrl ? 'transparent' : bgColor,
          backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: sizeMap.fontSize,
          border: showBorder ? '2px solid var(--border-subtle)' : 'none',
          flexShrink: 0,
          userSelect: 'none',
        }}
        title={name}
      >
        {!avatarUrl && initials}
      </div>

      {role === 'ADMIN' && (
        <span
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--text-on-accent)',
            fontSize: '9px',
            fontWeight: 800,
            padding: '1px 4px',
            borderRadius: '4px',
            lineHeight: 1,
            boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          ★
        </span>
      )}
    </div>
  );
}
