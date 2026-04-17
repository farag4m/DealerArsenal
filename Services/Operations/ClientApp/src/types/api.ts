import { z } from 'zod'

// ─── Generic API envelope ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  success: boolean
  message: string | null
}

// ─── Enums ───────────────────────────────────────────────────────────────────

export const WorkItemTypeSchema = z.enum([
  'vehicle_task',
  'customer_followup',
  'assigned_work',
])
export type WorkItemType = z.infer<typeof WorkItemTypeSchema>

export const WorkItemStatusSchema = z.enum([
  'todo',
  'in_progress',
  'blocked',
  'done',
])
export type WorkItemStatus = z.infer<typeof WorkItemStatusSchema>

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])
export type Priority = z.infer<typeof PrioritySchema>

export const PhotoStatusSchema = z.enum([
  'pending',
  'in_progress',
  'complete',
  'skipped',
])
export type PhotoStatus = z.infer<typeof PhotoStatusSchema>

// ─── My Day ──────────────────────────────────────────────────────────────────

export const WorkItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: WorkItemTypeSchema,
  status: WorkItemStatusSchema,
  priority: PrioritySchema,
  dueTime: z.string().nullable(),
  vehicleId: z.string().nullable(),
  vehicleLabel: z.string().nullable(),
  customerName: z.string().nullable(),
  assigneeId: z.string(),
  notes: z.string().nullable(),
  snoozedUntil: z.string().nullable(),
  stuckSince: z.string().nullable(),
})
export type WorkItem = z.infer<typeof WorkItemSchema>

export const WorkItemListSchema = z.array(WorkItemSchema)

// ─── Board ───────────────────────────────────────────────────────────────────

export const BoardItemSchema = WorkItemSchema.extend({
  assigneeName: z.string(),
})
export type BoardItem = z.infer<typeof BoardItemSchema>

export const BoardItemListSchema = z.array(BoardItemSchema)

export const BoardFiltersSchema = z.object({
  workType: WorkItemTypeSchema.nullable(),
  vehicleId: z.string().nullable(),
  assigneeId: z.string().nullable(),
})
export type BoardFilters = z.infer<typeof BoardFiltersSchema>

// ─── Team ────────────────────────────────────────────────────────────────────

export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  assignedCount: z.number().int().nonnegative(),
  completedToday: z.number().int().nonnegative(),
  blockedCount: z.number().int().nonnegative(),
  overloadedThreshold: z.number().int().positive(),
  available: z.boolean(),
})
export type TeamMember = z.infer<typeof TeamMemberSchema>

export const TeamMemberListSchema = z.array(TeamMemberSchema)

// ─── Tasks & Photos ───────────────────────────────────────────────────────────

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: WorkItemStatusSchema,
  priority: PrioritySchema,
  vehicleId: z.string().nullable(),
  vehicleLabel: z.string().nullable(),
  ownerId: z.string().nullable(),
  ownerName: z.string().nullable(),
  dueDate: z.string().nullable(),
})
export type Task = z.infer<typeof TaskSchema>

export const TaskListSchema = z.array(TaskSchema)

export const VehiclePhotoSchema = z.object({
  vehicleId: z.string(),
  vehicleLabel: z.string(),
  vin: z.string().nullable(),
  photoStatus: PhotoStatusSchema,
  photoCount: z.number().int().nonnegative(),
  awaitingPhotography: z.boolean(),
  lastPhotoDate: z.string().nullable(),
})
export type VehiclePhoto = z.infer<typeof VehiclePhotoSchema>

export const VehiclePhotoListSchema = z.array(VehiclePhotoSchema)
