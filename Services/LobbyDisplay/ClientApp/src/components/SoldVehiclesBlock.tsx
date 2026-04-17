import type { SoldVehicle } from '../api/schemas'

interface SoldVehiclesBlockProps {
  vehicles: SoldVehicle[]
}

function formatSaleDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function SoldVehiclesBlock({ vehicles }: SoldVehiclesBlockProps): JSX.Element {
  return (
    <div className="p-8" data-testid="sold-vehicles-block">
      <h2 className="text-3xl font-bold text-white mb-6 text-center uppercase tracking-widest">
        Recently Sold
      </h2>
      {vehicles.length === 0 ? (
        <p className="text-xl text-slate-400 text-center">No recent sales to display</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vehicles.map((vehicle) => (
            <li
              key={vehicle.id}
              className="flex items-center justify-between bg-slate-800 rounded-xl px-6 py-4 border border-slate-700"
              data-testid="sold-vehicle-item"
            >
              <span className="text-2xl font-semibold text-white flex items-center gap-3">
                <span className="text-green-400">✓</span>
                {vehicle.model}
              </span>
              <span className="text-lg text-slate-400">{formatSaleDate(vehicle.saleDate)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
