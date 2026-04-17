import { apiClient } from './client'
import { LobbyDisplayDataSchema, type LobbyDisplayData } from './schemas'

export async function fetchLobbyDisplayData(): Promise<LobbyDisplayData> {
  const response = await apiClient.get<unknown>('/api/lobby-display')
  return LobbyDisplayDataSchema.parse(response.data)
}
