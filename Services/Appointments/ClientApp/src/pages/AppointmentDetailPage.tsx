import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AppointmentStatus, PrepCheckpoint, UpdateFollowUpInput } from '../api/schemas';
import { STATUS_ORDER, TERMINAL_STATUSES } from '../api/schemas';
import { FollowUpCard } from '../components/FollowUpCard';
import { PrepChecklistCard } from '../components/PrepChecklistCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  useAppointmentDetail,
  useUpdateFollowUp,
  useUpdatePrepCheckpoints,
  useUpdateStatus,
} from '../hooks/useAppointmentDetail';
import { useStaff } from '../hooks/useAppointments';

// ─── Status progress bar ──────────────────────────────────────────────────────

function StatusProgress({ current }: { current: AppointmentStatus }) {
  const isTerminal = TERMINAL_STATUSES.includes(current);
  const currentIdx = STATUS_ORDER.indexOf(current);

  return (
    <div className="flex items-center gap-1" aria-label="Appointment progress">
      {STATUS_ORDER.map((s, i) => {
        const done = currentIdx >= i;
        return (
          <div key={s} className="flex items-center gap-1">
            <div
              className={clsx(
                'flex items-center justify-center rounded-full text-xs font-semibold w-7 h-7 border-2 transition-colors',
                done && !isTerminal
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : done && isTerminal
                    ? 'bg-slate-400 border-slate-400 text-white'
                    : 'border-slate-300 text-slate-400',
              )}
              title={s}
            >
              {i + 1}
            </div>
            <span
              className={clsx(
                'text-xs hidden sm:block',
                done ? 'text-slate-700 font-medium' : 'text-slate-400',
              )}
            >
              {s}
            </span>
            {i < STATUS_ORDER.length - 1 && (
              <div
                className={clsx(
                  'h-0.5 w-6 mx-1',
                  done && currentIdx > i ? 'bg-blue-500' : 'bg-slate-200',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Next-action button ───────────────────────────────────────────────────────

const NEXT_STATUS: Partial<Record<AppointmentStatus, AppointmentStatus>> = {
  Scheduled: 'Confirmed',
  Confirmed: 'Arrived',
  Arrived: 'Completed',
};

const NEXT_LABEL: Partial<Record<AppointmentStatus, string>> = {
  Scheduled: 'Mark Confirmed',
  Confirmed: 'Mark Arrived',
  Arrived: 'Mark Completed',
};

interface StatusActionsProps {
  current: AppointmentStatus;
  onTransition: (next: AppointmentStatus) => void;
  onNoShow: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function StatusActions({
  current,
  onTransition,
  onNoShow,
  onCancel,
  isPending,
}: StatusActionsProps) {
  const next = NEXT_STATUS[current];
  const isTerminal = TERMINAL_STATUSES.includes(current);

  if (isTerminal) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {next && (
        <button
          type="button"
          onClick={() => onTransition(next)}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
          data-testid="btn-advance-status"
        >
          {isPending ? '…' : (NEXT_LABEL[current] ?? 'Advance')}
        </button>
      )}
      {current !== 'Arrived' && (
        <button
          type="button"
          onClick={onNoShow}
          disabled={isPending}
          className="px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 disabled:opacity-60 transition-colors"
          data-testid="btn-no-show"
        >
          No-Show
        </button>
      )}
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="px-4 py-2 bg-white text-slate-600 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-60 transition-colors"
        data-testid="btn-cancel-appointment"
      >
        Cancel Appointment
      </button>
    </div>
  );
}

// ─── Notes section ────────────────────────────────────────────────────────────

function NotesCard({ notes }: { notes: string | null }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm" data-testid="notes-card">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Notes</h3>
      </div>
      <div className="p-5">
        {notes ? (
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{notes}</p>
        ) : (
          <p className="text-sm text-slate-400 italic">No notes for this appointment.</p>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const appointmentId = id ?? '';

  const { data: appt, isLoading, isError } = useAppointmentDetail(appointmentId);
  const { data: staff = [] } = useStaff();

  const updateStatus = useUpdateStatus(appointmentId);
  const updatePrep = useUpdatePrepCheckpoints(appointmentId);
  const updateFollowUp = useUpdateFollowUp(appointmentId);

  const [prepOptimistic, setPrepOptimistic] = useState<PrepCheckpoint | null>(null);

  function handlePrepChange(updated: PrepCheckpoint): void {
    setPrepOptimistic(updated);
    updatePrep.mutate(updated, {
      onSettled: () => setPrepOptimistic(null),
    });
  }

  function handleFollowUpSave(data: UpdateFollowUpInput): void {
    updateFollowUp.mutate(data);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400" data-testid="loading">
        Loading appointment…
      </div>
    );
  }

  if (isError || !appt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2" data-testid="error-state">
            Appointment not found.
          </p>
          <Link to="/appointments" className="text-blue-600 text-sm hover:underline">
            ← Back to appointments
          </Link>
        </div>
      </div>
    );
  }

  const prep = prepOptimistic ?? appt.prepCheckpoints;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <Link to="/appointments" className="hover:text-blue-600 transition-colors">
            Appointments
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{appt.customerName}</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900" data-testid="detail-customer-name">
                {appt.customerName}
              </h1>
              <StatusBadge status={appt.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {format(parseISO(appt.scheduledAt), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>

          <StatusActions
            current={appt.status}
            onTransition={(next) => updateStatus.mutate({ status: next })}
            onNoShow={() => updateStatus.mutate({ status: 'NoShow' })}
            onCancel={() => updateStatus.mutate({ status: 'Cancelled' })}
            isPending={updateStatus.isPending}
          />
        </div>

        <div className="mt-4">
          <StatusProgress current={appt.status} />
        </div>
      </header>

      {/* Body */}
      <main className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — context cards */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Customer context */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm" data-testid="customer-context">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Customer</h3>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1">
                  Name
                </span>
                <span className="text-slate-800 font-medium">{appt.customerName}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1">
                  Phone
                </span>
                <a
                  href={`tel:${appt.customerPhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {appt.customerPhone}
                </a>
              </div>
              {appt.customerEmail && (
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1">
                    Email
                  </span>
                  <a
                    href={`mailto:${appt.customerEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {appt.customerEmail}
                  </a>
                </div>
              )}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1">
                  Customer ID
                </span>
                <span className="text-slate-500 font-mono text-xs">{appt.customerId}</span>
              </div>
            </div>
          </div>

          {/* Vehicle context */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm" data-testid="vehicle-context">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">Vehicle</h3>
              {appt.vehicleId && (
                <span className="text-xs text-slate-400">
                  ID: <span className="font-mono">{appt.vehicleId}</span>
                </span>
              )}
            </div>
            <div className="p-5 text-sm">
              {appt.vehicleInterest ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1">
                      Vehicle of interest
                    </span>
                    <span className="text-slate-800 font-medium">{appt.vehicleInterest}</span>
                  </div>
                  {appt.vehicleStage && (
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 block mb-1">
                        Current stage
                      </span>
                      <span className="text-slate-700">{appt.vehicleStage}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-400 italic">No vehicle of interest recorded.</p>
              )}

              {appt.vehicleId && (
                <div className="mt-4 flex gap-2">
                  <a
                    href={`/vehicles/${appt.vehicleId}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    data-testid="link-vehicle"
                  >
                    Open in Vehicles →
                  </a>
                  <a
                    href={`/location?vehicleId=${appt.vehicleId}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    data-testid="link-location"
                  >
                    Check Location →
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Prep checklist */}
          <PrepChecklistCard
            checkpoints={prep}
            onChange={handlePrepChange}
            disabled={TERMINAL_STATUSES.includes(appt.status)}
            isSaving={updatePrep.isPending}
          />

          {/* Notes */}
          <NotesCard notes={appt.notes} />
        </div>

        {/* Right column — staff + follow-up */}
        <div className="flex flex-col gap-5">
          {/* Assigned staff */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm" data-testid="staff-card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">Assigned Staff</h3>
            </div>
            <div className="p-5 text-sm">
              {appt.assignedStaffName ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {appt.assignedStaffName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-800 font-medium">{appt.assignedStaffName}</span>
                </div>
              ) : (
                <p className="text-slate-400 italic">Unassigned</p>
              )}
            </div>
          </div>

          {/* Follow-up ownership */}
          <FollowUpCard
            followUpAction={appt.followUpAction}
            followUpDueDate={appt.followUpDueDate}
            followUpOwnerName={appt.followUpOwnerName}
            staff={staff}
            onSave={handleFollowUpSave}
            isSaving={updateFollowUp.isPending}
          />

          {/* Outcome (post-visit) */}
          {appt.outcome && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm" data-testid="outcome-card">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Visit Outcome</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-700">{appt.outcome}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
