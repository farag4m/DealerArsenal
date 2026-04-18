import { useQuery } from '@tanstack/react-query'
import { fetchTasks, fetchVehiclePhotos } from '../api/operations'
import type { ApiResponse, Task, VehiclePhoto } from '../types/api'

export function useTasks(): ReturnType<typeof useQuery<ApiResponse<Task[]>, Error>> {
  return useQuery<ApiResponse<Task[]>, Error>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  })
}

export function useVehiclePhotos(): ReturnType<typeof useQuery<ApiResponse<VehiclePhoto[]>, Error>> {
  return useQuery<ApiResponse<VehiclePhoto[]>, Error>({
    queryKey: ['vehicle-photos'],
    queryFn: fetchVehiclePhotos,
  })
}
