import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBoard, updateBoardItemStatus } from '../api/operations'
import type { ApiResponse, BoardItem, BoardFilters, WorkItemStatus } from '../types/api'

export function useBoard(
  filters: Partial<BoardFilters>,
): ReturnType<typeof useQuery<ApiResponse<BoardItem[]>, Error>> {
  return useQuery<ApiResponse<BoardItem[]>, Error>({
    queryKey: ['board', filters],
    queryFn: () => fetchBoard(filters),
  })
}

export function useUpdateBoardStatus(): ReturnType<
  typeof useMutation<ApiResponse<BoardItem>, Error, { id: string; status: WorkItemStatus }>
> {
  const qc = useQueryClient()
  return useMutation<ApiResponse<BoardItem>, Error, { id: string; status: WorkItemStatus }>({
    mutationFn: ({ id, status }: { id: string; status: WorkItemStatus }) =>
      updateBoardItemStatus(id, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['board'] })
    },
  })
}
