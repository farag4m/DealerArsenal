import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReconIssue, submitApproval, addNote } from '../api';
import type {
  ApiResponse,
  ReconIssue,
  ApprovalRequest,
  AddNoteRequest,
} from '../types';

export function useReconIssue(issueId: string): ReturnType<
  typeof useQuery<ApiResponse<ReconIssue>>
> {
  return useQuery<ApiResponse<ReconIssue>>({
    queryKey: ['recon-issue', issueId],
    queryFn: () => fetchReconIssue(issueId),
    enabled: issueId.length > 0,
  });
}

export function useSubmitApproval() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ReconIssue>, Error, ApprovalRequest>({
    mutationFn: submitApproval,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['recon-queue'] });
      void queryClient.setQueryData(
        ['recon-issue', data.data.id],
        data,
      );
    },
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<ReconIssue>, Error, AddNoteRequest>({
    mutationFn: addNote,
    onSuccess: (data) => {
      void queryClient.setQueryData(
        ['recon-issue', data.data.id],
        data,
      );
    },
  });
}
