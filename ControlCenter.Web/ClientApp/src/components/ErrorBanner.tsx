interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps): JSX.Element {
  return (
    <div
      role="alert"
      className="m-8 rounded-lg border border-red-200 bg-red-50 px-6 py-5"
    >
      <p className="text-sm font-semibold text-red-700">Unable to load service areas</p>
      <p className="mt-1 text-xs text-red-500">{message}</p>
    </div>
  );
}
