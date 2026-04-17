import { useQuery } from '@tanstack/react-query'
import { fetchTeam, fetchMemberDay } from '../api/operations'
import type { ApiResponse, TeamMember, WorkItem } from '../types/api'

export function useTeam(): ReturnType<typeof useQuery<ApiResponse<TeamMember[]>, Error>> {
  return useQuery<ApiResponse<TeamMember[]>, Error>({
    queryKey: ['team'],
    queryFn: fetchTeam,
  })
}

export function useMemberDay(
  memberId: string | null,
): ReturnType<typeof useQuery<ApiResponse<WorkItem[]>, Error>> {
  return useQuery<ApiResponse<WorkItem[]>, Error>({
    queryKey: ['member-day', memberId],
    queryFn: () => fetchMemberDay(memberId ?? ''),
    enabled: memberId !== null,
  })
}
