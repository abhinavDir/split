import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { expenseService } from '../../services/expense.service';
import { useExpenseGroup } from '../../context/ExpenseGroupContext';
import { useAuth } from '../../context/AuthContext';
import { rupeesToPaise, formatPaise, paiseToRupees } from '../../utils/formatters';
import { MemberAvatar } from '../common/MemberAvatar';
import {
  Receipt,
  Utensils,
  Plane,
  Home,
  Film,
  ShoppingBag,
  MoreHorizontal,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'Food', icon: Utensils },
  { label: 'Transport', icon: Plane },
  { label: 'Stay', icon: Home },
  { label: 'Entertainment', icon: Film },
  { label: 'Groceries', icon: ShoppingBag },
  { label: 'Other', icon: MoreHorizontal },
];

export function AddExpenseModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { groups, activeGroupId, activeGroup, refreshActiveGroup, refreshGroups } = useExpenseGroup();

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [description, setDescription] = useState('');
  const [amountRupees, setAmountRupees] = useState('');
  const [category, setCategory] = useState('Food');
  const [payerId, setPayerId] = useState('');
  const [splitType, setSplitType] = useState('EQUAL'); // EQUAL, EXACT, PERCENTAGE
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [customValues, setCustomValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Target group for expense
  const currentGroup =
    groups.find((g) => g._id === selectedGroupId) || activeGroup || (groups.length > 0 ? groups[0] : null);

  // Initialize defaults on open or group change
  useEffect(() => {
    if (isOpen && currentGroup) {
      setSelectedGroupId(currentGroup._id);
      if (!payerId && user) {
        setPayerId(user._id);
      }
      if (currentGroup.members) {
        setSelectedParticipants(currentGroup.members.map((m) => m.userId));
      }
    }
  }, [isOpen, currentGroup?._id]);

  const handleGroupChange = (newGroupId) => {
    setSelectedGroupId(newGroupId);
    const grp = groups.find((g) => g._id === newGroupId);
    if (grp?.members) {
      setSelectedParticipants(grp.members.map((m) => m.userId));
      setPayerId(user?._id || grp.members[0]?.userId);
    }
  };

  const totalPaise = rupeesToPaise(amountRupees);

  const participantMembers = (currentGroup?.members || []).filter((m) =>
    selectedParticipants.includes(m.userId)
  );

  const calculatedShares = expenseService.calculateSplit(
    totalPaise,
    splitType,
    participantMembers,
    customValues
  );

  const sumOfSharesPaise = calculatedShares.reduce((sum, p) => sum + (p.sharePaise || 0), 0);
  const discrepancyPaise = totalPaise - sumOfSharesPaise;

  const toggleParticipant = (userId) => {
    if (selectedParticipants.includes(userId)) {
      if (selectedParticipants.length <= 1) {
        setError('A split must include at least one participant.');
        return;
      }
      setSelectedParticipants(selectedParticipants.filter((id) => id !== userId));
    } else {
      setSelectedParticipants([...selectedParticipants, userId]);
    }
    setError('');
  };

  const handleCustomValueChange = (userId, value) => {
    const num = parseFloat(value) || 0;
    if (splitType === 'EXACT') {
      setCustomValues((prev) => ({
        ...prev,
        [userId]: rupeesToPaise(num),
      }));
    } else {
      setCustomValues((prev) => ({
        ...prev,
        [userId]: num,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentGroup) {
      setError('Please select or create an envelope first.');
      return;
    }

    if (currentGroup.isCompleted || currentGroup.status === 'COMPLETED') {
      setError('This envelope is finalized and locked. New splits cannot be recorded.');
      return;
    }

    if (!description.trim()) {
      setError('Please describe what this split was for.');
      return;
    }

    if (totalPaise <= 0) {
      setError('Please enter a valid expense amount greater than ₹0.');
      return;
    }

    if (!payerId) {
      setError('Please select who fronted the expense.');
      return;
    }

    if (selectedParticipants.length === 0) {
      setError('Please select at least one collaborator to split with.');
      return;
    }

    if (splitType === 'EXACT' && discrepancyPaise !== 0) {
      setError(`Exact split does not add up to total. Discrepancy: ${formatPaise(Math.abs(discrepancyPaise))}`);
      return;
    }

    setIsLoading(true);

    try {
      const payer = currentGroup.members?.find((m) => m.userId === payerId);
      const res = await expenseService.createExpense(currentGroup._id, {
        description: description.trim(),
        amountPaise: totalPaise,
        currency: 'INR',
        category,
        payerId,
        payerName: payer?.name || user?.name || 'User',
        splitType,
        participants: calculatedShares,
      });

      if (res?.data?.expense) {
        window.dispatchEvent(new CustomEvent('expense:created', { detail: res.data.expense }));
      }
      await refreshActiveGroup();
      await refreshGroups();

      // Reset form
      setDescription('');
      setAmountRupees('');
      setCategory('Food');
      setCustomValues({});
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to record split');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record New Split ⚡"
      subtitle="Instantly allocate and split bills across active envelope members"
      maxWidth="580px"
    >
      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            color: '#f43f5e',
            borderRadius: '12px',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(244, 63, 94, 0.3)',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Envelope Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Target Envelope *
          </label>
          <select
            value={currentGroup?._id || ''}
            onChange={(e) => handleGroupChange(e.target.value)}
            required
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: '9999px',
              padding: '12px 18px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
          >
            {groups.map((g) => (
              <option key={g._id} value={g._id} disabled={g.isCompleted}>
                {g.name} {g.isCompleted ? '(✓ Completed - Locked)' : `(${g.members?.length || 0} members)`}
              </option>
            ))}
          </select>
          {currentGroup?.isCompleted && (
            <p style={{ color: '#f43f5e', fontSize: '12px', marginTop: '6px', fontWeight: 700 }}>
              ⚠️ This envelope is finalized and locked. New splits cannot be recorded.
            </p>
          )}
        </div>

        {/* Description & Amount in a 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Omakase Dinner, Yacht Fuel, Villa Booking"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                borderRadius: '9999px',
                padding: '12px 18px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Amount (₹) *
            </label>
            <input
              type="number"
              step="any"
              min="0.01"
              placeholder="0.00"
              value={amountRupees}
              onChange={(e) => setAmountRupees(e.target.value)}
              required
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                borderRadius: '9999px',
                padding: '12px 18px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Category
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.label;
              return (
                <button
                  type="button"
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '10px 4px',
                    borderRadius: '12px',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={16} />
                  <span style={{ fontSize: '10px', fontWeight: 700 }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paid By Dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Paid By
          </label>
          <select
            value={payerId}
            onChange={(e) => setPayerId(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-medium)',
              borderRadius: '9999px',
              padding: '12px 18px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
          >
            {currentGroup?.members?.map((m) => (
              <option key={m.userId} value={m.userId}>
                {m.name} {m.userId === user?._id ? '(You)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Split Type Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Split Allocation Model
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { id: 'EQUAL', label: 'Equally' },
              { id: 'EXACT', label: 'Exact Amounts' },
              { id: 'PERCENTAGE', label: 'Percentages' },
            ].map((st) => {
              const isActive = splitType === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  onClick={() => setSplitType(st.id)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '9999px',
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Participants Selection & Breakdown */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Split Between ({selectedParticipants.length} allocators)
            </span>
            {totalPaise > 0 && splitType === 'EQUAL' && (
              <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                {formatPaise(Math.floor(totalPaise / Math.max(1, selectedParticipants.length)))} / person
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {currentGroup?.members?.map((m) => {
              const isChecked = selectedParticipants.includes(m.userId);
              const share = calculatedShares.find((s) => s.userId === m.userId);

              return (
                <div
                  key={m.userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    backgroundColor: isChecked ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
                    border: isChecked ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleParticipant(m.userId)}
                      style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <MemberAvatar name={m.name} size="xs" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.name} {m.userId === user?._id ? '(You)' : ''}
                    </span>
                  </label>

                  {/* Split Input or Live Share */}
                  {isChecked && (
                    <div>
                      {splitType === 'EQUAL' && (
                        <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent-primary)' }}>
                          {formatPaise(share?.sharePaise || 0)}
                        </span>
                      )}

                      {splitType === 'EXACT' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>₹</span>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            placeholder="0"
                            value={customValues[m.userId] ? paiseToRupees(customValues[m.userId]) : ''}
                            onChange={(e) => handleCustomValueChange(m.userId, e.target.value)}
                            style={{
                              width: '85px',
                              padding: '5px 8px',
                              fontSize: '12px',
                              backgroundColor: 'var(--bg-input)',
                              border: '1px solid var(--border-medium)',
                              borderRadius: '6px',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          />
                        </div>
                      )}

                      {splitType === 'PERCENTAGE' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="%"
                            value={customValues[m.userId] || ''}
                            onChange={(e) => handleCustomValueChange(m.userId, e.target.value)}
                            style={{
                              width: '60px',
                              padding: '5px 8px',
                              fontSize: '12px',
                              backgroundColor: 'var(--bg-input)',
                              border: '1px solid var(--border-medium)',
                              borderRadius: '6px',
                              color: 'var(--text-primary)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          />
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px var(--accent-glow)',
            }}
          >
            <PlusCircle size={15} strokeWidth={2.5} />
            <span>{isLoading ? 'Saving Split...' : 'Record Split ⚡'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
