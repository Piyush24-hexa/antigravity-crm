import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-accent-green bg-accent-green/15';
  if (score >= 60) return 'text-accent-amber bg-accent-amber/15';
  if (score >= 40) return 'text-brand-400 bg-brand-400/15';
  return 'text-accent-red bg-accent-red/15';
}

export function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    lead: 'badge-lead',
    prospect: 'badge-prospect',
    customer: 'badge-customer',
    churned: 'badge-churned',
    open: 'badge-lead',
    won: 'badge-customer',
    lost: 'badge-churned',
  };
  return map[status] ?? 'badge-lead';
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
