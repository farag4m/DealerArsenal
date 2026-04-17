export function ErrorScreen(): JSX.Element {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-slate-900"
      data-testid="error-screen"
    >
      <div className="text-center px-8">
        <p className="text-6xl mb-6">⚠️</p>
        <p className="text-3xl text-slate-300 font-semibold">Display Temporarily Unavailable</p>
        <p className="mt-4 text-xl text-slate-500">Reconnecting automatically…</p>
      </div>
    </div>
  )
}
