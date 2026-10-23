import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ACCENT_OPTIONS = [
  {
    id: 'amber',
    label: 'Solar Gold',
    primary: '#f59e0b',
    secondary: '#d97706',
    dark: '#b45309',
    light: '#fbbf24',
    bg: '#fef3c7',
    subtle: 'rgba(245, 158, 11, 0.16)',
    glow: 'rgba(245, 158, 11, 0.4)',
    gradient: 'linear-gradient(135deg, #ffe082 0%, #ffd54f 35%, #ffca28 75%, #ffbe2b 100%)',
    heroGradientDark: 'radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 55%), #000000',
    waveGradient: 'linear-gradient(180deg, #ffca28 0%, #ffc107 45%, #ffb300 100%)',
  },
  {
    id: 'emerald',
    label: 'Emerald Jade',
    primary: '#10b981',
    secondary: '#059669',
    dark: '#047857',
    light: '#34d399',
    bg: '#ecfdf5',
    subtle: 'rgba(16, 185, 129, 0.16)',
    glow: 'rgba(16, 185, 129, 0.4)',
    gradient: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 35%, #34d399 75%, #10b981 100%)',
    heroGradientDark: 'radial-gradient(circle at 85% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 55%), #000000',
    waveGradient: 'linear-gradient(180deg, #34d399 0%, #10b981 45%, #059669 100%)',
  },
  {
    id: 'indigo',
    label: 'Electric Indigo',
    primary: '#6366f1',
    secondary: '#4f46e5',
    dark: '#4338ca',
    light: '#818cf8',
    bg: '#eef2ff',
    subtle: 'rgba(99, 102, 241, 0.16)',
    glow: 'rgba(99, 102, 241, 0.4)',
    gradient: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 35%, #818cf8 75%, #6366f1 100%)',
    heroGradientDark: 'radial-gradient(circle at 85% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 55%), #000000',
    waveGradient: 'linear-gradient(180deg, #818cf8 0%, #6366f1 45%, #4f46e5 100%)',
  },
  {
    id: 'cyan',
    label: 'Neon Cyan',
    primary: '#06b6d4',
    secondary: '#0891b2',
    dark: '#0e7490',
    light: '#22d3ee',
    bg: '#ecfeff',
    subtle: 'rgba(6, 182, 212, 0.16)',
    glow: 'rgba(6, 182, 212, 0.4)',
    gradient: 'linear-gradient(135deg, #a5f3fc 0%, #67e8f9 35%, #22d3ee 75%, #06b6d4 100%)',
    heroGradientDark: 'radial-gradient(circle at 85% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 55%), #000000',
    waveGradient: 'linear-gradient(180deg, #22d3ee 0%, #06b6d4 45%, #0891b2 100%)',
  },
  {
    id: 'violet',
    label: 'Royal Violet',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    dark: '#6d28d9',
    light: '#a78bfa',
    bg: '#f5f3ff',
    subtle: 'rgba(139, 92, 246, 0.16)',
    glow: 'rgba(139, 92, 246, 0.4)',
    gradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 35%, #a78bfa 75%, #8b5cf6 100%)',
    heroGradientDark: 'radial-gradient(circle at 85% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 55%), #000000',
    waveGradient: 'linear-gradient(180deg, #a78bfa 0%, #8b5cf6 45%, #7c3aed 100%)',
  },
  {
    id: 'rose',
    label: 'Sunset Rose',
    primary: '#f43f5e',
    secondary: '#e11d48',
    dark: '#be123c',
    light: '#fb7185',
    bg: '#ffe4e6',
    subtle: 'rgba(244, 63, 94, 0.16)',
    glow: 'rgba(244, 63, 94, 0.4)',
    gradient: 'linear-gradient(135deg, #fecdd3 0%, #fda4af 35%, #fb7185 75%, #f43f5e 100%)',
    heroGradientDark: 'radial-gradient(circle at 85% 20%, rgba(244, 63, 94, 0.15) 0%, transparent 55%), #000000',
    waveGradient: 'linear-gradient(180deg, #fb7185 0%, #f43f5e 45%, #e11d48 100%)',
  },
  {
    id: 'prism',
    label: 'Prism Aurora',
    primary: '#a855f7',
    secondary: '#ec4899',
    dark: '#7e22ce',
    light: '#c084fc',
    bg: '#faf5ff',
    subtle: 'rgba(168, 85, 247, 0.16)',
    glow: 'rgba(236, 72, 153, 0.55)',
    gradient: 'linear-gradient(135deg, #fbcfe8 0%, #ddd6fe 33%, #bae6fd 66%, #fef08a 100%)',
    heroGradientDark: 'radial-gradient(circle at 15% 15%, rgba(236, 72, 153, 0.28) 0%, transparent 45%), radial-gradient(circle at 85% 25%, rgba(56, 189, 248, 0.28) 0%, transparent 45%), radial-gradient(circle at 50% 85%, rgba(168, 85, 247, 0.25) 0%, transparent 50%), #000000',
    waveGradient: 'linear-gradient(90deg, #ec4899 0%, #a855f7 33%, #06b6d4 66%, #10b981 100%)',
    previewGradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 35%, #06b6d4 70%, #facc15 100%)',
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Neon',
    primary: '#06b6d4',
    secondary: '#f43f5e',
    dark: '#0891b2',
    light: '#38bdf8',
    bg: '#ecfeff',
    subtle: 'rgba(6, 182, 212, 0.16)',
    glow: 'rgba(244, 63, 94, 0.55)',
    gradient: 'linear-gradient(135deg, #a5f3fc 0%, #c4b5fd 40%, #fecdd3 75%, #fde047 100%)',
    heroGradientDark: 'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.32) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.32) 0%, transparent 50%), #000000',
    waveGradient: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 35%, #8b5cf6 70%, #f43f5e 100%)',
    previewGradient: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #f43f5e 100%)',
  },
  {
    id: 'twilight',
    label: 'Cosmic Twilight',
    primary: '#f97316',
    secondary: '#db2777',
    dark: '#c2410c',
    light: '#fb923c',
    bg: '#fff7ed',
    subtle: 'rgba(249, 115, 22, 0.16)',
    glow: 'rgba(219, 39, 119, 0.55)',
    gradient: 'linear-gradient(135deg, #fed7aa 0%, #fbcfe8 35%, #ddd6fe 70%, #bae6fd 100%)',
    heroGradientDark: 'radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.32) 0%, transparent 50%), radial-gradient(circle at 80% 25%, rgba(219, 39, 119, 0.32) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.28) 0%, transparent 50%), #000000',
    waveGradient: 'linear-gradient(90deg, #f97316 0%, #db2777 40%, #7c3aed 80%, #2563eb 100%)',
    previewGradient: 'linear-gradient(135deg, #f97316 0%, #db2777 45%, #7c3aed 85%, #2563eb 100%)',
  },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const userExplicit = localStorage.getItem('split_money_theme_explicit');
    if (userExplicit) {
      return localStorage.getItem('split_money_theme') || 'light';
    }
    return 'light';
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('split_money_accent') || 'amber';
  });

  const currentAccent = ACCENT_OPTIONS.find((o) => o.id === accent) || ACCENT_OPTIONS[0];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('split_money_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    document.documentElement.style.setProperty('--accent-primary', currentAccent.primary);
    document.documentElement.style.setProperty('--accent-hover', currentAccent.secondary);
    document.documentElement.style.setProperty('--accent-light', currentAccent.light);
    document.documentElement.style.setProperty('--accent-subtle', currentAccent.subtle);
    document.documentElement.style.setProperty('--accent-glow', currentAccent.glow);
    document.documentElement.style.setProperty('--border-accent', currentAccent.subtle);
    localStorage.setItem('split_money_accent', accent);
  }, [accent, currentAccent]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('split_money_theme_explicit', 'true');
      return next;
    });
  };

  const handleSetTheme = (newTheme) => {
    localStorage.setItem('split_money_theme_explicit', 'true');
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        toggleTheme,
        accent,
        setAccent,
        ACCENT_OPTIONS,
        currentAccent,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
