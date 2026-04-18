import clsx from 'clsx'
import { useTasks, useVehiclePhotos } from '../hooks/useTasksPhotos'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import type { PhotoStatus } from '../types/api'

const PHOTO_STATUS_STYLES: Record<PhotoStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  complete: 'bg-green-100 text-green-700',
  skipped: 'bg-gray-100 text-gray-500',
}

const PHOTO_STATUS_LABELS: Record<PhotoStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  complete: 'Complete',
  skipped: 'Skipped',
}

export default function TasksPhotos(): React.JSX.Element {
  const tasksQuery = useTasks()
  const photosQuery = useVehiclePhotos()

  const tasks = tasksQuery.data?.data ?? []
  const photos = photosQuery.data?.data ?? []
  const awaitingPhotos = photos.filter((v) => v.awaitingPhotography)

  return (
    <div className="px-6 py-6" data-testid="tasks-photos-page">
      {/* Tasks section */}
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
          <span className="text-sm text-gray-400">{tasks.length} tasks</span>
        </div>

        {tasksQuery.isLoading && <LoadingSpinner message="Loading tasks…" />}
        {tasksQuery.isError && <ErrorBanner />}

        {!tasksQuery.isLoading && !tasksQuery.isError && tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">No tasks found.</p>
        )}

        {tasks.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm" aria-label="Tasks">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Task</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Vehicle</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Owner</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Priority</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{task.title}</td>
                    <td className="px-4 py-3 text-gray-500">{task.vehicleLabel ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{task.ownerName ?? '—'}</td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-3 text-gray-400">{task.dueDate ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Photo Tracking section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Photo Tracking</h2>
          {awaitingPhotos.length > 0 && (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
              {awaitingPhotos.length} awaiting photography
            </span>
          )}
        </div>

        {photosQuery.isLoading && <LoadingSpinner message="Loading photo status…" />}
        {photosQuery.isError && <ErrorBanner />}

        {!photosQuery.isLoading && !photosQuery.isError && photos.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">No vehicles tracked.</p>
        )}

        {photos.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                className={clsx(
                  'rounded-lg border bg-white p-4 shadow-sm',
                  vehicle.awaitingPhotography && 'border-yellow-200',
                )}
                data-testid="vehicle-photo-card"
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900">{vehicle.vehicleLabel}</p>
                  <span
                    className={clsx(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                      PHOTO_STATUS_STYLES[vehicle.photoStatus],
                    )}
                  >
                    {PHOTO_STATUS_LABELS[vehicle.photoStatus]}
                  </span>
                </div>
                {vehicle.vin !== null && (
                  <p className="text-xs text-gray-400">VIN: {vehicle.vin}</p>
                )}
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{vehicle.photoCount} photo{vehicle.photoCount === 1 ? '' : 's'}</span>
                  {vehicle.lastPhotoDate !== null && (
                    <span>Last: {vehicle.lastPhotoDate}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
