import { useState } from 'react';
import { useReconIssue } from '../hooks';
import { AgingBadge } from './AgingBadge';
import { ApprovalBadge } from './ApprovalBadge';
import { EscalationFlag } from './EscalationFlag';
import { NotesLog } from './NotesLog';
import { ApprovalModal } from './ApprovalModal';

interface IssueDetailModalProps {
  issueId: string;
  onClose: () => void;
}

export function IssueDetailModal({
  issueId,
  onClose,
}: IssueDetailModalProps): JSX.Element {
  const { data, isLoading, isError } = useReconIssue(issueId);
  const [showApproval, setShowApproval] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/50 py-10"
      onClick={handleBackdropClick}
      data-testid="issue-detail-modal"
    >
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Issue Detail</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Close"
            data-testid="close-modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {isLoading && (
            <p className="py-8 text-center text-sm text-gray-500" data-testid="loading">
              Loading…
            </p>
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-red-600" data-testid="error">
              Failed to load issue details.
            </p>
          )}

          {data && (
            <div className="space-y-6">
              {/* Vehicle Context */}
              <section>
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {data.data.year} {data.data.make} {data.data.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Stock #{data.data.stockNumber}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <AgingBadge daysInRecon={data.data.daysInRecon} />
                    <EscalationFlag isEscalated={data.data.isEscalated} />
                  </div>
                </div>
              </section>

              {/* Issue Info */}
              <section className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4 text-sm">
                <div>
                  <p className="font-medium text-gray-500">Issue</p>
                  <p className="mt-1 text-gray-900">{data.data.issueDescription}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Cost Estimate</p>
                  <p className="mt-1 text-gray-900">
                    ${data.data.costEstimate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Approval Status</p>
                  <div className="mt-1">
                    <ApprovalBadge status={data.data.approvalStatus} />
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-500">Assigned To</p>
                  <p className="mt-1 text-gray-900">{data.data.assignedTo || '—'}</p>
                </div>
                {data.data.partsStatus && (
                  <div>
                    <p className="font-medium text-gray-500">Parts Status</p>
                    <p className="mt-1 capitalize text-gray-900">
                      {data.data.partsStatus}
                    </p>
                  </div>
                )}
              </section>

              {/* Vendor Handoff */}
              {data.data.vendorHandoff && (
                <section>
                  <h4 className="text-sm font-semibold text-gray-700">
                    Vendor Handoff
                  </h4>
                  <div className="mt-2 grid grid-cols-3 gap-3 rounded-lg bg-blue-50 p-3 text-sm">
                    <div>
                      <p className="text-xs font-medium text-blue-600">Vendor</p>
                      <p className="mt-0.5 text-gray-900">
                        {data.data.vendorHandoff.vendorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600">Date Sent</p>
                      <p className="mt-0.5 text-gray-900">
                        {data.data.vendorHandoff.dateSent}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600">
                        Expected Return
                      </p>
                      <p className="mt-0.5 text-gray-900">
                        {data.data.vendorHandoff.expectedReturn}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Cross-service links */}
              <section>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Related Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`/vendors?stock=${data.data.stockNumber}`}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    data-testid="link-vendors"
                  >
                    Vendors →
                  </a>
                  <a
                    href={`/vehicles/${data.data.stockNumber}`}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    data-testid="link-vehicles"
                  >
                    Vehicle Record →
                  </a>
                  <a
                    href={`/diagnostics?stock=${data.data.stockNumber}`}
                    className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    data-testid="link-diagnostics"
                  >
                    Diagnostics →
                  </a>
                </div>
              </section>

              {/* Approval Action */}
              {data.data.approvalStatus === 'pending' && (
                <section>
                  <button
                    type="button"
                    onClick={() => setShowApproval(true)}
                    className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
                    data-testid="open-approval"
                  >
                    Make Approval Decision
                  </button>
                </section>
              )}

              {/* Notes */}
              <section>
                <NotesLog issueId={issueId} notes={data.data.notes} />
              </section>
            </div>
          )}
        </div>
      </div>

      {showApproval && (
        <ApprovalModal
          issueId={issueId}
          onClose={() => setShowApproval(false)}
        />
      )}
    </div>
  );
}
