export function LoadingSpinner(): JSX.Element {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <span className="text-sm text-gray-500">Loading service areas&hellip;</span>
    </div>
  );
}
