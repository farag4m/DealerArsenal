import { z } from 'zod';

export const QueueSegmentSchema = z.enum([
  'needs_decision',
  'approved_in_progress',
  'waiting_on_parts',
  'at_vendor',
  'aging_alert',
]);

export const ApprovalStatusSchema = z.enum([
  'pending',
  'approved',
  'denied',
  'more_info_requested',
]);

export const PartsStatusSchema = z.enum(['ordered', 'received', 'waiting']);

export const NoteSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const VendorHandoffSchema = z.object({
  vendorName: z.string(),
  dateSent: z.string(),
  expectedReturn: z.string(),
});

export const ReconIssueSchema = z.object({
  id: z.string(),
  stockNumber: z.string(),
  year: z.number().int().positive(),
  make: z.string(),
  model: z.string(),
  daysInRecon: z.number().int().nonnegative(),
  issueDescription: z.string(),
  costEstimate: z.number().nonnegative(),
  approvalStatus: ApprovalStatusSchema,
  assignedTo: z.string(),
  segment: QueueSegmentSchema,
  isEscalated: z.boolean(),
  vendorHandoff: VendorHandoffSchema.optional(),
  partsStatus: PartsStatusSchema.optional(),
  notes: z.array(NoteSchema),
});

export const ReconQueueSchema = z.object({
  items: z.array(ReconIssueSchema),
  total: z.number().int().nonnegative(),
});

export const ApprovalDecisionSchema = z.enum([
  'approve',
  'deny',
  'request_more_info',
]);

export const ApprovalRequestSchema = z.object({
  issueId: z.string(),
  decision: ApprovalDecisionSchema,
  budget: z.number().nonnegative().optional(),
  reason: z.string().optional(),
});

export const AddNoteRequestSchema = z.object({
  issueId: z.string(),
  content: z.string().min(1),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
  });
