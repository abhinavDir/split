import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { MemberAvatar } from '../common/MemberAvatar';
import { formatPaise, paiseToRupees } from '../../utils/formatters';
import { buildUpiUrl } from '../../utils/upiHelper';
import { settlementService } from '../../services/settlement.service';
import { authService } from '../../services/auth.service';
import {
  Smartphone,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  QrCode,
  Info,
  ExternalLink,
  Clock,
  Edit2,
} from 'lucide-react';

export function SettleDebtModal({ isOpen, onClose, transfer, settlementId, onPaymentRecorded }) {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiReference, setUpiReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverIntent, setServerIntent] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [showAppOpenedHint, setShowAppOpenedHint] = useState(false);
  const [livePayeeUpi, setLivePayeeUpi] = useState('');
  const [customPayeeUpi, setCustomPayeeUpi] = useState('');
  const [isEditingPayeeUpi, setIsEditingPayeeUpi] = useState(false);

  const transferId = transfer?._id || transfer?.id;
  const payeeId = transfer?.to?.id || transfer?.to?._id;
  const payeeName = serverIntent?.receiverName || transfer?.to?.name || 'Group Member';
  const amountRupees = paiseToRupees(transfer?.amountPaise || 0).toFixed(2);
  const note = serverIntent?.note || `Settlement for ${payeeName}`;

  // Fetch live recipient UPI from user profile to always show freshest UPI ID
  useEffect(() => {
    async function fetchPayeeLiveUpi() {
      if (isOpen && payeeId) {
        try {
          const res = await authService.getUserUpi(payeeId);
          if (res?.data?.user?.upiId) {
            setLivePayeeUpi(res.data.user.upiId);
          }
        } catch (e) {
          // ignore, fall back to transfer.to.upiId
        }
      }
    }
    fetchPayeeLiveUpi();
  }, [isOpen, payeeId]);

  // Fetch server-validated payment intent if settlementId is provided
  useEffect(() => {
    async function fetchIntent() {
      if (isOpen && settlementId && transferId) {
        setLoadingIntent(true);
        setErrorMessage('');
        try {
          const res = await settlementService.getPaymentIntent(settlementId, transferId);
          if (res?.data?.paymentIntent) {
            setServerIntent(res.data.paymentIntent);
          }
        } catch (err) {
          // If server returns error, display message
          const msg = err.response?.data?.error?.message || err.message;
          setErrorMessage(msg);
        } finally {
          setLoadingIntent(false);
        }
      }
    }
    fetchIntent();
  }, [isOpen, settlementId, transferId]);

  if (!transfer) return null;

  // Compute effective payee UPI ID (custom entered > server validated > live user profile > transfer snapshot)
  const payeeUpi = (
    customPayeeUpi.trim() ||
    serverIntent?.receiverUpiId ||
    livePayeeUpi ||
    transfer?.to?.upiId ||
    ''
  ).toLowerCase().trim();

  // Always generate 100% NPCI P2P-compliant UPI URL for QR scanning and mobile payment
  // Note: We deliberately omit 'tr' so that Google Pay, PhonePe, Paytm, and BHIM do not reject as an invalid merchant reference
  const upiUrl = buildUpiUrl({
    pa: payeeUpi,
    pn: payeeName,
    amPaise: transfer.amountPaise,
    tn: note,
  });

  const handleCopyUpi = () => {
    if (!payeeUpi) return;
    navigator.clipboard.writeText(payeeUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleLaunchUpiApp = () => {
    if (!payeeUpi) return;
    setShowAppOpenedHint(true);
    // User-initiated navigation to trigger native UPI handler
    window.location.href = upiUrl;
  };

  const handleReportPayment = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      if (settlementId) {
        await settlementService.reportPayment(settlementId, transferId, {
          upiReference: upiReference.trim(),
        });
      } else {
        // Fallback for live transfers
        await settlementService.recordPayment(settlementId, transferId, {
          status: 'reported',
          upiReference: upiReference.trim(),
        });
      }

      setPaymentDone(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (onPaymentRecorded) {
        onPaymentRecorded(transferId);
      }
    } catch (err) {
      console.error('Failed to report payment:', err);
      const msg = err.response?.data?.error?.message || err.message || 'Failed to report payment';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Direct UPI Settlement"
      subtitle="Gateway-free peer-to-peer clearing directly via UPI"
      maxWidth="480px"
    >
      {paymentDone ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 230, 118, 0.15)',
              color: '#00e676',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 25px rgba(0, 230, 118, 0.3)',
            }}
          >
            <Clock size={36} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Payment Reported!
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            You have reported a transfer of <strong style={{ color: '#00e676' }}>{formatPaise(transfer.amountPaise)}</strong> to {payeeName}.
          </p>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              textAlign: 'left',
              marginBottom: '24px',
            }}
          >
            <strong>Status: Reported (Pending Confirmation)</strong>
            <br />
            An in-app notification has been dispatched to {payeeName}. Once they check their bank statement and select <em>Confirm received</em>, your settlement balance will update.
          </div>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '9999px',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            Done
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Transfer Summary Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MemberAvatar name={transfer.from?.name || 'You'} size="sm" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-negative)' }}>
                {transfer.from?.name || 'You'}
              </span>
            </div>

            <ArrowRight size={16} style={{ color: 'var(--accent-primary)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MemberAvatar name={payeeName} size="sm" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)' }}>
                {payeeName}
              </span>
            </div>
          </div>

          {/* Amount Display */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Amount to Transfer
            </span>
            <h2 style={{ fontSize: '36px', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
              {formatPaise(transfer.amountPaise)}
            </h2>
          </div>

          {/* Warning if no UPI ID */}
          {!payeeUpi ? (
            <div
              style={{
                padding: '16px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: '#ef4444' }}>
                <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>UPI ID Missing:</strong> {payeeName} hasn't saved their UPI ID yet in their profile.
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid rgba(239, 68, 68, 0.15)', paddingTop: '10px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Enter {payeeName}'s UPI ID to generate QR & Pay
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210@paytm or name@okhdfcbank"
                    value={customPayeeUpi}
                    onChange={(e) => setCustomPayeeUpi(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* QR Code Section */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid var(--border-medium)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <QRCodeSVG
                    value={upiUrl}
                    size={200}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <span style={{ color: '#0f172a', fontSize: '13px', fontWeight: 800, display: 'block' }}>
                    Scan with any UPI App
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Cred'].map((appName) => (
                      <span
                        key={appName}
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {appName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Pay button for mobile */}
              <button
                type="button"
                onClick={handleLaunchUpiApp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px var(--accent-glow)',
                }}
              >
                <Smartphone size={17} strokeWidth={2.5} />
                <span>Pay via UPI (Open Installed App)</span>
              </button>

              {/* Fallback Notice if app doesn't open */}
              {showAppOpenedHint && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                  }}
                >
                  💡 <em>If no UPI application opened on your device, scan the QR code above or copy the recipient's UPI ID below into your UPI app.</em>
                </div>
              )}

              {/* Copyable & Editable UPI ID Card */}
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
                      Recipient UPI ID (VPA)
                    </span>
                    {(livePayeeUpi || transfer?.to?.upiId) && !customPayeeUpi && (
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '9999px',
                          backgroundColor: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <ShieldCheck size={11} />
                        Profile Verified
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditingPayeeUpi(!isEditingPayeeUpi)}
                      title="Edit recipient UPI ID"
                      style={{
                        backgroundColor: isEditingPayeeUpi ? 'var(--accent-subtle)' : 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        color: isEditingPayeeUpi ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <Edit2 size={11} />
                      <span>{isEditingPayeeUpi ? 'Done' : 'Change'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      style={{
                        backgroundColor: copiedUpi ? 'var(--accent-subtle)' : 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        color: copiedUpi ? 'var(--accent-primary)' : 'var(--text-primary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {copiedUpi ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {isEditingPayeeUpi ? (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi"
                      value={customPayeeUpi || payeeUpi}
                      onChange={(e) => setCustomPayeeUpi(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--accent-primary)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {payeeUpi}
                  </span>
                )}
              </div>
            </>
          )}

          {/* Gateway-free peer-to-peer disclaimer */}
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              fontSize: '11.5px',
              color: '#d97706',
              lineHeight: 1.45,
            }}
          >
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Peer-to-Peer Settlement:</strong> Split Money does not process payments or verify bank transactions. Returning from UPI does not mark payment completed. Once paid, click <strong>I Have Paid</strong> so the recipient can verify and confirm receipt.
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                borderRadius: '12px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AlertCircle size={15} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Optional Reference Input */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              UPI Reference / UTR Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 329104829103"
              value={upiReference}
              onChange={(e) => setUpiReference(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                borderRadius: '9999px',
                padding: '10px 16px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'var(--font-mono)',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--accent-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 18px',
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
              type="button"
              onClick={handleReportPayment}
              disabled={isSubmitting}
              style={{
                padding: '10px 22px',
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
              <Check size={15} strokeWidth={2.5} />
              <span>{isSubmitting ? 'Reporting...' : `I Have Paid ₹${amountRupees}`}</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
