import { z } from 'zod';
import {
  ReconIssueSchema,
  ReconQueueSchema,
  NoteSchema,
  VendorHandoffSchema,
  QueueSegmentSchema,
  ApprovalStatusSchema,
  PartsStatusSchema,
  ApprovalRequestSchema,
  AddNoteRequestSchema,
  ApprovalDecisionSchema,
} from '../schemas/recon';

export type QueueSegment = z.infer<typeof QueueSegmentSchema>;
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;
export type PartsStatus = z.infer<typeof PartsStatusSchema>;
export type ApprovalDecision = z.infer<typeof ApprovalDecisionSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type VendorHandoff = z.infer<typeof VendorHandoffSchema>;
export type ReconIssue = z.infer<typeof ReconIssueSchema>;
export type ReconQueue = z.infer<typeof ReconQueueSchema>;
export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>;
export type AddNoteRequest = z.infer<typeof AddNoteRequestSchema>;

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
