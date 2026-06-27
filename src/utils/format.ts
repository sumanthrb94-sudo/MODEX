import { PossessionStatus } from '@/constants/types';
import { Colors } from '@/constants/colors';

export function formatPrice(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1).replace(/\.0$/, '')} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function possessionLabel(status: PossessionStatus): string {
  switch (status) {
    case 'ready': return 'Ready';
    case 'under_construction': return 'Under Construction';
    case 'new_launch': return 'New Launch';
  }
}

export function possessionColor(status: PossessionStatus): string {
  switch (status) {
    case 'ready': return Colors.success;
    case 'under_construction': return Colors.warning;
    case 'new_launch': return Colors.info;
  }
}

export function propertyTypeLabel(type: string): string {
  const map: Record<string, string> = {
    villa: 'Villa',
    apartment: 'Apartment',
    plot: 'Plot',
    farmland: 'Farm Land',
    commercial: 'Commercial',
    standalone: 'Standalone',
  };
  return map[type] ?? type;
}
