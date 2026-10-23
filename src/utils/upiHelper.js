import { paiseToRupees } from './formatters';

/**
 * Generate standard NPCI UPI Intent URL
 * Schema: upi://pay?pa={vpa}&pn={name}&am={amount}&cu=INR&tn={note}
 * 
 * CRITICAL FIXES FOR ALL UPI APPS (Google Pay, PhonePe, Paytm, BHIM, Cred):
 * 1. 'pa' MUST contain literal '@' symbol - NEVER URL-encoded as '%40'.
 *    URLSearchParams automatically encodes '@' into '%40', causing Google Pay
 *    and PhonePe QR scanners to report "Invalid UPI ID" or fail to resolve the payee.
 * 2. 'pn' and 'tn' should have spaces as '%20' (not '+') and clean alphanumeric text.
 * 3. 'tr' (Transaction Reference) MUST NOT be included for personal / P2P transfers.
 *    NPCI strictly rejects 'tr' for non-merchant VPAs, causing PhonePe to throw
 *    "Payment Failed: Merchant reference not allowed for person-to-person transfer".
 */
export function buildUpiUrl(params) {
  const { pa, pn = 'Payee', amPaise, tn = 'Settlement', tr = '' } = params;

  if (!pa) return '';

  // Clean the UPI ID - lowercase, trim, keep literal @
  const cleanPa = pa.trim().toLowerCase();

  // Clean payee name - letters, numbers, spaces only (max 50 chars)
  const cleanPn = (pn || 'Payee')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50);

  // Clean note - letters, numbers, spaces only (max 50 chars)
  const cleanTn = (tn || 'Settlement')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50);

  // Decimal amount in INR
  const amountRupees = amPaise ? paiseToRupees(amPaise).toFixed(2) : '';

  // Construct NPCI-compliant query string with literal '@' for pa
  const queryParts = [
    `pa=${cleanPa}`,
    `pn=${encodeURIComponent(cleanPn)}`,
  ];

  if (amountRupees && Number(amountRupees) > 0) {
    queryParts.push(`am=${amountRupees}`);
  }

  queryParts.push('cu=INR');

  if (cleanTn) {
    queryParts.push(`tn=${encodeURIComponent(cleanTn)}`);
  }

  // Only append tr if explicitly provided and caller is doing merchant tracking
  if (tr) {
    queryParts.push(`tr=${encodeURIComponent(tr)}`);
  }

  return `upi://pay?${queryParts.join('&')}`;
}

/**
 * Validate standard UPI VPA format (e.g., user@okhdfcbank, mobile@upi)
 */
export function isValidUpiId(upiId) {
  if (!upiId) return false;
  const regex = /^[\w.-]+@[\w.-]+$/;
  return regex.test(upiId.trim());
}
