import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugifyLib from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getPriceRangeSymbol(level: number): string {
  const symbols = ['', '$', '$$', '$$$', '$$$$'];
  return symbols[level] || '$';
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function getDayOfWeek(): number {
  return new Date().getDay();
}

export function isBusinessOpen(hours: { dayOfWeek: number; openTime: string | null; closeTime: string | null; isClosed: boolean }[]): boolean {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const todayHours = hours.find((h) => h.dayOfWeek === currentDay);

  if (!todayHours || todayHours.isClosed) {
    return false;
  }

  if (!todayHours.openTime || !todayHours.closeTime) {
    return false;
  }

  const [openHour, openMin] = todayHours.openTime.split(':').map(Number);
  const [closeHour, closeMin] = todayHours.closeTime.split(':').map(Number);
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return currentTime >= openMinutes && currentTime <= closeMinutes;
}

export function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function getOpeningStatus(hours: any[] | undefined): { label: string; text: string } {
  if (!hours || hours.length === 0) {
    return { label: '', text: '' };
  }

  const now = new Date();
  const dayOfWeek = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const todayHours = hours.find((h: any) => h.dayOfWeek === dayOfWeek);

  // Today has hours and open
  if (todayHours && !todayHours.isClosed && todayHours.openTime && todayHours.closeTime) {
    const openMinutes = parseTime(todayHours.openTime);
    const closeMinutes = parseTime(todayHours.closeTime);

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      const diffMinutes = closeMinutes - currentMinutes;
      if (diffMinutes >= 60) {
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        if (mins > 0) {
          return { label: 'Open', text: `Open · Closes in ${hours}h ${mins}m (${formatTime12h(todayHours.closeTime)})` };
        }
        return { label: 'Open', text: `Open · Closes in ${hours}h (${formatTime12h(todayHours.closeTime)})` };
      }
      return { label: 'Open', text: `Open · Closes in ${diffMinutes}m (${formatTime12h(todayHours.closeTime)})` };
    }

    // Currently closed today but opens later today
    if (currentMinutes < openMinutes) {
      const diffMinutes = openMinutes - currentMinutes;
      if (diffMinutes >= 60) {
        const hours = Math.floor(diffMinutes / 60);
        return { label: 'Closed', text: `Closed · Opens in ${hours}h (${formatTime12h(todayHours.openTime)})` };
      }
      return { label: 'Closed', text: `Closed · Opens in ${diffMinutes}m (${formatTime12h(todayHours.openTime)})` };
    }
  }

  // Today is closed or past closing - find next open day
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 1; i <= 7; i++) {
    const nextDay = (dayOfWeek + i) % 7;
    const nextDayHours = hours.find((h: any) => h.dayOfWeek === nextDay);
    if (nextDayHours && !nextDayHours.isClosed && nextDayHours.openTime) {
      if (i === 1) {
        return { label: 'Closed', text: `Closed · Opens tomorrow (${formatTime12h(nextDayHours.openTime)})` };
      }
      return { label: 'Closed', text: `Closed · Opens ${shortDayNames[nextDay]} (${formatTime12h(nextDayHours.openTime)})` };
    }
  }

  return { label: 'Closed', text: 'Closed · Closed today' };
}

export function getStarRatingArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push('full');
    } else if (i === fullStars && hasHalf) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return stars;
}
