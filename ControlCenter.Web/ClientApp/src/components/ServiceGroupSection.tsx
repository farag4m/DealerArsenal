import { ServiceCard } from "./ServiceCard";
import { type ServiceGroup, type ServiceAreaCard } from "../types/serviceArea";

interface ServiceGroupSectionProps {
  group: ServiceGroup;
  label: string;
  visibleCards: ServiceAreaCard[];
  dimmedCards: ServiceAreaCard[];
}

export function ServiceGroupSection({
  label,
  visibleCards,
  dimmedCards,
}: ServiceGroupSectionProps): JSX.Element {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        {label}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleCards.map((card) => (
          <ServiceCard key={card.id} card={card} dimmed={false} />
        ))}
        {dimmedCards.map((card) => (
          <ServiceCard key={card.id} card={card} dimmed={true} />
        ))}
      </div>
    </section>
  );
}
