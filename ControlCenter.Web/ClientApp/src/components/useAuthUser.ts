import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "./AuthContext";

export function useAuthUser(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuthUser must be used inside <AuthProvider>");
  }
  return ctx;
}
