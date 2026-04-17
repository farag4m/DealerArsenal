import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAppointmentById,
  updateAppointmentStatus,
  updateFollowUp,
  updatePrepCheckpoints,
} from '../api/appointments';
import type {
  UpdateFollowUpInput,
  UpdatePrepCheckpointsInput,
  UpdateStatusInput,
} from '../api/schemas';
import { APPOINTMENTS_KEY } from './useAppointments';

export function appointmentDetailKey(id: string) {
  return ['appointments', id] as const;
}

export function useAppointmentDetail(id: string) {
  return useQuery({
    queryKey: appointmentDetailKey(id),
    queryFn: () => fetchAppointmentById(id),
    select: (res) => res.data,
    enabled: id.length > 0,
  });
}

export function useUpdateStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateStatusInput) => updateAppointmentStatus(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: appointmentDetailKey(id) });
      await qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
    },
  });
}

export function useUpdatePrepCheckpoints(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdatePrepCheckpointsInput) => updatePrepCheckpoints(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: appointmentDetailKey(id) });
    },
  });
}

export function useUpdateFollowUp(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateFollowUpInput) => updateFollowUp(id, body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: appointmentDetailKey(id) });
    },
  });
}
