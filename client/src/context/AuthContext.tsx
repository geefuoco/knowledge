import type { AuthContextType } from "../config/types";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType>({
  onLogin: () => Promise.resolve(null),
  onLogout: () => undefined,
  user: null,
});
