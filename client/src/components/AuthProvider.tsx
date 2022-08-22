import { useState } from "react";
import { AuthContext, HttpError } from "../context/AuthContext";
import { loginToServer } from "../api/login";
import { storeLocalUser, removeLocalUser } from "../api/localStore";

type AuthProps = {
  children: React.ReactNode;
};

const AuthProvider: React.FC<AuthProps> = ({ children }) => {
  const [user, setUser] = useState<number | null>(null);

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<HttpError | null> => {
    const response = await loginToServer(email, password);
    if (response) {
      if ("message" in response) {
        return response;
      }
      setUser(response.id);
      storeLocalUser(response.id);
    }
    return null;
  };

  const handleLogout = () => {
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
