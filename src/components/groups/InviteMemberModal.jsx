import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { groupService } from '../../services/group.service';
import { useExpenseGroup } from '../../context/ExpenseGroupContext';
import { UserPlus, Copy, Check, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

export function InviteMemberModal({ isOpen, onClose, group }) {
  const { refreshActiveGroup } = useExpenseGroup();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inviteLink = `${window.location.origin}/collab/${group?._id}`;

  const handleCopyLink = () => {
    if (group?.isCompleted) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide an email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await groupService.inviteMember(group._id, {
        email: email.trim(),
        name: name.trim(),
        upiId: upiId.trim(),
        role: 'MEMBER',
      });

      await refreshActiveGroup();
      setSuccess(`Invitation dispatched to ${email}`);
      setEmail('');
      setName('');
      setUpiId('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to invite collaborator');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Collaborators"
      subtitle={`Adding allocators to ${group?.name}`}
      maxWidth="500px"
    >
      {group?.isCompleted ? (
        <div
          style={{
            padding: '24px',
            backgroundColor: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#ffffff',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#f43f5e', marginBottom: '8px' }}>
            Envelope Finalized & Locked
          </h3>
          <p style={{ fontSize: '13px', color: '#8899a6', lineHeight: 1.5, margin: 0 }}>
            This envelope has been settled and finalized. New collaborators cannot be added to a closed ledger.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Shareable Link Box */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#040705',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <LinkIcon size={15} style={{ color: '#00e676' }} />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Instant Vault Invite Link
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#8899a6', marginBottom: '12px', margin: '0 0 12px 0' }}>
              Anyone with this link can join this envelope and access shared ledger entries.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={inviteLink}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '9999px',
                  padding: '10px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  padding: '10px 18px',
                  borderRadius: '9999px',
                  backgroundColor: copied ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
                  border: copied ? '1px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                  color: copied ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'center', position: 'relative', margin: '4px 0' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--bg-secondary)',
                padding: '0 12px',
                fontSize: '10px',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                fontWeight: 800,
                letterSpacing: '0.06em',
              }}
            >
              Or Invite via Email
            </span>
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                color: '#f43f5e',
                borderRadius: '12px',
                fontSize: '13px',
                border: '1px solid rgba(244, 63, 94, 0.3)',
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--accent-subtle)',
                color: 'var(--accent-primary)',
                borderRadius: '12px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid var(--border-accent)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Email Address *
              </label>
              <input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '9999px',
                  padding: '10px 18px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Friend's Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Maya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '9999px',
                  padding: '10px 18px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                UPI ID for settlements (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. maya@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '9999px',
                  padding: '10px 18px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                style={{
                  padding: '9px 18px',
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
                  padding: '9px 22px',
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
                <UserPlus size={15} strokeWidth={2.5} />
                <span>{isLoading ? 'Sending...' : 'Send Invitation ⚡'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
