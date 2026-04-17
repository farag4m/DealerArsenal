import { z } from 'zod';

// ─── Enums ───────────────────────────────────────────────────────────────────

export const AppointmentStatusSchema = z.enum([
  'Scheduled',
  'Confirmed',
  'Arrived',
  'Completed',
  'NoShow',
  'Cancelled',
]);

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;

export const ALL_STATUSES: AppointmentStatus[] = [
  'Scheduled',
  'Confirmed',
  'Arrived',
  'Completed',
  'NoShow',
  'Cancelled',
];

// Status flow order for progress display
export const STATUS_ORDER: AppointmentStatus[] = [
  'Scheduled',
  'Confirmed',
  'Arrived',
  'Completed',
];

// Terminal statuses — no further transitions
export const TERMINAL_STATUSES: AppointmentStatus[] = ['Completed', 'NoShow', 'Cancelled'];

// ─── Appointment ─────────────────────────────────────────────────────────────

export const AppointmentListItemSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  scheduledAt: z.string(), // ISO 8601
  vehicleInterest: z.string().nullable(),
  vehicleId: z.string().nullable(),
  status: AppointmentStatusSchema,
  assignedStaffName: z.string().nullable(),
  assignedStaffId: z.string().nullable(),
});

export type AppointmentListItem = z.infer<typeof AppointmentListItemSchema>;

export const PrepCheckpointSchema = z.object({
  vehiclePulledAndReady: z.boolean(),
  keysAvailable: z.boolean(),
  testDrivePathClear: z.boolean(),
  locationConfirmed: z.boolean(),
  reconComplete: z.boolean(),
});

export type PrepCheckpoint = z.infer<typeof PrepCheckpointSchema>;

export const AppointmentDetailSchema = z.object({
  id: z.string(),
  // Customer context
  customerId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().nullable(),
  // Vehicle context
  vehicleId: z.string().nullable(),
  vehicleInterest: z.string().nullable(),
  vehicleStage: z.string().nullable(),
  // Prep checkpoints
  prepCheckpoints: PrepCheckpointSchema,
  // Scheduling
  scheduledAt: z.string(),
  status: AppointmentStatusSchema,
  // Staff
  assignedStaffId: z.string().nullable(),
  assignedStaffName: z.string().nullable(),
  // Follow-up
  followUpAction: z.string().nullable(),
  followUpDueDate: z.string().nullable(), // ISO date
  followUpOwnerId: z.string().nullable(),
  followUpOwnerName: z.string().nullable(),
  // Outcome & notes
  outcome: z.string().nullable(),
  notes: z.string().nullable(),
  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AppointmentDetail = z.infer<typeof AppointmentDetailSchema>;

// ─── Staff ───────────────────────────────────────────────────────────────────

export const StaffMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
});

export type StaffMember = z.infer<typeof StaffMemberSchema>;

// ─── API Response wrapper ────────────────────────────────────────────────────

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  });

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

// ─── Request bodies ──────────────────────────────────────────────────────────

export const CreateAppointmentSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().min(7, 'Valid phone number required'),
  customerEmail: z.string().email('Valid email required').optional().or(z.literal('')),
  vehicleInterest: z.string().optional(),
  scheduledAt: z.string().min(1, 'Date and time are required'),
  assignedStaffId: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof CreateAppointmentSchema>;

export const UpdateStatusSchema = z.object({
  status: AppointmentStatusSchema,
  outcome: z.string().optional(),
  followUpAction: z.string().optional(),
  followUpDueDate: z.string().optional(),
  followUpOwnerId: z.string().optional(),
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

export const UpdatePrepCheckpointsSchema = PrepCheckpointSchema;
export type UpdatePrepCheckpointsInput = z.infer<typeof UpdatePrepCheckpointsSchema>;

export const UpdateFollowUpSchema = z.object({
  followUpAction: z.string().min(1, 'Follow-up action is required'),
  followUpDueDate: z.string().min(1, 'Due date is required'),
  followUpOwnerId: z.string().min(1, 'Owner is required'),
});

export type UpdateFollowUpInput = z.infer<typeof UpdateFollowUpSchema>;
