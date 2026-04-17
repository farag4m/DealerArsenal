import { useState } from 'react'
import clsx from 'clsx'
import { useTeam, useMemberDay } from '../hooks/useTeam'
import WorkItemCard from '../components/WorkItemCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import type { TeamMember } from '../types/api'

const OVERLOAD_THRESHOLD_DEFAULT = 10

interface TeamMemberRowProps {
  member: TeamMember
  onViewDay: (id: string) => void
}

function TeamMemberRow({ member, onViewDay }: TeamMemberRowProps): React.JSX.Element {
  const threshold = member.overloadedThreshold > 0
    ? member.overloadedThreshold
    : OVERLOAD_THRESHOLD_DEFAULT
  const isOverloaded = member.assignedCount > threshold

  return (
    <div
      className={clsx(
        'flex items-center justify-between gap-4 rounded-lg border bg-white px-4 py-3 shadow-sm',
        isOverloaded && 'border-orange-200',
        !member.available && 'opacity-60',
      )}
      data-testid="team-member-row"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{member.name}</p>
          {isOverloaded && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
              Overloaded
            </span>
          )}
          {!member.available && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              Unavailable
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500">{member.role}</p>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="text-center">
          <p className="text-base font-semibold text-gray-800">{member.assignedCount}</p>
          <p className="text-xs text-gray-400">Assigned</p>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-green-600">{member.completedToday}</p>
          <p className="text-xs text-gray-400">Done today</p>
        </div>
        {member.blockedCount > 0 && (
          <div className="text-center">
            <p className="text-base font-semibold text-red-600">{member.blockedCount}</p>
            <p className="text-xs text-gray-400">Blocked</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => onViewDay(member.id)}
          className="rounded px-3 py-1.5 text-xs font-medium text-brand-600 border border-brand-200 hover:bg-brand-50 transition-colors"
          aria-label={`View ${member.name}'s day`}
        >
          View Day
        </button>
      </div>
    </div>
  )
}

interface MemberDayPanelProps {
  memberId: string
  memberName: string
  onClose: () => void
}

function MemberDayPanel({ memberId, memberName, onClose }: MemberDayPanelProps): React.JSX.Element {
  const { data, isLoading, isError } = useMemberDay(memberId)
  const items = data?.data ?? []

  return (
    <div
      className="fixed inset-y-0 right-0 w-full max-w-md border-l border-gray-200 bg-white shadow-xl z-10 flex flex-col"
      role="dialog"
      aria-label={`${memberName}'s day`}
      data-testid="member-day-panel"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{memberName}</p>
          <p className="text-xs text-gray-400">Read-only queue</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && <LoadingSpinner message="Loading queue…" />}
        {isError && <ErrorBanner />}
        {!isLoading && !isError && items.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">Nothing assigned today.</p>
        )}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <WorkItemCard key={item.id} item={item} readOnly />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Team(): React.JSX.Element {
  const { data, isLoading, isError } = useTeam()
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)

  const members = data?.data ?? []
  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null

  const rosterGaps = members.filter((m) => !m.available)

  if (isLoading) return <LoadingSpinner message="Loading team…" />
  if (isError) return <ErrorBanner />

  return (
    <div className="px-6 py-6" data-testid="team-page">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Team</h1>
          <p className="mt-1 text-sm text-gray-500">
            {members.length} team member{members.length === 1 ? '' : 's'}
            {rosterGaps.length > 0 && (
              <span className="ml-2 text-amber-600">
                · {rosterGaps.length} unavailable
              </span>
            )}
          </p>
        </div>
      </div>

      {rosterGaps.length > 0 && (
        <div className="mb-4 rounded-md bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          Roster gap: {rosterGaps.map((m) => m.name).join(', ')} unavailable today
        </div>
      )}

      <div className="flex flex-col gap-2">
        {members.map((member) => (
          <TeamMemberRow
            key={member.id}
            member={member}
            onViewDay={(id) => setSelectedMemberId(id)}
          />
        ))}
        {members.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-12">No team members found.</p>
        )}
      </div>

      {selectedMember !== null && (
        <MemberDayPanel
          memberId={selectedMember.id}
          memberName={selectedMember.name}
          onClose={() => setSelectedMemberId(null)}
        />
      )}
    </div>
  )
}
