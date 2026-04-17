import { useState, useMemo } from 'react';
import { useReconQueue } from '../hooks';
import { QueueTab, VehicleCard, IssueDetailModal } from '../components';
import { SEGMENT_ORDER } from '../constants';
import type { QueueSegment, ReconIssue } from '../types';

export default function ReconQueuePage(): JSX.Element {
  const [activeSegment, setActiveSegment] = useState<QueueSegment>('needs_decision');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [managerSort, setManagerSort] = useState<'age' | 'status'>('age');
  const [filterEscalated, setFilterEscalated] = useState(false);

  const { data, isLoading, isError, refetch } = useReconQueue(activeSegment);

  const sortedIssues = useMemo((): ReconIssue[] => {
    const issues: ReconIssue[] = data?.data.items ?? [];
    let result = [...issues];
    if (filterEscalated) {
      result = result.filter((i) => i.isEscalated);
    }
    if (managerSort === 'age') {
      result.sort((a, b) => b.daysInRecon - a.daysInRecon);
    } else {
      result.sort((a, b) => a.approvalStatus.localeCompare(b.approvalStatus));
    }
    return result;
  }, [data, managerSort, filterEscalated]);

  // Segment counts — use the loaded segment count for the active tab;
  // other tabs show 0 until visited (we don't over-fetch all segments at once)
  const segmentCount = data?.data.total ?? 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Recon Queue</h1>
            <p className="text-sm text-gray-500">
              Reconditioning decisions, tracking, and accountability
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            data-testid="refresh-button"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Segment tabs */}
      <div className="border-b bg-white px-6" role="tablist" aria-label="Queue segments">
        <div className="flex overflow-x-auto">
          {SEGMENT_ORDER.map((segment) => (
            <QueueTab
              key={segment}
              segment={segment}
              count={activeSegment === segment ? segmentCount : 0}
              isActive={activeSegment === segment}
              onSelect={setActiveSegment}
            />
          ))}
        </div>
      </div>

      {/* Manager controls */}
      <div className="flex items-center gap-4 border-b bg-white px-6 py-2">
        <span className="text-xs font-medium text-gray-500">Manager View:</span>
        <label className="flex items-center gap-1.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={filterEscalated}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilterEscalated(e.target.checked)
            }
            className="rounded border-gray-300 text-brand-600"
            data-testid="filter-escalated"
          />
          Escalated only
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Sort:</span>
          <select
            value={managerSort}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setManagerSort(e.target.value as 'age' | 'status')
            }
            className="rounded border-gray-200 py-0.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            data-testid="sort-select"
          >
            <option value="age">Age (oldest first)</option>
            <option value="status">Approval Status</option>
          </select>
        </div>
      </div>

      {/* Queue content */}
      <main className="px-6 py-6" role="tabpanel">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-500" data-testid="queue-loading">
              Loading queue…
            </p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-red-600" data-testid="queue-error">
              Failed to load queue. Please refresh.
            </p>
          </div>
        )}

        {!isLoading && !isError && sortedIssues.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-400" data-testid="queue-empty">
              No vehicles in this segment.
            </p>
          </div>
        )}

        {!isLoading && !isError && sortedIssues.length > 0 && (
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            data-testid="vehicle-grid"
          >
            {sortedIssues.map((issue) => (
              <VehicleCard
                key={issue.id}
                issue={issue}
                onSelect={setSelectedIssueId}
              />
            ))}
          </div>
        )}
      </main>

      {/* Issue detail modal */}
      {selectedIssueId !== null && (
        <IssueDetailModal
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
        />
      )}
    </div>
  );
}
