import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./components/AuthContext";
// useAuthUser is exported separately to satisfy React Fast Refresh rules
import { LauncherPage } from "./pages/launcher";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {/* AuthProvider uses placeholder user in dev; production will inject from JWT */}
      <AuthProvider>
        <LauncherPage />
      </AuthProvider>
    </QueryClientProvider>
  );
}
