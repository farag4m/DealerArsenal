import type { Appointment } from '../api/schemas'

interface AppointmentsBlockProps {
  appointments: Appointment[]
}

function formatTime(timeStr: string): string {
  const [hourStr, minuteStr] = timeStr.split(':')
  if (hourStr === undefined || minuteStr === undefined) return timeStr
  const hour = parseInt(hourStr, 10)
  const minute = minuteStr
  if (isNaN(hour)) return timeStr
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${String(displayHour)}:${minute} ${ampm}`
}

export function AppointmentsBlock({ appointments }: AppointmentsBlockProps): JSX.Element {
  return (
    <div className="p-8" data-testid="appointments-block">
      <h2 className="text-3xl font-bold text-white mb-6 text-center uppercase tracking-widest">
        Upcoming Appointments
      </h2>
      {appointments.length === 0 ? (
        <p className="text-xl text-slate-400 text-center">No upcoming appointments</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li
              key={appt.id}
              className="flex items-center justify-between bg-slate-800 rounded-xl px-8 py-5 border border-slate-700"
              data-testid="appointment-item"
            >
              <span className="text-3xl font-semibold text-white">{appt.firstName}</span>
              <span className="text-2xl font-bold text-blue-400">{formatTime(appt.arrivalTime)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
