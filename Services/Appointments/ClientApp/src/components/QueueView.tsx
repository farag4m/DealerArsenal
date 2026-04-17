import { clsx } from 'clsx';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import type { AppointmentListItem, AppointmentStatus } from '../api/schemas';
import { ALL_STATUSES } from '../api/schemas';
import { useRowUrgencyClass } from '../hooks/useUrgencyClass';
import { StatusBadge } from './StatusBadge';
import { UrgencyBadge } from './UrgencyBadge';

interface QueueViewProps {
  appointments: AppointmentListItem[];
  statusFilter: AppointmentStatus | 'All';
  onStatusFilterChange: (value: AppointmentStatus | 'All') => void;
}

function AppointmentRow({ appt }: { appt: AppointmentListItem }) {
  const urgencyClass = useRowUrgencyClass(appt.scheduledAt, appt.status);
  return (
    <tr
      className={clsx('hover:bg-slate-50 transition-colors', urgencyClass)}
      data-testid="appointment-row"
    >
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <Link
            to={`/appointments/${appt.id}`}
            className="font-medium text-blue-600 hover:underline"
            data-testid="appointment-link"
          >
            {appt.customerName}
          </Link>
          <UrgencyBadge scheduledAt={appt.scheduledAt} status={appt.status} />
        </div>
        <div className="text-xs text-slate-500">{appt.customerPhone}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
        <div>{format(parseISO(appt.scheduledAt), 'MMM d, yyyy')}</div>
        <div className="text-xs text-slate-500">{format(parseISO(appt.scheduledAt), 'h:mm a')}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
        {appt.vehicleInterest ?? <span className="text-slate-400 italic">None specified</span>}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={appt.status} size="sm" />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
        {appt.assignedStaffName ?? <span className="text-slate-400 italic">Unassigned</span>}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-right">
        <Link
          to={`/appointments/${appt.id}`}
          className="text-xs text-blue-600 hover:underline"
        >
          View →
        </Link>
      </td>
    </tr>
  );
}

export function QueueView({ appointments, statusFilter, onStatusFilterChange }: QueueViewProps) {
  const filtered =
    statusFilter === 'All'
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  const sorted = [...filtered].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  );

  return (
    <div data-testid="queue-view">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Filter by status">
        <button
          type="button"
          onClick={() => onStatusFilterChange('All')}
          className={clsx(
            'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
            statusFilter === 'All'
              ? 'bg-slate-800 text-white border-slate-800'
              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
          )}
          data-testid="filter-all"
        >
          All ({appointments.length})
        </button>
        {ALL_STATUSES.map((s) => {
          const count = appointments.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatusFilterChange(s)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                statusFilter === s
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50',
              )}
              data-testid={`filter-${s.toLowerCase()}`}
            >
              {s === 'NoShow' ? 'No-Show' : s} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-slate-400" data-testid="empty-state">
          No appointments match this filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
          <table className="w-full text-left text-sm" data-testid="appointments-table">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-600">Customer</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Time</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Vehicle Interest</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 font-semibold text-slate-600">Assigned Staff</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((appt) => (
                <AppointmentRow key={appt.id} appt={appt} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
