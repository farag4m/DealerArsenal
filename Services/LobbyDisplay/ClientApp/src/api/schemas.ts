import { z } from 'zod'

export const AppointmentSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  arrivalTime: z.string(), // ISO 8601 time string e.g. "14:30"
})

export const VehicleSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  make: z.string(),
  model: z.string(),
  price: z.number(),
  photoUrl: z.url().nullable(),
})

export const SoldVehicleSchema = z.object({
  id: z.string(),
  model: z.string(),
  saleDate: z.string(), // ISO date string e.g. "2025-03-15"
})

export const ReputationSchema = z.object({
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
})

export const DealershipInfoSchema = z.object({
  name: z.string(),
  tagline: z.string().nullable(),
  phone: z.string(),
  address: z.string(),
  hours: z.array(
    z.object({
      days: z.string(),
      hours: z.string(),
    })
  ),
})

export const LobbyDisplayDataSchema = z.object({
  dealership: DealershipInfoSchema,
  appointments: z.array(AppointmentSchema),
  featuredVehicles: z.array(VehicleSchema),
  soldVehicles: z.array(SoldVehicleSchema),
  reputation: ReputationSchema,
})

export type Appointment = z.infer<typeof AppointmentSchema>
export type Vehicle = z.infer<typeof VehicleSchema>
export type SoldVehicle = z.infer<typeof SoldVehicleSchema>
export type Reputation = z.infer<typeof ReputationSchema>
export type DealershipInfo = z.infer<typeof DealershipInfoSchema>
export type LobbyDisplayData = z.infer<typeof LobbyDisplayDataSchema>
