import { ServiceAreaCardsSchema, type ServiceAreaCard } from "../types/serviceArea";
import { apiClient } from "./client";

export async function fetchServiceAreas(): Promise<ServiceAreaCard[]> {
  const response = await apiClient.get<unknown>("/serviceareas");
  return ServiceAreaCardsSchema.parse(response.data);
}
