import { apiClient } from './client';
import {
  ApiResponseSchema,
  AppointmentDetailSchema,
  AppointmentListItemSchema,
  StaffMemberSchema,
  type ApiResponse,
  type AppointmentDetail,
  type AppointmentListItem,
  type CreateAppointmentInput,
  type StaffMember,
  type UpdateFollowUpInput,
  type UpdatePrepCheckpointsInput,
  type UpdateStatusInput,
} from './schemas';
import { z } from 'zod';

// ─── List ─────────────────────────────────────────────────────────────────────

export async function fetchAppointments(): Promise<ApiResponse<AppointmentListItem[]>> {
  const res = await apiClient.get<ApiResponse<AppointmentListItem[]>>('/api/appointments');
  return ApiResponseSchema(z.array(AppointmentListItemSchema)).parse(res.data);
}

// ─── Detail ───────────────────────────────────────────────────────────────────

export async function fetchAppointmentById(id: string): Promise<ApiResponse<AppointmentDetail>> {
  const res = await apiClient.get<ApiResponse<AppointmentDetail>>(`/api/appointments/${id}`);
  return ApiResponseSchema(AppointmentDetailSchema).parse(res.data);
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createAppointment(
  body: CreateAppointmentInput,
): Promise<ApiResponse<AppointmentDetail>> {
  const res = await apiClient.post<ApiResponse<AppointmentDetail>>('/api/appointments', body);
  return ApiResponseSchema(AppointmentDetailSchema).parse(res.data);
}

// ─── Status transition ────────────────────────────────────────────────────────

export async function updateAppointmentStatus(
  id: string,
  body: UpdateStatusInput,
): Promise<ApiResponse<AppointmentDetail>> {
  const res = await apiClient.patch<ApiResponse<AppointmentDetail>>(
    `/api/appointments/${id}/status`,
    body,
  );
  return ApiResponseSchema(AppointmentDetailSchema).parse(res.data);
}

// ─── Prep checkpoints ─────────────────────────────────────────────────────────

export async function updatePrepCheckpoints(
  id: string,
  body: UpdatePrepCheckpointsInput,
): Promise<ApiResponse<AppointmentDetail>> {
  const res = await apiClient.patch<ApiResponse<AppointmentDetail>>(
    `/api/appointments/${id}/prep`,
    body,
  );
  return ApiResponseSchema(AppointmentDetailSchema).parse(res.data);
}

// ─── Follow-up ────────────────────────────────────────────────────────────────

export async function updateFollowUp(
  id: string,
  body: UpdateFollowUpInput,
): Promise<ApiResponse<AppointmentDetail>> {
  const res = await apiClient.patch<ApiResponse<AppointmentDetail>>(
    `/api/appointments/${id}/followup`,
    body,
  );
  return ApiResponseSchema(AppointmentDetailSchema).parse(res.data);
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export async function fetchStaff(): Promise<ApiResponse<StaffMember[]>> {
  const res = await apiClient.get<ApiResponse<StaffMember[]>>('/api/staff');
  return ApiResponseSchema(z.array(StaffMemberSchema)).parse(res.data);
}
