import clsx from 'clsx';
import type { ReconIssue } from '../types';
import { AgingBadge } from './AgingBadge';
import { ApprovalBadge } from './ApprovalBadge';
import { EscalationFlag } from './EscalationFlag';

interface VehicleCardProps {
  issue: ReconIssue;
  onSelect: (issueId: string) => void;
}

export function VehicleCard({ issue, onSelect }: VehicleCardProps): JSX.Element {
  const handleClick = (): void => {
    onSelect(issue.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(issue.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500',
        issue.isEscalated && 'border-red-300',
        !issue.isEscalated && 'border-gray-200',
      )}
      data-testid="vehicle-card"
      aria-label={`${issue.year} ${issue.make} ${issue.model} — Stock ${issue.stockNumber}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {issue.year} {issue.make} {issue.model}
          </p>
          <p className="text-xs text-gray-500">Stock #{issue.stockNumber}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <AgingBadge daysInRecon={issue.daysInRecon} />
          <EscalationFlag isEscalated={issue.isEscalated} />
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
        {issue.issueDescription}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <ApprovalBadge status={issue.approvalStatus} />
        <span className="text-xs text-gray-500">
          Est: ${issue.costEstimate.toLocaleString()}
        </span>
      </div>

      {issue.assignedTo && (
        <p className="mt-1 text-xs text-gray-400">
          Assigned: {issue.assignedTo}
        </p>
      )}
    </div>
  );
}
