interface ErrorBannerProps {
  message?: string
}

export default function ErrorBanner({ message = 'Something went wrong. Please try again.' }: ErrorBannerProps): React.JSX.Element {
  return (
    <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
      {message}
    </div>
  )
}
