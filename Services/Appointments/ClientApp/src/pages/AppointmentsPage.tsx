import { useState } from 'react';
import { CalendarView } from '../components/CalendarView';
import { CreateAppointmentModal } from '../components/CreateAppointmentModal';
import { QueueView } from '../components/QueueView';
import { useCreateAppointment, useAppointments, useStaff } from '../hooks/useAppointments';
import type { AppointmentStatus } from '../api/schemas';
import type { CreateAppointmentInput } from '../api/schemas';
import { clsx } from 'clsx';

type ViewMode = 'queue' | 'calendar';

export function AppointmentsPage() {
  const [view, setView] = useState<ViewMode>('queue');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'All'>('All');
  const [showModal, setShowModal] = useState(false);

  const { data: appointments = [], isLoading, isError } = useAppointments();
  const { data: staff = [] } = useStaff();
  const createMutation = useCreateAppointment();

  function handleCreate(data: CreateAppointmentInput): void {
    createMutation.mutate(data, {
      onSuccess: () => setShowModal(false),
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900" data-testid="page-title">
            Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Visit scheduling &amp; showroom coordination
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          data-testid="new-appointment-btn"
        >
          + New Appointment
        </button>
      </header>

      {/* View toggle */}
      <div className="px-6 pt-5 pb-0 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setView('queue')}
          className={clsx(
            'px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-colors',
            view === 'queue'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700',
          )}
          data-testid="tab-queue"
        >
          Queue / List
        </button>
        <button
          type="button"
          onClick={() => setView('calendar')}
          className={clsx(
            'px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-colors',
            view === 'calendar'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-700',
          )}
          data-testid="tab-calendar"
        >
          Calendar
        </button>
      </div>

      {/* Main content */}
      <main className="px-6 py-5">
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-slate-400" data-testid="loading">
            Loading appointments…
          </div>
        )}

        {isError && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm"
            data-testid="error-state"
          >
            Failed to load appointments. Please refresh.
          </div>
        )}

        {!isLoading && !isError && view === 'queue' && (
          <QueueView
            appointments={appointments}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        )}

        {!isLoading && !isError && view === 'calendar' && (
          <CalendarView appointments={appointments} />
        )}
      </main>

      {/* Create modal */}
      {showModal && (
        <CreateAppointmentModal
          staff={staff}
          onSubmit={handleCreate}
          onClose={() => setShowModal(false)}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
}
