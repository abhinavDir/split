import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { groupService } from '../../services/group.service';
import { useExpenseGroup } from '../../context/ExpenseGroupContext';
import { Users, Plus, Trash2, Plane, Home, Heart, Briefcase, Tag, FolderPlus } from 'lucide-react';

const CATEGORIES = [
  { label: 'Trip', icon: Plane },
  { label: 'Home', icon: Home },
  { label: 'Couple', icon: Heart },
  { label: 'Project', icon: Briefcase },
  { label: 'Other', icon: Tag },
];

export function CreateGroupModal({ isOpen, onClose }) {
  const { refreshGroups, setActiveGroupId } = useExpenseGroup();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Trip');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([{ email: '', name: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddMemberRow = () => {
    setMembers([...members, { email: '', name: '' }]);
  };

  const handleRemoveMemberRow = (index) => {
    setMembers(members.filter((_, idx) => idx !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide an envelope name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const validMembers = members.filter((m) => m.email.trim() !== '');
      const res = await groupService.createGroup({
        name: name.trim(),
        category,
        description: description.trim(),
        initialMembers: validMembers,
      });

      await refreshGroups();
      if (res?.data?.group?._id) {
        setActiveGroupId(res.data.group._id);
      }

      // Reset form
      setName('');
      setDescription('');
      setCategory('Trip');
      setMembers([{ email: '', name: '' }]);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create envelope');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Shared Envelope"
      subtitle="Establish a liquid pool for trips, shared spaces, dining, or syndicate ledgers"
      maxWidth="560px"
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
            border: '1px solid rgba(244, 63, 94, 0.3)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Envelope Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Goa Trip, Flat 402, Weekend Outing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '9999px',
              padding: '12px 18px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 800,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Category
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
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
                    gap: '6px',
                    padding: '12px 6px',
                    borderRadius: '14px',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={18} />
                  <span style={{ fontSize: '11px', fontWeight: 700 }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Description (Optional)
          </label>
          <input
            type="text"
            placeholder="Short notes, trip dates, or expense rules"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1.5px solid var(--border-medium)',
              borderRadius: '9999px',
              padding: '12px 18px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontWeight: 800,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
          />
        </div>

        {/* Initial Members */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
              Initial Collaborators (Optional)
            </label>
            <button
              type="button"
              onClick={handleAddMemberRow}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Plus size={13} strokeWidth={2.5} />
              <span>Add collaborator</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {members.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Collaborator Name"
                  value={m.name}
                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '9999px',
                    padding: '10px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
                />
                <input
                  type="email"
                  placeholder="collaborator@email.com"
                  value={m.email}
                  onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                  style={{
                    flex: 1.2,
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '9999px',
                    padding: '10px 16px',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMemberRow(idx)}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(244, 63, 94, 0.12)',
                      border: 'none',
                      color: '#f43f5e',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            style={{
              padding: '10px 22px',
              borderRadius: '9999px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontWeight: 800,
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
              backgroundColor: 'var(--accent-primary, #00e676)',
              color: '#000000',
              fontWeight: 900,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(0, 230, 118, 0.35)',
            }}
          >
            <FolderPlus size={16} strokeWidth={2.5} />
            <span>{isLoading ? 'Creating...' : 'Create Envelope ⚡'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
