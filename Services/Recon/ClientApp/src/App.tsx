import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const ReconQueuePage = lazy(() => import('./pages/recon-queue'));

export default function App(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<ReconQueuePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
