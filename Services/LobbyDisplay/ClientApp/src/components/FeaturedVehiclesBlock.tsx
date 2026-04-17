import type { Vehicle } from '../api/schemas'

interface FeaturedVehiclesBlockProps {
  vehicles: Vehicle[]
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price)
}

interface VehicleCardProps {
  vehicle: Vehicle
}

function VehicleCard({ vehicle }: VehicleCardProps): JSX.Element {
  return (
    <div
      className="flex flex-col bg-slate-800 rounded-xl overflow-hidden border border-slate-700"
      data-testid="vehicle-card"
    >
      <div className="h-48 bg-slate-700 flex items-center justify-center overflow-hidden">
        {vehicle.photoUrl !== null ? (
          <img
            src={vehicle.photoUrl}
            alt={`${String(vehicle.year)} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-500 text-5xl">🚗</div>
        )}
      </div>
      <div className="p-6">
        <p className="text-2xl font-bold text-white">
          {String(vehicle.year)} {vehicle.make} {vehicle.model}
        </p>
        <p className="text-3xl font-extrabold text-blue-400 mt-2">
          {formatPrice(vehicle.price)}
        </p>
      </div>
    </div>
  )
}

export function FeaturedVehiclesBlock({ vehicles }: FeaturedVehiclesBlockProps): JSX.Element {
  return (
    <div className="p-8" data-testid="featured-vehicles-block">
      <h2 className="text-3xl font-bold text-white mb-6 text-center uppercase tracking-widest">
        Featured Vehicles
      </h2>
      {vehicles.length === 0 ? (
        <p className="text-xl text-slate-400 text-center">No featured vehicles at this time</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  )
}
