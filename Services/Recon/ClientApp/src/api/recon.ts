import { apiClient } from './client';
import {
  ReconQueueSchema,
  ReconIssueSchema,
  ApiResponseSchema,
} from '../schemas';
import type {
  ReconQueue,
  ReconIssue,
  ApprovalRequest,
  AddNoteRequest,
  ApiResponse,
  QueueSegment,
} from '../types';

export async function fetchReconQueue(
  segment?: QueueSegment,
): Promise<ApiResponse<ReconQueue>> {
  const params = segment ? { segment } : {};
  const response = await apiClient.get<ApiResponse<ReconQueue>>(
    '/api/recon/queue',
    { params },
  );
  return ApiResponseSchema(ReconQueueSchema).parse(response.data);
}

export async function fetchReconIssue(
  issueId: string,
): Promise<ApiResponse<ReconIssue>> {
  const response = await apiClient.get<ApiResponse<ReconIssue>>(
    `/api/recon/issues/${issueId}`,
  );
  return ApiResponseSchema(ReconIssueSchema).parse(response.data);
}

export async function submitApproval(
  request: ApprovalRequest,
): Promise<ApiResponse<ReconIssue>> {
  const response = await apiClient.post<ApiResponse<ReconIssue>>(
    `/api/recon/issues/${request.issueId}/approval`,
    request,
  );
  return ApiResponseSchema(ReconIssueSchema).parse(response.data);
}

export async function addNote(
  request: AddNoteRequest,
): Promise<ApiResponse<ReconIssue>> {
  const response = await apiClient.post<ApiResponse<ReconIssue>>(
    `/api/recon/issues/${request.issueId}/notes`,
    { content: request.content },
  );
  return ApiResponseSchema(ReconIssueSchema).parse(response.data);
}
