import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  userToken: string | null;
  userData: any;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is logged in on app startup
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userDataString = await AsyncStorage.getItem("userData");

        if (token && userDataString) {
          setUserToken(token);
          setUserData(JSON.parse(userDataString));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Failed to get authentication state", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (token: string, userData: any) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      await AsyncStorage.setItem("isLoggedIn", "true");

      setUserToken(token);
      setUserData(userData);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Failed to save auth data", e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("isLoggedIn");

      setUserToken(null);
      setUserData(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Failed to remove auth data", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userToken,
        userData,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
