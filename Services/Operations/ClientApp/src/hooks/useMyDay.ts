import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMyDay,
  markWorkItemComplete,
  flagWorkItemBlocked,
  snoozeWorkItem,
} from '../api/operations'
import type { ApiResponse, WorkItem } from '../types/api'

export function useMyDay(): ReturnType<typeof useQuery<ApiResponse<WorkItem[]>, Error>> {
  return useQuery<ApiResponse<WorkItem[]>, Error>({
    queryKey: ['my-day'],
    queryFn: fetchMyDay,
  })
}

export function useMarkComplete(): ReturnType<typeof useMutation<ApiResponse<WorkItem>, Error, string>> {
  const qc = useQueryClient()
  return useMutation<ApiResponse<WorkItem>, Error, string>({
    mutationFn: (id: string) => markWorkItemComplete(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['my-day'] }) },
  })
}

export function useFlagBlocked(): ReturnType<typeof useMutation<ApiResponse<WorkItem>, Error, string>> {
  const qc = useQueryClient()
  return useMutation<ApiResponse<WorkItem>, Error, string>({
    mutationFn: (id: string) => flagWorkItemBlocked(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['my-day'] }) },
  })
}

export function useSnooze(): ReturnType<typeof useMutation<ApiResponse<WorkItem>, Error, { id: string; until: string }>> {
  const qc = useQueryClient()
  return useMutation<ApiResponse<WorkItem>, Error, { id: string; until: string }>({
    mutationFn: ({ id, until }: { id: string; until: string }) => snoozeWorkItem(id, until),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['my-day'] }) },
  })
}
