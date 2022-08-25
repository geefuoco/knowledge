import type { User, HttpError } from "../config/types";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { loginToServer } from "../api/login";
import {
  storeLocalUser,
  removeLocalUser,
  getLocalUser,
} from "../api/localStore";
import { logoutUser } from "../api/logout";

type AuthProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getLocalUser());

  useEffect(() => {
    if (user) {
      storeLocalUser(user);
    }
  }, [user]);

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<HttpError | null> => {
    const response = await loginToServer(email, password);
    if (response) {
      if ("message" in response) {
        return response;
      }
      setUser(response);
    }
    return null;
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    removeLocalUser();
  };

  const contextValue = {
    user,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
