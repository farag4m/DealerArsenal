/* eslint-disable react-refresh/only-export-components -- Context objects must be co-exported with their Provider */
import { createContext, type ReactNode } from "react";
import { type AuthUser, PLACEHOLDER_USER } from "../types/auth";

export interface AuthContextValue {
  user: AuthUser;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  // In production this comes from a decoded JWT via ASP.NET Core's /api/auth/me endpoint.
  // For now we inject it as a prop so the launcher renders without a backend running.
  user?: AuthUser;
}

export function AuthProvider({
  children,
  user = PLACEHOLDER_USER,
}: AuthProviderProps): JSX.Element {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
