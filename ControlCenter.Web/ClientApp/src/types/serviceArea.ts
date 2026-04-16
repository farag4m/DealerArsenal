import { z } from "zod";

export const UserRoleSchema = z.enum([
  "Ownership",
  "Management",
  "FrontOfficeBdc",
  "InventoryLogistics",
  "Detailing",
  "Photography",
  "TitleAdmin",
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const ServiceGroupSchema = z.enum([
  "VehiclePreparation",
  "SalesAndCustomer",
  "FinancialAndCloseout",
  "CommandAndControl",
]);

export type ServiceGroup = z.infer<typeof ServiceGroupSchema>;

export const ServiceAreaCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  destinationPath: z.string(),
  group: ServiceGroupSchema,
  relevantRoles: z.array(UserRoleSchema),
});

export type ServiceAreaCard = z.infer<typeof ServiceAreaCardSchema>;

export const ServiceAreaCardsSchema = z.array(ServiceAreaCardSchema);

export const SERVICE_GROUP_LABELS: Record<ServiceGroup, string> = {
  VehiclePreparation: "Vehicle Preparation",
  SalesAndCustomer: "Sales & Customer",
  FinancialAndCloseout: "Financial & Closeout",
  CommandAndControl: "Command & Control",
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  Ownership: "Ownership",
  Management: "Management",
  FrontOfficeBdc: "Front Office / BDC",
  InventoryLogistics: "Inventory / Logistics",
  Detailing: "Detailing",
  Photography: "Photography",
  TitleAdmin: "Title / Admin",
};

export const SERVICE_GROUP_ORDER: ServiceGroup[] = [
  "CommandAndControl",
  "SalesAndCustomer",
  "VehiclePreparation",
  "FinancialAndCloseout",
];
