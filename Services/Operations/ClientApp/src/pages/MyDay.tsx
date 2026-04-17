import { useMyDay, useMarkComplete, useFlagBlocked, useSnooze } from '../hooks/useMyDay'
import WorkItemCard from '../components/WorkItemCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

export default function MyDay(): React.JSX.Element {
  const { data, isLoading, isError } = useMyDay()
  const markComplete = useMarkComplete()
  const flagBlocked = useFlagBlocked()
  const snooze = useSnooze()

  const handleSnooze = (id: string): void => {
    const until = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    snooze.mutate({ id, until })
  }

  if (isLoading) return <LoadingSpinner message="Loading your day…" />
  if (isError) return <ErrorBanner />

  const items = data?.data ?? []
  const activeItems = items.filter((i) => i.status !== 'done' && i.snoozedUntil === null)

  return (
    <div className="px-6 py-6" data-testid="my-day-page">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My Day</h1>
        <p className="mt-1 text-sm text-gray-500">
          {activeItems.length > 0
            ? `${activeItems.length} item${activeItems.length === 1 ? '' : 's'} assigned today`
            : 'Nothing assigned for today'}
        </p>
      </div>

      {activeItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center"
          data-testid="empty-state"
        >
          <p className="text-3xl">✓</p>
          <p className="mt-3 text-base font-medium text-gray-700">All clear for today</p>
          <p className="mt-1 text-sm text-gray-400">
            Check back later or grab a task from the Board.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeItems.map((item) => (
            <WorkItemCard
              key={item.id}
              item={item}
              onComplete={(id) => markComplete.mutate(id)}
              onBlock={(id) => flagBlocked.mutate(id)}
              onSnooze={handleSnooze}
            />
          ))}
        </div>
      )}

      {items.some((i) => i.status === 'done') && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-medium text-gray-400 uppercase tracking-wide">
            Completed
          </h2>
          <div className="flex flex-col gap-3">
            {items
              .filter((i) => i.status === 'done')
              .map((item) => (
                <WorkItemCard key={item.id} item={item} readOnly />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
