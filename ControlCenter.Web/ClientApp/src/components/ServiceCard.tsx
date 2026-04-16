import clsx from "clsx";
import { type ServiceAreaCard, USER_ROLE_LABELS } from "../types/serviceArea";

interface ServiceCardProps {
  card: ServiceAreaCard;
  dimmed: boolean;
}

// Redirect to the owning microservice URL. ControlCenter.Web never hosts
// service-specific workflows — it only redirects.
function handleLaunch(destinationPath: string): void {
  window.location.href = destinationPath;
}

export function ServiceCard({ card, dimmed }: ServiceCardProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => handleLaunch(card.destinationPath)}
      aria-label={`Open ${card.title}`}
      disabled={dimmed}
      className={clsx(
        "group relative flex flex-col gap-3 rounded-xl border p-5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        dimmed
          ? "cursor-not-allowed border-gray-200 bg-white opacity-40"
          : "cursor-pointer border-gray-200 bg-white shadow-sm hover:border-brand-400 hover:shadow-md active:scale-[0.98]"
      )}
    >
      {/* Title */}
      <span
        className={clsx(
          "text-sm font-semibold",
          dimmed ? "text-gray-400" : "text-gray-900 group-hover:text-brand-700"
        )}
      >
        {card.title}
      </span>

      {/* Description */}
      <p className="text-xs leading-relaxed text-gray-500 line-clamp-3">
        {card.description}
      </p>

      {/* Role tags */}
      <div className="flex flex-wrap gap-1 mt-auto pt-1">
        {card.relevantRoles.map((role) => (
          <span
            key={role}
            className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500"
          >
            {USER_ROLE_LABELS[role]}
          </span>
        ))}
      </div>

      {/* Launch arrow — only on active cards */}
      {!dimmed && (
        <span
          className="absolute right-4 top-4 text-gray-300 group-hover:text-brand-500 transition-colors"
          aria-hidden="true"
        >
          →
        </span>
      )}
    </button>
  );
}
