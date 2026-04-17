import type { Reputation } from '../api/schemas'

interface ReputationBlockProps {
  reputation: Reputation
}

interface StarRatingProps {
  rating: number
}

function StarRating({ rating }: StarRatingProps): JSX.Element {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${String(rating)} out of 5 stars`}>
      {Array.from({ length: full }, (_, i) => (
        <span key={`full-${String(i)}`} className="text-yellow-400 text-5xl">★</span>
      ))}
      {hasHalf && <span className="text-yellow-400 text-5xl">½</span>}
      {Array.from({ length: empty }, (_, i) => (
        <span key={`empty-${String(i)}`} className="text-slate-600 text-5xl">★</span>
      ))}
    </div>
  )
}

export function ReputationBlock({ reputation }: ReputationBlockProps): JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center p-10 bg-slate-800 rounded-2xl border border-slate-700 mx-8"
      data-testid="reputation-block"
    >
      <h2 className="text-3xl font-bold text-white mb-6 text-center uppercase tracking-widest">
        What Our Customers Say
      </h2>
      <StarRating rating={reputation.rating} />
      <p className="mt-4 text-4xl font-extrabold text-white">
        {reputation.rating.toFixed(1)}
      </p>
      <p className="mt-2 text-xl text-slate-400">
        Based on {reputation.reviewCount.toLocaleString()} reviews
      </p>
    </div>
  )
}
