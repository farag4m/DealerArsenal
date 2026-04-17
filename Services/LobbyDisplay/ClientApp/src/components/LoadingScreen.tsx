export function LoadingScreen(): JSX.Element {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-slate-900"
      data-testid="loading-screen"
    >
      <div className="text-center">
        <div className="inline-block w-16 h-16 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
        <p className="mt-6 text-2xl text-slate-400">Loading display…</p>
      </div>
    </div>
  )
}
