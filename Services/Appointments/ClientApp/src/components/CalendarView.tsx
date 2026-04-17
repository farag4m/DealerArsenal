import { clsx } from 'clsx';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppointmentListItem } from '../api/schemas';
import { StatusBadge } from './StatusBadge';

interface CalendarViewProps {
  appointments: AppointmentListItem[];
}

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function AppointmentChip({ appt }: { appt: AppointmentListItem }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => void navigate(`/appointments/${appt.id}`)}
      className="w-full text-left truncate rounded px-1 py-0.5 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
      title={`${appt.customerName} — ${format(parseISO(appt.scheduledAt), 'h:mm a')}`}
      data-testid="calendar-chip"
    >
      {format(parseISO(appt.scheduledAt), 'h:mm a')} {appt.customerName}
    </button>
  );
}

export function CalendarView({ appointments }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState<Date>(() => new Date());

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function appsOnDay(day: Date): AppointmentListItem[] {
    return appointments.filter((a) => isSameDay(parseISO(a.scheduledAt), day));
  }

  return (
    <div data-testid="calendar-view">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, -1))}
          className="p-2 rounded hover:bg-slate-100 transition-colors text-slate-600"
          aria-label="Previous month"
          data-testid="prev-month"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold text-slate-800" data-testid="month-label">
          {format(viewDate, 'MMMM yyyy')}
        </h2>
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="p-2 rounded hover:bg-slate-100 transition-colors text-slate-600"
          aria-label="Next month"
          data-testid="next-month"
        >
          →
        </button>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-1">
        {DOW_LABELS.map((label) => (
          <div key={label} className="py-2 text-center text-xs font-semibold text-slate-500">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-l border-t border-slate-200 rounded-lg overflow-hidden">
        {days.map((day) => {
          const dayAppts = appsOnDay(day);
          const isCurrentMonth = isSameMonth(day, viewDate);
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={clsx(
                'min-h-[80px] p-1 border-r border-b border-slate-200',
                !isCurrentMonth && 'bg-slate-50',
                today && 'bg-blue-50',
              )}
              data-testid="calendar-day"
              data-date={format(day, 'yyyy-MM-dd')}
            >
              <div
                className={clsx(
                  'text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full',
                  today
                    ? 'bg-blue-600 text-white'
                    : isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-400',
                )}
              >
                {format(day, 'd')}
              </div>
              <div className="flex flex-col gap-0.5">
                {dayAppts.slice(0, 3).map((a) => (
                  <AppointmentChip key={a.id} appt={a} />
                ))}
                {dayAppts.length > 3 && (
                  <span className="text-xs text-slate-400 px-1">
                    +{dayAppts.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="font-medium">Status:</span>
        {(['Scheduled', 'Confirmed', 'Arrived', 'Completed'] as const).map((s) => (
          <span key={s} className="flex items-center gap-1">
            <StatusBadge status={s} size="sm" />
            {appointments.filter((a) => a.status === s).length}
          </span>
        ))}
      </div>
    </div>
  );
}
