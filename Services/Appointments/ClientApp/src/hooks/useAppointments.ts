import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAppointment,
  fetchAppointments,
  fetchStaff,
} from '../api/appointments';
import type { CreateAppointmentInput } from '../api/schemas';

export const APPOINTMENTS_KEY = ['appointments'] as const;
export const STAFF_KEY = ['staff'] as const;

export function useAppointments() {
  return useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: fetchAppointments,
    select: (res) => res.data,
  });
}

export function useStaff() {
  return useQuery({
    queryKey: STAFF_KEY,
    queryFn: fetchStaff,
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000, // staff list changes rarely
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAppointmentInput) => createAppointment(body),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
    },
  });
}
