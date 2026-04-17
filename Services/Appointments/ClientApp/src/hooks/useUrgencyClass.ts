import { differenceInMinutes, isPast, parseISO } from 'date-fns';
import type { AppointmentStatus } from '../api/schemas';

export type UrgencyLevel = 'imminent' | 'overdue' | 'none';

export function computeUrgency(scheduledAt: string, status: AppointmentStatus): UrgencyLevel {
  if (status === 'Completed' || status === 'NoShow' || status === 'Cancelled') {
    return 'none';
  }

  const scheduled = parseISO(scheduledAt);
  const now = new Date();

  // Overdue: past scheduled time but still Scheduled or Confirmed (haven't arrived)
  if (isPast(scheduled) && (status === 'Scheduled' || status === 'Confirmed')) {
    return 'overdue';
  }

  // Imminent: within 2 hours and not yet arrived
  const minutesUntil = differenceInMinutes(scheduled, now);
  if (minutesUntil >= 0 && minutesUntil <= 120 && status !== 'Arrived') {
    return 'imminent';
  }

  return 'none';
}

export function useRowUrgencyClass(scheduledAt: string, status: AppointmentStatus): string {
  const level = computeUrgency(scheduledAt, status);
  if (level === 'overdue') return 'bg-red-50 border-l-4 border-l-red-500';
  if (level === 'imminent') return 'bg-orange-50 border-l-4 border-l-orange-400';
  return '';
}
