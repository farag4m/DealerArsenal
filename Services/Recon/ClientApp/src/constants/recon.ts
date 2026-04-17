import type { QueueSegment } from '../types';

export const AGING_THRESHOLD_DAYS = 7;

export const SEGMENT_LABELS: Record<QueueSegment, string> = {
  needs_decision: 'Needs Decision',
  approved_in_progress: 'Approved / In Progress',
  waiting_on_parts: 'Waiting on Parts',
  at_vendor: 'At Vendor / Shop',
  aging_alert: 'Aging Alert',
};

export const SEGMENT_ORDER: QueueSegment[] = [
  'needs_decision',
  'approved_in_progress',
  'waiting_on_parts',
  'at_vendor',
  'aging_alert',
];
