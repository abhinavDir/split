import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services/group.service';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useTheme } from '../context/ThemeContext';
import {
  ArrowLeft,
  FolderPlus,
  Plus,
  Trash2,
  Plane,
  Home,
  Heart,
  Briefcase,
  Tag,
  AlertCircle,
  X,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'Trip', icon: Plane },
  { label: 'Home', icon: Home },
  { label: 'Couple', icon: Heart },
  { label: 'Project', icon: Briefcase },
  { label: 'Other', icon: Tag },
];

export function CreateGroupPage() {
  const { refreshGroups, setActiveGroupId } = useExpenseGroup();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const navigate = useNavigate();

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
      const newGroupId = res?.data?.group?._id || res?.group?._id;
      if (newGroupId) {
        setActiveGroupId(newGroupId);
        navigate(`/groups/${newGroupId}`);
      } else {
        navigate('/groups');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to create envelope');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: isLight ? '#ffffff' : '#000000',
        color: isLight ? '#0f172a' : '#ffffff',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ================= 1. CLEAN FLAT TOPBAR ================= */}
      <header
        style={{
          width: '100%',
          height: '68px',
          borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: isLight ? '#ffffff' : '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(16px, 4vw, 36px)',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 900,
            cursor: 'pointer',
            padding: '8px 4px',
          }}
        >
          <ArrowLeft size={18} strokeWidth={2.8} />
          <span>Back</span>
        </button>

        <span
          style={{
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            backgroundColor: isLight ? 'rgba(0, 230, 118, 0.1)' : 'rgba(0, 230, 118, 0.14)',
            padding: '5px 12px',
            borderRadius: '9999px',
          }}
        >
          New Shared Envelope
        </span>

        <button
          type="button"
          onClick={() => navigate('/groups')}
          title="Close and exit"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: isLight ? '#f1f5f9' : '#141416',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </header>

      {/* ================= 2. FLAT MAIN FORM CONTENT ================= */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          padding: 'clamp(24px, 5vw, 44px) clamp(16px, 4vw, 24px) 100px clamp(16px, 4vw, 24px)',
          boxSizing: 'border-box',
        }}
      >
        {/* Title & Subtitle (Flat, No Card Box) */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 36px)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.035em',
              margin: '0 0 10px 0',
              lineHeight: 1.18,
            }}
          >
            Create New Shared Envelope
          </h1>
          <p
            style={{
              fontSize: 'clamp(13.5px, 2vw, 15px)',
              fontWeight: 700,
              color: isLight ? '#64748b' : '#9ca3af',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Establish a liquid pool for trips, shared spaces, dining, or syndicate ledgers.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'rgba(244, 63, 94, 0.1)',
              color: '#f43f5e',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 800,
              marginBottom: '24px',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Field 1: Envelope Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
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
                backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '9999px',
                padding: '14px 20px',
                color: 'var(--text-primary)',
                fontSize: '15px',
                fontWeight: 800,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.18)')}
            />
          </div>

          {/* Field 2: Category */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Category
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
              }}
            >
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
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '14px 6px',
                      borderRadius: '16px',
                      border: isSelected
                        ? '2px solid var(--accent-primary)'
                        : isLight
                        ? '1.5px solid #e2e8f0'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      backgroundColor: isSelected
                        ? isLight
                          ? 'rgba(0, 230, 118, 0.12)'
                          : 'rgba(0, 230, 118, 0.16)'
                        : isLight
                        ? '#f8fafc'
                        : '#0a0a0c',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Icon size={20} strokeWidth={isSelected ? 2.6 : 2} />
                    <span style={{ fontSize: '12px', fontWeight: 900 }}>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 3: Description */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Description (Optional)
            </label>
            <input
              type="text"
              placeholder="Short notes, trip dates, or expense rules"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '9999px',
                padding: '14px 20px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 800,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.18)')}
            />
          </div>

          {/* Field 4: Initial Collaborators */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label
                style={{
                  fontSize: '12px',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  margin: 0,
                }}
              >
                Initial Collaborators (Optional)
              </label>
              <button
                type="button"
                onClick={handleAddMemberRow}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} strokeWidth={3} />
                <span>Add collaborator</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {members.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Collaborator Name"
                    value={m.name}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    style={{
                      flex: '1 1 160px',
                      backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                      border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.18)',
                      borderRadius: '9999px',
                      padding: '12px 18px',
                      color: 'var(--text-primary)',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.18)')}
                  />
                  <input
                    type="email"
                    placeholder="collaborator@email.com"
                    value={m.email}
                    onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                    style={{
                      flex: '1.2 1 200px',
                      backgroundColor: isLight ? '#ffffff' : '#0a0a0c',
                      border: isLight ? '1.5px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.18)',
                      borderRadius: '9999px',
                      padding: '12px 18px',
                      color: 'var(--text-primary)',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.18)')}
                  />
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMemberRow(idx)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(244, 63, 94, 0.12)',
                        border: 'none',
                        color: '#f43f5e',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions (Flat Buttons) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '12px',
              paddingTop: '20px',
              borderTop: isLight ? '1px solid #f1f5f9' : '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              style={{
                padding: '12px 26px',
                borderRadius: '9999px',
                backgroundColor: isLight ? '#f1f5f9' : '#141416',
                border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.15)',
                color: 'var(--text-secondary)',
                fontWeight: 900,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 28px',
                borderRadius: '9999px',
                backgroundColor: 'var(--accent-primary, #00e676)',
                color: '#000000',
                fontWeight: 900,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(0, 230, 118, 0.35)',
                transition: 'transform 0.15s ease',
              }}
            >
              <FolderPlus size={17} strokeWidth={2.8} />
              <span>{isLoading ? 'Creating...' : 'Create Envelope ⚡'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
