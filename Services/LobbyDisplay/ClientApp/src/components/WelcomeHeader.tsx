import type { DealershipInfo } from '../api/schemas'

interface WelcomeHeaderProps {
  dealership: DealershipInfo
}

export function WelcomeHeader({ dealership }: WelcomeHeaderProps): JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-8 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-slate-700"
      data-testid="welcome-header"
    >
      <h1 className="text-6xl font-bold text-white tracking-tight text-center">
        {dealership.name}
      </h1>
      {dealership.tagline !== null && (
        <p className="mt-4 text-2xl text-slate-300 text-center font-light">
          {dealership.tagline}
        </p>
      )}
      <p className="mt-3 text-xl text-blue-400 font-medium">
        Welcome — We&apos;re glad you&apos;re here
      </p>
    </div>
  )
}
