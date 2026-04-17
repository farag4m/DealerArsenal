import { useQuery } from '@tanstack/react-query';
import { fetchReconQueue } from '../api';
import type { ApiResponse, ReconQueue, QueueSegment } from '../types';

export function useReconQueue(segment?: QueueSegment): ReturnType<
  typeof useQuery<ApiResponse<ReconQueue>>
> {
  return useQuery<ApiResponse<ReconQueue>>({
    queryKey: ['recon-queue', segment ?? 'all'],
    queryFn: () => fetchReconQueue(segment),
  });
}
