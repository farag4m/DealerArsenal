import { useQuery } from "@tanstack/react-query";
import { fetchServiceAreas } from "../api/serviceAreas";
import { ServiceGroupSection } from "../components/ServiceGroupSection";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorBanner } from "../components/ErrorBanner";
import { useAuthUser } from "../components/useAuthUser";
import { QUERY_KEYS } from "../constants/queryKeys";
import {
  SERVICE_GROUP_ORDER,
  SERVICE_GROUP_LABELS,
  type ServiceGroup,
  type ServiceAreaCard,
} from "../types/serviceArea";

export function LauncherPage(): JSX.Element {
  const { user } = useAuthUser();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.serviceAreas,
    queryFn: fetchServiceAreas,
    staleTime: 5 * 60 * 1000, // 5 min — registry is static
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || data === undefined) {
    return (
      <ErrorBanner
        message={
          error instanceof Error
            ? error.message
            : "Failed to load service areas."
        }
      />
    );
  }

  const cardsByGroup: Record<ServiceGroup, ServiceAreaCard[]> =
    SERVICE_GROUP_ORDER.reduce<Record<ServiceGroup, ServiceAreaCard[]>>(
      (acc, group) => {
        acc[group] = data.filter((card) => card.group === group);
        return acc;
      },
      {
        CommandAndControl: [],
        SalesAndCustomer: [],
        VehiclePreparation: [],
        FinancialAndCloseout: [],
      }
    );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-brand-700 tracking-tight">
            F&amp;F Ops Hub
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Control Center</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">{user.name}</p>
          <p className="text-xs text-gray-400">{user.role}</p>
        </div>
      </header>

      {/* Main grid */}
      <main className="max-w-screen-xl mx-auto px-6 py-8 space-y-10">
        {SERVICE_GROUP_ORDER.map((group) => {
          const cards = cardsByGroup[group];
          if (cards.length === 0) return null;

          const visibleCards = cards.filter((card) =>
            card.relevantRoles.includes(user.role)
          );
          const dimmedCards = cards.filter(
            (card) => !card.relevantRoles.includes(user.role)
          );

          return (
            <ServiceGroupSection
              key={group}
              group={group}
              label={SERVICE_GROUP_LABELS[group]}
              visibleCards={visibleCards}
              dimmedCards={dimmedCards}
            />
          );
        })}
      </main>
    </div>
  );
}
