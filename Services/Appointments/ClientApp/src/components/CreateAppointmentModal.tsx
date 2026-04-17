import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { StaffMember } from '../api/schemas';
import { CreateAppointmentSchema, type CreateAppointmentInput } from '../api/schemas';

interface CreateAppointmentModalProps {
  staff: StaffMember[];
  onSubmit: (data: CreateAppointmentInput) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export function CreateAppointmentModal({
  staff,
  onSubmit,
  onClose,
  isSubmitting = false,
}: CreateAppointmentModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAppointmentInput>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleInterest: '',
      scheduledAt: '',
      assignedStaffId: '',
      notes: '',
    },
  });

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function handleFormSubmit(data: CreateAppointmentInput): void {
    onSubmit(data);
    reset();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      data-testid="create-appointment-modal"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-800">
            New Appointment
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-xl leading-none"
            aria-label="Close modal"
            data-testid="modal-close-btn"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}
          className="px-6 py-5 space-y-4"
          data-testid="create-appointment-form"
        >
          {/* Customer name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer name <span className="text-red-500">*</span>
            </label>
            <input
              {...register('customerName')}
              type="text"
              placeholder="Full name"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-customer-name"
            />
            {errors.customerName && (
              <p className="text-xs text-red-600 mt-1">{errors.customerName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              {...register('customerPhone')}
              type="tel"
              placeholder="(555) 000-0000"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-customer-phone"
            />
            {errors.customerPhone && (
              <p className="text-xs text-red-600 mt-1">{errors.customerPhone.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              {...register('customerEmail')}
              type="email"
              placeholder="customer@example.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-customer-email"
            />
            {errors.customerEmail && (
              <p className="text-xs text-red-600 mt-1">{errors.customerEmail.message}</p>
            )}
          </div>

          {/* Vehicle interest */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Vehicle of interest
            </label>
            <input
              {...register('vehicleInterest')}
              type="text"
              placeholder="e.g. 2022 Toyota Camry"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-vehicle-interest"
            />
          </div>

          {/* Date + time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date &amp; time <span className="text-red-500">*</span>
            </label>
            <input
              {...register('scheduledAt')}
              type="datetime-local"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="input-scheduled-at"
            />
            {errors.scheduledAt && (
              <p className="text-xs text-red-600 mt-1">{errors.scheduledAt.message}</p>
            )}
          </div>

          {/* Assign staff */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign staff</label>
            <select
              {...register('assignedStaffId')}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="select-staff"
            >
              <option value="">Unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.role}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Any additional context…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              data-testid="input-notes"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
              data-testid="submit-appointment-btn"
            >
              {isSubmitting ? 'Creating…' : 'Create Appointment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-slate-600 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
