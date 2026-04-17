import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppointmentDetailPage } from './pages/AppointmentDetailPage';
import { AppointmentsPage } from './pages/AppointmentsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/appointments" replace />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/:id" element={<AppointmentDetailPage />} />
      </Routes>
    </QueryClientProvider>
  );
}
