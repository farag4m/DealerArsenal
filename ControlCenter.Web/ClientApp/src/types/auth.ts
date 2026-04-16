import { z } from "zod";
import { UserRoleSchema } from "./serviceArea";

export const AuthUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: UserRoleSchema,
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

// Placeholder — real auth context comes from JWT claims served by ASP.NET Core auth
export const PLACEHOLDER_USER: AuthUser = {
  id: "dev-user-1",
  name: "Dev User",
  email: "dev@dealer.local",
  role: "Management",
};
