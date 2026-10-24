import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { groupService } from '../services/group.service';
import { useExpenseGroup } from '../context/ExpenseGroupContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Users,
  CheckCircle2,
  XCircle,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

export function CollabInvitePage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { refreshGroups, setActiveGroupId } = useExpenseGroup();

  const [collabInfo, setCollabInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadCollabInfo() {
      if (!groupId) return;
      setLoading(true);
      setError('');
      try {
        const res = await groupService.getCollabInfo(groupId);
        if (isMounted) {
          setCollabInfo(res.data?.collabInfo || res.collabInfo || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.error?.message ||
              err.message ||
              'Unable to load envelope invitation information.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadCollabInfo();
    return () => {
      isMounted = false;
    };
  }, [groupId]);

  const handleAccept = async () => {
    setActionLoading(true);
    setError('');
    try {
      await groupService.joinGroup(groupId);
      await refreshGroups();
      setActiveGroupId(groupId);
      setStatusMessage('Welcome! You have entered the envelope vault.');
      setTimeout(() => {
        navigate(`/groups/${groupId}`, { replace: true });
      }, 700);
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          'Failed to join envelope. It may be locked or no longer active.'
      );
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setError('');
    try {
      await groupService.rejectInvite(groupId);
      setStatusMessage('Invitation declined. Returning to vault...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 900);
    } catch (err) {
      navigate('/dashboard', { replace: true });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isLight ? '#f8fafc' : '#000000',
        }}
      >
        <div className="skeleton" style={{ width: '420px', maxWidth: '90%', height: '280px', borderRadius: '22px' }} />
      </div>
    );
  }

  if (error && !collabInfo) {
    return <Navigate to={user ? "/dashboard" : "/"} replace />;
  }

  const isCompleted = collabInfo?.isCompleted || collabInfo?.status === 'COMPLETED';
  const isAlreadyMember = collabInfo?.isMember;

  return (
    <div
      style={{
        maxWidth: '560px',
        margin: '50px auto',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          padding: '36px 32px',
          backgroundColor: isLight ? '#ffffff' : '#070c09',
          borderRadius: '24px',
          border: isCompleted
            ? (isLight ? '1px solid rgba(225, 29, 72, 0.3)' : '1px solid rgba(244, 63, 94, 0.35)')
            : (isLight ? '1px solid #e2e8f0' : '1px solid rgba(0, 230, 118, 0.35)'),
          boxShadow: isLight
            ? '0 10px 30px -5px rgba(0, 0, 0, 0.08)'
            : (isCompleted
                ? '0 20px 40px -15px rgba(244, 63, 94, 0.15)'
                : '0 20px 40px -15px rgba(0, 230, 118, 0.15)'),
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow backdrop */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: isCompleted
              ? 'radial-gradient(circle, rgba(244, 63, 94, 0.15) 0%, transparent 70%)'
              : (isLight
                  ? 'radial-gradient(circle, rgba(5, 150, 105, 0.1) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(0, 230, 118, 0.2) 0%, transparent 70%)'),
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              backgroundColor: isLight ? '#f1f5f9' : 'rgba(255, 255, 255, 0.06)',
              color: isLight ? '#475569' : '#9ca3af',
              letterSpacing: '0.04em',
            }}
          >
            {collabInfo?.category || 'Shared Envelope'}
          </span>
          {isCompleted ? (
            <span
              style={{
                backgroundColor: isLight ? 'rgba(225, 29, 72, 0.1)' : 'rgba(244, 63, 94, 0.15)',
                color: isLight ? '#e11d48' : '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
              }}
            >
              <Lock size={12} /> Trip Finalized & Locked
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 800,
                color: isLight ? '#059669' : '#00e676',
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: isLight ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 230, 118, 0.12)',
              }}
            >
              <Sparkles size={12} /> Direct Collab Invitation
            </span>
          )}
        </div>

        {/* Title & Creator */}
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: isLight ? '#0f172a' : '#ffffff', marginBottom: '8px', letterSpacing: '-0.02em', margin: 0 }}>
          {collabInfo?.name}
        </h1>
        {collabInfo?.description && (
          <p style={{ fontSize: '14px', color: isLight ? '#475569' : '#8899a6', margin: '8px 0 16px 0', lineHeight: 1.5 }}>
            {collabInfo.description}
          </p>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '14px 18px',
            backgroundColor: isLight ? '#f8fafc' : '#040705',
            borderRadius: '14px',
            margin: '20px 0 24px 0',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: isLight ? '#059669' : '#00e676' }} />
            <span style={{ fontSize: '13px', color: isLight ? '#64748b' : '#8899a6' }}>
              Organized by <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{collabInfo?.createdBy?.name}</strong>
            </span>
          </div>
          <div style={{ width: '1px', height: '16px', backgroundColor: isLight ? '#cbd5e1' : 'rgba(255, 255, 255, 0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} style={{ color: isLight ? '#94a3b8' : '#52665a' }} />
            <span style={{ fontSize: '13px', color: isLight ? '#64748b' : '#8899a6' }}>
              <strong style={{ color: isLight ? '#0f172a' : '#ffffff' }}>{collabInfo?.memberCount || 1}</strong> members
            </span>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: isLight ? 'rgba(225, 29, 72, 0.08)' : 'rgba(244, 63, 94, 0.12)',
              color: isLight ? '#e11d48' : '#f43f5e',
              borderRadius: '12px',
              fontSize: '13px',
              marginBottom: '20px',
              border: isLight ? '1px solid rgba(225, 29, 72, 0.25)' : '1px solid rgba(244, 63, 94, 0.3)',
            }}
          >
            {error}
          </div>
        )}

        {statusMessage && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: isLight ? 'rgba(5, 150, 105, 0.1)' : 'rgba(0, 230, 118, 0.12)',
              color: isLight ? '#059669' : '#00e676',
              borderRadius: '12px',
              fontSize: '13px',
              marginBottom: '20px',
              border: isLight ? '1px solid rgba(5, 150, 105, 0.25)' : '1px solid rgba(0, 230, 118, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Scenario 1: Completed / Finalized Trip */}
        {isCompleted ? (
          <div
            style={{
              padding: '20px',
              backgroundColor: isLight ? 'rgba(225, 29, 72, 0.05)' : 'rgba(244, 63, 94, 0.08)',
              borderRadius: '16px',
              border: isLight ? '1px solid rgba(225, 29, 72, 0.2)' : '1px solid rgba(244, 63, 94, 0.25)',
              textAlign: 'center',
            }}
          >
            <Lock size={28} style={{ color: isLight ? '#e11d48' : '#f43f5e', margin: '0 auto 10px auto' }} />
            <h4 style={{ color: isLight ? '#0f172a' : '#ffffff', fontSize: '15px', fontWeight: 800, marginBottom: '6px' }}>
              This Envelope has Closed
            </h4>
            <p style={{ color: isLight ? '#64748b' : '#8899a6', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              The organizers have finalized all accounts and locked the settlement ledger. No new collaborators can join this envelope.
            </p>
            <div style={{ marginTop: '18px' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? '#f1f5f9' : '#0a120e',
                  border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isLight ? '#0f172a' : '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Return to Vault
              </button>
            </div>
          </div>
        ) : isAlreadyMember ? (
          /* Scenario 2: Already a Member */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <p style={{ fontSize: '14px', color: isLight ? '#059669' : '#00e676', marginBottom: '16px', fontWeight: 700 }}>
              ✓ You are already a member of this envelope.
            </p>
            <button
              onClick={() => navigate(`/groups/${groupId}`)}
              style={{
                padding: '11px 24px',
                borderRadius: '9999px',
                backgroundColor: isLight ? '#059669' : '#00e676',
                color: isLight ? '#ffffff' : '#000000',
                fontWeight: 800,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isLight ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 0 20px rgba(0, 230, 118, 0.35)',
              }}
            >
              <span>Open Envelope Ledger</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          /* Scenario 3: Open Invitation */
          <div>
            <p
              style={{
                fontSize: '13px',
                color: isLight ? '#475569' : '#8899a6',
                lineHeight: 1.5,
                marginBottom: '24px',
              }}
            >
              Entering this envelope allows you to record shared splits, view itemized receipts, and settle debt with 1-tap peer-to-peer UPI transfers.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <button
                onClick={handleReject}
                disabled={actionLoading}
                style={{
                  padding: '11px 20px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? '#ffffff' : '#0a120e',
                  border: isLight ? '1px solid #fecdd3' : '1px solid rgba(244, 63, 94, 0.3)',
                  color: isLight ? '#e11d48' : '#f43f5e',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <XCircle size={15} />
                <span>Decline</span>
              </button>

              <button
                onClick={handleAccept}
                disabled={actionLoading}
                style={{
                  padding: '11px 20px',
                  borderRadius: '9999px',
                  backgroundColor: isLight ? '#059669' : '#00e676',
                  color: isLight ? '#ffffff' : '#000000',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isLight ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 0 20px rgba(0, 230, 118, 0.35)',
                }}
              >
                <CheckCircle2 size={16} strokeWidth={2.5} />
                <span>{actionLoading ? 'Entering...' : 'Accept & Enter Vault ⚡'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
