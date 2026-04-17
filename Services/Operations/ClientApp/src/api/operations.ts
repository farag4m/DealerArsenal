import type { AxiosResponse } from 'axios'
import apiClient from './client'
import {
  WorkItemListSchema,
  BoardItemListSchema,
  TeamMemberListSchema,
  TaskListSchema,
  VehiclePhotoListSchema,
} from '../types/api'
import type {
  ApiResponse,
  WorkItem,
  BoardItem,
  BoardFilters,
  TeamMember,
  Task,
  VehiclePhoto,
  WorkItemStatus,
} from '../types/api'

// ─── My Day ──────────────────────────────────────────────────────────────────

export async function fetchMyDay(): Promise<ApiResponse<WorkItem[]>> {
  const res: AxiosResponse<ApiResponse<WorkItem[]>> = await apiClient.get('/api/operations/my-day')
  const parsed = WorkItemListSchema.parse(res.data.data)
  return { ...res.data, data: parsed }
}

export async function markWorkItemComplete(id: string): Promise<ApiResponse<WorkItem>> {
  const res: AxiosResponse<ApiResponse<WorkItem>> = await apiClient.patch(`/api/operations/work-items/${id}/complete`)
  return res.data
}

export async function flagWorkItemBlocked(id: string): Promise<ApiResponse<WorkItem>> {
  const res: AxiosResponse<ApiResponse<WorkItem>> = await apiClient.patch(`/api/operations/work-items/${id}/block`)
  return res.data
}

export async function snoozeWorkItem(id: string, until: string): Promise<ApiResponse<WorkItem>> {
  const res: AxiosResponse<ApiResponse<WorkItem>> = await apiClient.patch(`/api/operations/work-items/${id}/snooze`, { until })
  return res.data
}

// ─── Board ───────────────────────────────────────────────────────────────────

export async function fetchBoard(filters: Partial<BoardFilters>): Promise<ApiResponse<BoardItem[]>> {
  const res: AxiosResponse<ApiResponse<BoardItem[]>> = await apiClient.get('/api/operations/board', { params: filters })
  const parsed = BoardItemListSchema.parse(res.data.data)
  return { ...res.data, data: parsed }
}

export async function updateBoardItemStatus(id: string, status: WorkItemStatus): Promise<ApiResponse<BoardItem>> {
  const res: AxiosResponse<ApiResponse<BoardItem>> = await apiClient.patch(`/api/operations/work-items/${id}/status`, { status })
  return res.data
}

// ─── Team ────────────────────────────────────────────────────────────────────

export async function fetchTeam(): Promise<ApiResponse<TeamMember[]>> {
  const res: AxiosResponse<ApiResponse<TeamMember[]>> = await apiClient.get('/api/operations/team')
  const parsed = TeamMemberListSchema.parse(res.data.data)
  return { ...res.data, data: parsed }
}

export async function fetchMemberDay(memberId: string): Promise<ApiResponse<WorkItem[]>> {
  const res: AxiosResponse<ApiResponse<WorkItem[]>> = await apiClient.get(`/api/operations/team/${memberId}/day`)
  const parsed = WorkItemListSchema.parse(res.data.data)
  return { ...res.data, data: parsed }
}

// ─── Tasks & Photos ───────────────────────────────────────────────────────────

export async function fetchTasks(): Promise<ApiResponse<Task[]>> {
  const res: AxiosResponse<ApiResponse<Task[]>> = await apiClient.get('/api/operations/tasks')
  const parsed = TaskListSchema.parse(res.data.data)
  return { ...res.data, data: parsed }
}

export async function fetchVehiclePhotos(): Promise<ApiResponse<VehiclePhoto[]>> {
  const res: AxiosResponse<ApiResponse<VehiclePhoto[]>> = await apiClient.get('/api/operations/vehicle-photos')
  const parsed = VehiclePhotoListSchema.parse(res.data.data)
  return { ...res.data, data: parsed }
}
