import { createContext } from "react";

type ContextType = {
  onLogin: (email: string, password: string) => Promise<HttpError | null>;
  onLogout: () => void;
  user: (() => number | null) | number | null;
};

export type HttpError = {
  statusCode: number;
  name: string;
  message: string;
};

export const AuthContext = createContext<ContextType>({
  onLogin: () => Promise.resolve(null),
  onLogout: () => undefined,
  user: null,
});
