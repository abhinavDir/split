import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronDown,
  SlidersHorizontal,
  X,
  Check,
  Compass,
  Briefcase,
  Wallet,
} from 'lucide-react';
import { PeekMascot } from '../components/dashboard/OroveraMascot';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'stay', label: 'Stay', icon: '🏨' },
  { id: 'food', label: 'Food', icon: '🍔' },
  { id: 'other', label: 'Other', icon: '🏷️' },
];

const createCleanInitialTrip = () => ({
  id: `trip-${Date.now()}`,
  name: 'My Solo Trip',
  budget: 0,
  expenses: [],
});

export function SoloTripPage() {
  const { user } = useAuth();
  const { theme, currentAccent, accent } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();

  // Storage key is tied to the logged-in user so every clean login starts at zero
  const storageKey = user?._id ? `split_solo_trips_${user._id}` : 'split_solo_trips_guest';
  const activeKey = user?._id ? `split_solo_active_${user._id}` : 'split_solo_active_guest';

  // Multi-Trip State: Starts completely clean (0 budget, 0 expenses) for any clean login
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [createCleanInitialTrip()];
  });

  const [activeTripId, setActiveTripId] = useState(() => {
    return localStorage.getItem(activeKey) || trips[0]?.id;
  });

  // Whenever user changes or logs in clean, sync active trip
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTrips(parsed);
          const savedActive = localStorage.getItem(activeKey);
          setActiveTripId(savedActive || parsed[0]?.id);
          return;
        }
      }
    } catch {
      // fallback
    }
    const clean = [createCleanInitialTrip()];
    setTrips(clean);
    setActiveTripId(clean[0].id);
  }, [storageKey, activeKey]);

  // Modal for setting manual budget and managing different trips
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState('budget'); // 'budget' | 'new'
  const [showTripPickerDropdown, setShowTripPickerDropdown] = useState(false);

  // Active Trip resolution
  const activeTrip = useMemo(() => {
    return trips.find((t) => t.id === activeTripId) || trips[0] || createCleanInitialTrip();
  }, [trips, activeTripId]);

  // Form states for modal
  const [manualBudgetValue, setManualBudgetValue] = useState((activeTrip.budget || 0).toString());
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripBudget, setNewTripBudget] = useState('0');

  // Sync manual budget input when active trip changes
  useEffect(() => {
    setManualBudgetValue((activeTrip.budget || 0).toString());
  }, [activeTrip.id, activeTrip.budget]);

  // Category filter
  const [filterCategory, setFilterCategory] = useState('all');

  // Inline Quick-add expense states
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('food');

  // Persistence per user
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(trips));
  }, [trips, storageKey]);

  useEffect(() => {
    if (activeTripId) {
      localStorage.setItem(activeKey, activeTripId);
    }
  }, [activeTripId, activeKey]);

  // Real calculations for active trip
  const expenses = activeTrip.expenses || [];
  const budget = Number(activeTrip.budget) || 0;

  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [expenses]);

  const remaining = budget - totalSpent;
  const isOver = remaining < 0;

  // Split whole and decimal for typography
  const wholeNumber = Math.floor(Math.abs(totalSpent)).toLocaleString('en-IN');
  const decimalNumber = (Math.round((Math.abs(totalSpent) % 1) * 100))
    .toString()
    .padStart(2, '0');

  // Filtered expenses
  const displayedExpenses = useMemo(() => {
    if (filterCategory === 'all') return expenses;
    return expenses.filter((e) => e.category === filterCategory);
  }, [expenses, filterCategory]);

  // Add expense to active trip
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || Number(newAmount) <= 0) return;

    const item = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      amount: parseFloat(newAmount),
      category: newCategory,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    };

    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id === activeTrip.id) {
          return {
            ...t,
            expenses: [item, ...(t.expenses || [])],
          };
        }
        return t;
      })
    );

    setNewTitle('');
    setNewAmount('');
  };

  // Delete expense from active trip
  const handleDeleteExpense = (id) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id === activeTrip.id) {
          return {
            ...t,
            expenses: (t.expenses || []).filter((e) => e.id !== id),
          };
        }
        return t;
      })
    );
  };

  // Save manual budget for active trip
  const handleSaveManualBudget = (e) => {
    e.preventDefault();
    const val = parseFloat(manualBudgetValue);
    if (isNaN(val) || val <= 0) return;

    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id === activeTrip.id) {
          return { ...t, budget: val };
        }
        return t;
      })
    );
    setShowSettingsModal(false);
  };

  // Create a separate new trip with its own budget
  const handleCreateNewTrip = (e) => {
    e.preventDefault();
    if (!newTripTitle.trim()) return;

    const newTrip = {
      id: `trip-${Date.now()}`,
      name: newTripTitle.trim(),
      budget: parseFloat(newTripBudget) || 15000,
      expenses: [],
    };

    setTrips([newTrip, ...trips]);
    setActiveTripId(newTrip.id);
    setNewTripTitle('');
    setShowSettingsModal(false);
    setShowTripPickerDropdown(false);
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: isLight ? '#ffffff' : '#000000',
        color: isLight ? '#0f172a' : '#ffffff',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* =========================================================================
          UPPER HALF: MATCHES THEME COLOR + TOPOGRAPHIC ARTWORK + ORGANIC WAVE
          ========================================================================= */}
      <div
        style={{
          width: '100%',
          background: isLight
            ? (currentAccent?.waveGradient || currentAccent?.gradient || 'linear-gradient(180deg, #ffca28 0%, #ffbe2b 100%)')
            : (currentAccent?.heroGradientDark || 'radial-gradient(circle at 85% 20%, rgba(245, 158, 11, 0.18) 0%, transparent 60%), #0c0e12'),
          color: isLight ? '#1f2937' : '#ffffff',
          position: 'relative',
          paddingTop: '20px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'background 0.3s ease',
        }}
      >
        {/* ================= ARTWORK IN BACKGROUND (Topographic Wave Contours) ================= */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: isLight ? 0.35 : 0.18,
          }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 800 400"
        >
          <circle cx="680" cy="80" r="180" fill={isLight ? '#ffffff' : currentAccent?.primary || '#f59e0b'} opacity={isLight ? 0.4 : 0.15} filter="blur(40px)" />
          <circle cx="120" cy="220" r="140" fill={isLight ? '#ffffff' : '#38bdf8'} opacity={isLight ? 0.3 : 0.08} filter="blur(30px)" />
          <path d="M-50 90 C 150 160, 300 20, 520 110 C 680 180, 780 70, 850 130" stroke={isLight ? '#ffffff' : currentAccent?.primary || '#f59e0b'} strokeWidth="1.6" fill="none" />
          <path d="M-50 140 C 180 220, 330 60, 550 160 C 700 230, 800 120, 850 180" stroke={isLight ? '#ffffff' : '#ffffff'} strokeWidth="1.2" strokeDasharray="6 6" fill="none" opacity="0.6" />
          <path d="M-50 190 C 200 280, 360 110, 580 210 C 720 280, 820 170, 850 230" stroke={isLight ? '#ffffff' : currentAccent?.primary || '#f59e0b'} strokeWidth="1.8" fill="none" />
          <path d="M-50 240 C 220 340, 390 160, 610 260 C 740 330, 830 220, 850 280" stroke={isLight ? '#ffffff' : '#ffffff'} strokeWidth="1.2" strokeDasharray="4 8" fill="none" opacity="0.7" />
          <circle cx="700" cy="110" r="32" stroke={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
          <line x1="700" y1="70" x2="700" y2="150" stroke={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
          <line x1="660" y1="110" x2="740" y2="110" stroke={isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" />
        </svg>

        {/* Content Container */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 10 }}>
          {/* Top Bar: Back | Trip Switcher Pill | Manual Budget & Trip Settings Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.75)' : '#181b20',
                backdropFilter: 'blur(10px)',
                border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.14)',
                color: isLight ? '#0f172a' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <ArrowLeft size={18} strokeWidth={2.8} />
            </button>

            {/* Trip Selector Capsule Pill with Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowTripPickerDropdown(!showTripPickerDropdown)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.75)' : '#181b20',
                  backdropFilter: 'blur(12px)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.9)' : '1px solid rgba(255, 255, 255, 0.16)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                }}
              >
                <span>🎒 {activeTrip.name}</span>
                <ChevronDown size={14} strokeWidth={3} />
              </button>

              {/* Dropdown Menu for Switching Trips */}
              {showTripPickerDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '240px',
                    maxWidth: 'calc(100vw - 32px)',
                    maxHeight: '280px',
                    overflowY: 'auto',
                    backgroundColor: isLight ? '#ffffff' : '#111417',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.16)',
                    borderRadius: '16px',
                    padding: '6px',
                    zIndex: 100,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ padding: '4px 8px 6px 8px', fontSize: '10.5px', fontWeight: 800, color: isLight ? '#64748b' : '#94a3b8', letterSpacing: '0.04em' }}>
                    YOUR SOLO TRIPS
                  </div>
                  {trips.map((t) => {
                    const isSelected = t.id === activeTrip.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setActiveTripId(t.id);
                          setShowTripPickerDropdown(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          backgroundColor: isSelected
                            ? (isLight ? '#f1f5f9' : '#1c2229')
                            : 'transparent',
                          color: isLight ? '#0f172a' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '2px',
                        }}
                      >
                        <div style={{ minWidth: 0, paddingRight: '6px' }}>
                          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                          <div style={{ fontSize: '10.5px', color: isLight ? '#64748b' : '#94a3b8', fontWeight: 600 }}>
                            Budget: ₹{Number(t.budget).toLocaleString('en-IN')}
                          </div>
                        </div>
                        {isSelected && <Check size={14} strokeWidth={3} color={currentAccent?.primary || '#f59e0b'} />}
                      </div>
                    );
                  })}

                  <div
                    onClick={() => {
                      setShowTripPickerDropdown(false);
                      setSettingsModalTab('new');
                      setShowSettingsModal(true);
                    }}
                    style={{
                      marginTop: '4px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      fontSize: '11.5px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      borderTop: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: currentAccent?.primary || '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Plus size={14} strokeWidth={3} />
                    <span>+ Create New Trip</span>
                  </div>
                </div>
              )}
            </div>

            {/* Set Manual Budget & Trip Settings Button (Replaced Share Icon) */}
            <button
              onClick={() => {
                setSettingsModalTab('budget');
                setShowSettingsModal(true);
              }}
              title="Set Manual Budget & Add Trips"
              style={{
                padding: '7px 12px',
                borderRadius: '9999px',
                backgroundColor: isLight ? 'rgba(255, 255, 255, 0.85)' : '#181b20',
                backdropFilter: 'blur(10px)',
                border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                color: isLight ? '#0f172a' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 900,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <SlidersHorizontal size={14} strokeWidth={2.8} />
              <span>Budget</span>
            </button>
          </div>

          {/* Center Main Big Spend Display */}
          <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '18px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: isLight ? '#715509' : '#9ca3af',
              }}
            >
              Total Solo Spend
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '2px',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(44px, 8vw, 68px)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  color: isLight ? '#0f172a' : '#ffffff',
                }}
              >
                {wholeNumber}
              </span>
              <span
                style={{
                  fontSize: 'clamp(22px, 3.8vw, 32px)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: isLight ? '#0f172a' : '#ffffff',
                }}
              >
                .{decimalNumber} ₹
              </span>
            </div>

            {/* Floating 2-Stat Pill: Budget & Left (Click opens manual budget setting directly) */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
              <div
                onClick={() => {
                  setSettingsModalTab('budget');
                  setShowSettingsModal(true);
                }}
                title="Click to set manual budget"
                style={{
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : '#181b20',
                  backdropFilter: 'blur(12px)',
                  border: isLight ? '1px solid rgba(255, 255, 255, 0.95)' : '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: '9999px',
                  padding: '7px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.15s ease',
                }}
              >
                {budget === 0 ? (
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: isLight ? '#0f172a' : '#ffffff' }}>
                    Budget: <span style={{ color: currentAccent?.primary || '#f59e0b', textDecoration: 'underline' }}>Set Budget (₹0)</span>
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: '12.5px', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8' }}>
                      Budget: <b style={{ color: isLight ? '#0f172a' : '#ffffff' }}>₹{budget.toLocaleString('en-IN')}</b>
                    </span>
                    <span style={{ color: isLight ? '#cbd5e1' : '#334155' }}>|</span>
                    <span
                      style={{
                        fontSize: '12.5px',
                        fontWeight: 900,
                        color: isOver ? '#ef4444' : '#10b981',
                      }}
                    >
                      {isOver ? `Over by ₹${Math.abs(remaining).toLocaleString('en-IN')}` : `₹${remaining.toLocaleString('en-IN')} Left`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= 4. ORGANIC SNAKE WAVE TRANSITION ================= */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '66px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            overflow: 'hidden',
            marginTop: '10px',
          }}
        >
          {/* Peeking Mascot Sitting right on the curve */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              zIndex: 12,
              filter: isLight
                ? 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.12))'
                : 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.6))',
            }}
          >
            <PeekMascot size={58} />
          </div>

          {/* Organic Snake Wave SVG */}
          <svg
            viewBox="0 0 400 66"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '66px', display: 'block', marginBottom: '-1px' }}
            preserveAspectRatio="none"
          >
            <path
              d="M0 38 C45 18 95 12 145 28 C195 44 245 48 295 24 C340 4 375 14 400 22 L400 66 L0 66 Z"
              fill={isLight ? 'rgba(255, 255, 255, 0.40)' : 'rgba(255, 255, 255, 0.10)'}
            />
            <path
              d="M0 48 C60 26 120 48 180 34 C230 20 280 8 340 22 C370 28 390 26 400 24 L400 66 L0 66 Z"
              fill={isLight ? 'rgba(255, 255, 255, 0.60)' : 'rgba(255, 255, 255, 0.16)'}
            />
            <path
              d="M0 32 C55 12 110 46 175 36 C220 28 260 10 315 16 C355 20 385 36 400 42 L400 66 L0 66 Z"
              fill={isLight ? '#ffffff' : '#000000'}
            />
          </svg>
        </div>
      </div>

      {/* =========================================================================
          LOWER HALF: 100% FLAT, MINIMAL STANDARD LEDGER
          ========================================================================= */}
      <div
        style={{
          flex: 1,
          maxWidth: '740px',
          width: '100%',
          margin: '0 auto',
          padding: '16px 20px 80px 20px',
          boxSizing: 'border-box',
          backgroundColor: isLight ? '#ffffff' : '#000000',
        }}
      >
        {/* ================= SIMPLE INLINE ADD BAR ================= */}
        <div style={{ marginBottom: '20px' }}>
          <form
            onSubmit={handleAddExpense}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {/* Title Input */}
            <input
              type="text"
              required
              placeholder="What did you spend on? (e.g. Bus, Hostel, Cafe)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                flex: '2 1 180px',
                padding: '11px 14px',
                borderRadius: '12px',
                border: isLight ? '1.5px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.16)',
                backgroundColor: isLight ? '#f8fafc' : '#111417',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                outline: 'none',
              }}
            />

            {/* Amount Input */}
            <input
              type="number"
              step="any"
              required
              placeholder="₹ Amount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              style={{
                flex: '1 1 100px',
                padding: '11px 14px',
                borderRadius: '12px',
                border: isLight ? '1.5px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.16)',
                backgroundColor: isLight ? '#f8fafc' : '#111417',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '14px',
                fontWeight: 900,
                outline: 'none',
              }}
            />

            {/* Category Select */}
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                padding: '11px 10px',
                borderRadius: '12px',
                border: isLight ? '1.5px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.16)',
                backgroundColor: isLight ? '#f8fafc' : '#111417',
                color: isLight ? '#0f172a' : '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="travel">✈️ Travel</option>
              <option value="stay">🏨 Stay</option>
              <option value="food">🍔 Food</option>
              <option value="other">🏷️ Other</option>
            </select>

            {/* Add Button */}
            <button
              type="submit"
              style={{
                padding: '11px 18px',
                borderRadius: '12px',
                backgroundColor: isLight ? '#000000' : (currentAccent?.primary || '#f59e0b'),
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 900,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isLight ? '0 2px 8px rgba(0,0,0,0.1)' : `0 4px 14px ${currentAccent?.glow || 'rgba(245, 158, 11, 0.3)'}`,
              }}
            >
              <Plus size={16} strokeWidth={3} />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* ================= MINIMAL FILTER PILLS ================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '14px',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSel = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  border: isSel ? 'none' : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)'),
                  backgroundColor: isSel
                    ? (isLight ? '#000000' : (currentAccent?.primary || '#f59e0b'))
                    : 'transparent',
                  color: isSel
                    ? '#ffffff'
                    : (isLight ? '#64748b' : '#94a3b8'),
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>

        {/* ================= FLAT EXPENSE LIST ================= */}
        {displayedExpenses.length === 0 ? (
          <div
            style={{
              padding: '36px 16px',
              textAlign: 'center',
              color: isLight ? '#94a3b8' : '#64748b',
            }}
          >
            <Compass size={28} style={{ margin: '0 auto 6px auto', opacity: 0.4 }} />
            <div style={{ fontSize: '13px', fontWeight: 800 }}>No expenses in this trip</div>
            <div style={{ fontSize: '11.5px', marginTop: '2px' }}>Type above and tap Add to log your solo spend.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayedExpenses.map((exp) => {
              const catObj = CATEGORIES.find((c) => c.id === exp.category) || CATEGORIES[4];
              return (
                <div
                  key={exp.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    backgroundColor: isLight ? '#f8fafc' : '#0c0f12',
                    border: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {/* Left: Emoji + Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <span style={{ fontSize: '18px' }}>{catObj.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 800,
                          color: isLight ? '#0f172a' : '#ffffff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {exp.title}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: isLight ? '#94a3b8' : '#64748b' }}>
                        {exp.date} · {catObj.label}
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Delete Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '14.5px',
                        fontWeight: 900,
                        color: isLight ? '#0f172a' : '#ffffff',
                      }}
                    >
                      ₹{Number(exp.amount).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      title="Delete item"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isLight ? '#cbd5e1' : '#475569',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = isLight ? '#cbd5e1' : '#475569')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: SET MANUAL BUDGET & ADD SEPARATE TRIPS (COMPACT & RESPONSIVE)
          ========================================================================= */}
      {showSettingsModal && (
        <div
          onClick={() => setShowSettingsModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: isLight ? 'rgba(15, 23, 42, 0.45)' : 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '12px',
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: isLight ? '#ffffff' : '#111417',
              border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '20px',
              padding: '16px 18px',
              maxWidth: '340px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
              boxSizing: 'border-box',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Wallet size={16} color={currentAccent?.primary || '#f59e0b'} />
                <h3 style={{ fontSize: '15px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', margin: 0 }}>
                  Trip Settings
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isLight ? '#64748b' : '#94a3b8',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Segmented Pill Tab Switcher */}
            <div
              style={{
                display: 'flex',
                backgroundColor: isLight ? '#f1f5f9' : '#181b20',
                borderRadius: '10px',
                padding: '3px',
                marginBottom: '14px',
                gap: '2px',
              }}
            >
              <button
                type="button"
                onClick={() => setSettingsModalTab('budget')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: settingsModalTab === 'budget' ? (isLight ? '#ffffff' : '#262d37') : 'transparent',
                  color: settingsModalTab === 'budget' ? (isLight ? '#0f172a' : '#ffffff') : (isLight ? '#64748b' : '#94a3b8'),
                  boxShadow: settingsModalTab === 'budget' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                🎯 Set Budget
              </button>
              <button
                type="button"
                onClick={() => setSettingsModalTab('new')}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: settingsModalTab === 'new' ? (isLight ? '#ffffff' : '#262d37') : 'transparent',
                  color: settingsModalTab === 'new' ? (isLight ? '#0f172a' : '#ffffff') : (isLight ? '#64748b' : '#94a3b8'),
                  boxShadow: settingsModalTab === 'new' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                ➕ New Trip
              </button>
            </div>

            {/* TAB 1: SET MANUAL BUDGET */}
            {settingsModalTab === 'budget' ? (
              <div>
                {/* Active Trip Info Strip */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isLight ? '#f8fafc' : '#16191f',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    marginBottom: '12px',
                    border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ minWidth: 0, marginRight: '8px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: isLight ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Current Trip
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      🎒 {activeTrip.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: isLight ? '#94a3b8' : '#64748b', textTransform: 'uppercase' }}>
                      Current
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: 900, color: currentAccent?.primary || '#f59e0b' }}>
                      ₹{budget.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveManualBudget} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Set Manual Budget Amount
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', left: '12px', fontSize: '14px', fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8' }}>
                        ₹
                      </span>
                      <input
                        type="number"
                        step="any"
                        required
                        value={manualBudgetValue}
                        onChange={(e) => setManualBudgetValue(e.target.value)}
                        placeholder="e.g. 25000"
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '8px 12px 8px 26px',
                          borderRadius: '10px',
                          border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.16)',
                          backgroundColor: isLight ? '#ffffff' : '#0c0f12',
                          color: isLight ? '#0f172a' : '#ffffff',
                          fontSize: '14px',
                          fontWeight: 900,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Preset Amount Buttons */}
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setManualBudgetValue(amt.toString())}
                        style={{
                          flex: 1,
                          padding: '5px 0',
                          borderRadius: '8px',
                          border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: isLight ? '#f8fafc' : '#181b20',
                          color: isLight ? '#475569' : '#cbd5e1',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '10px',
                      backgroundColor: currentAccent?.primary || '#f59e0b',
                      color: accent === 'amber' ? '#000000' : '#ffffff',
                      fontSize: '12px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '2px',
                    }}
                  >
                    Save Budget
                  </button>
                </form>

                <div
                  onClick={() => setSettingsModalTab('new')}
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '11px',
                    color: currentAccent?.primary || '#f59e0b',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  + Want a separate new trip? Tap here →
                </div>
              </div>
            ) : (
              /* TAB 2: CREATE SEPARATE NEW TRIP */
              <div>
                <form onSubmit={handleCreateNewTrip} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Trip Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Goa, Ladakh, Manali"
                      value={newTripTitle}
                      onChange={(e) => setNewTripTitle(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.16)',
                        backgroundColor: isLight ? '#ffffff' : '#0c0f12',
                        color: isLight ? '#0f172a' : '#ffffff',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 800, color: isLight ? '#475569' : '#94a3b8', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Initial Budget (₹)
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <span style={{ position: 'absolute', left: '12px', fontSize: '13px', fontWeight: 900, color: isLight ? '#64748b' : '#94a3b8' }}>
                        ₹
                      </span>
                      <input
                        type="number"
                        step="any"
                        required
                        placeholder="e.g. 15000"
                        value={newTripBudget}
                        onChange={(e) => setNewTripBudget(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '8px 12px 8px 24px',
                          borderRadius: '10px',
                          border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.16)',
                          backgroundColor: isLight ? '#ffffff' : '#0c0f12',
                          color: isLight ? '#0f172a' : '#ffffff',
                          fontSize: '13px',
                          fontWeight: 800,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '9px',
                      borderRadius: '10px',
                      backgroundColor: isLight ? '#000000' : '#ffffff',
                      color: isLight ? '#ffffff' : '#000000',
                      fontSize: '12px',
                      fontWeight: 900,
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '4px',
                    }}
                  >
                    + Create Separate Trip
                  </button>
                </form>

                <div
                  onClick={() => setSettingsModalTab('budget')}
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                    fontSize: '11px',
                    color: isLight ? '#64748b' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  ← Back to active trip budget
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
