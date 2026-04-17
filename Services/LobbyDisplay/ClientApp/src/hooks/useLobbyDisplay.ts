import { useQuery } from '@tanstack/react-query'
import { fetchLobbyDisplayData } from '../api/lobbyDisplay'
import { ENV } from '../env'
import type { LobbyDisplayData } from '../api/schemas'

export function useLobbyDisplay(): {
  data: LobbyDisplayData | undefined
  isLoading: boolean
  isError: boolean
} {
  const { data, isLoading, isError } = useQuery<LobbyDisplayData>({
    queryKey: ['lobbyDisplay'],
    queryFn: fetchLobbyDisplayData,
    refetchInterval: ENV.refreshIntervalMs,
    staleTime: ENV.refreshIntervalMs,
    retry: 2,
  })

  return { data, isLoading, isError }
}
