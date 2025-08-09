import { format, formatDistance, formatRelative } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

// Date formatting utilities
export function formatDate(date: Date | string, locale: 'en' | 'es' = 'es'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeObj = locale === 'es' ? es : enUS;
  
  return format(dateObj, 'PPP', { locale: localeObj });
}

export function formatDateTime(date: Date | string, locale: 'en' | 'es' = 'es'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeObj = locale === 'es' ? es : enUS;
  
  return format(dateObj, 'PPP p', { locale: localeObj });
}

export function formatTimeAgo(date: Date | string, locale: 'en' | 'es' = 'es'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeObj = locale === 'es' ? es : enUS;
  
  return formatDistance(dateObj, new Date(), { 
    addSuffix: true, 
    locale: localeObj 
  });
}

export function formatRelativeTime(date: Date | string, locale: 'en' | 'es' = 'es'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const localeObj = locale === 'es' ? es : enUS;
  
  return formatRelative(dateObj, new Date(), { locale: localeObj });
}

// Currency formatting
export function formatCurrency(
  amount: number, 
  currency: 'MXN' | 'USD' = 'MXN',
  locale: 'en' | 'es' = 'es'
): string {
  const localeCode = locale === 'es' ? 'es-MX' : 'en-US';
  
  return new Intl.NumberFormat(localeCode, {
    style: 'currency',
    currency,
  }).format(amount);
}

// Number formatting
export function formatNumber(
  number: number,
  locale: 'en' | 'es' = 'es'
): string {
  const localeCode = locale === 'es' ? 'es-MX' : 'en-US';
  
  return new Intl.NumberFormat(localeCode).format(number);
}

export function formatPercentage(
  value: number,
  locale: 'en' | 'es' = 'es'
): string {
  const localeCode = locale === 'es' ? 'es-MX' : 'en-US';
  
  return new Intl.NumberFormat(localeCode, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

// Text formatting
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Mexican phone numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format international numbers
  if (cleaned.length === 12 && cleaned.startsWith('52')) {
    return `+52 (${cleaned.slice(2, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  }
  
  return phone; // Return original if no pattern matches
}

// Distance formatting
export function formatDistance(distanceInKm: number, locale: 'en' | 'es' = 'es'): string {
  if (distanceInKm < 1) {
    const meters = Math.round(distanceInKm * 1000);
    return locale === 'es' ? `${meters} m` : `${meters} m`;
  }
  
  return locale === 'es' ? `${distanceInKm.toFixed(1)} km` : `${distanceInKm.toFixed(1)} km`;
}

// Rating formatting
export function formatRating(rating: number): string {
  return `⭐ ${rating.toFixed(1)}`;
}