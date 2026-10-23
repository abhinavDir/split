/**
 * Format integer paise into INR currency representation (₹ 1,234.50)
 */
export function formatPaise(paise, options = {}) {
  const { showSign = false, hideDecimalsIfZero = false } = options;

  if (paise === null || paise === undefined || isNaN(paise)) {
    return '₹0.00';
  }

  const isNegative = paise < 0;
  const absPaise = Math.abs(paise);
  const rupees = Math.floor(absPaise / 100);
  const remainingPaise = absPaise % 100;

  const formattedRupees = new Intl.NumberFormat('en-IN').format(rupees);
  const paiseString = remainingPaise.toString().padStart(2, '0');

  let formatted = `₹${formattedRupees}`;
  if (!hideDecimalsIfZero || remainingPaise > 0) {
    formatted += `.${paiseString}`;
  }

  if (isNegative) {
    return `-${formatted}`;
  }
  if (showSign && paise > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

/**
 * Convert user input rupees string/number into integer paise deterministically
 */
export function rupeesToPaise(rupeesInput) {
  if (!rupeesInput) return 0;

  const cleanStr = String(rupeesInput).replace(/,/g, '').trim();
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return 0;

  // Rounding accurately to integer paise avoiding IEEE-754 floating point drift
  return Math.round(num * 100);
}

/**
 * Convert integer paise to decimal rupees number
 */
export function paiseToRupees(paise) {
  if (!paise || isNaN(paise)) return 0;
  return Math.round(paise) / 100;
}

/**
 * Format standard date
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format relative time (e.g. 2 hours ago, yesterday)
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
}

/**
 * Extract 1 or 2 letter initials from a full name
 */
export function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Deterministic aesthetic color generator based on name
 */
export function getAvatarColor(name) {
  if (!name) return '#10b981';
  const colors = [
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#14b8a6', // teal
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
