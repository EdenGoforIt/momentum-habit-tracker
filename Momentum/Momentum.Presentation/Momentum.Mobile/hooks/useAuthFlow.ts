import type { UserDto } from "@/api";
import { ROUTENAMES } from "@/constants";
import { useAuth } from "@/lib/auth";
import { dumpStorage } from "@/lib/storage";
import { showErrorAlert } from "@/utils/errorHandler";
import { router } from "expo-router";
import { useState } from "react";

export const useAuthFlow = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, setUser } = useAuth();

  const handleAuthSuccess = async (
    loginData: any,
    userFetcher: () => Promise<any>,
    redirectPath: string = ROUTENAMES.HOME
  ) => {
    try {
      // Store authentication tokens
      signIn({
        accessToken: loginData.accessToken,
        expiresIn: loginData.expiresIn,
        refreshToken: loginData.refreshToken,
      });

      // Fetch user profile
      const userResult = await userFetcher();
      console.log("User profile fetched:", userResult);

      if (userResult.data) {
        setUser(userResult.data as UserDto);
        console.log("User profile fetched:", userResult.data);
      } else {
        console.warn("User fetch succeeded but no data returned");
      }

      // TODO: remove
      dumpStorage();

      // Navigate to protected area
      router.replace(redirectPath as any);
    } catch (error) {
      console.error("Auth flow error:", error);
      showErrorAlert(error);
      // Still navigate on user fetch failure since login was successful
      router.replace(redirectPath as any);
    }
  };

  const executeAuthFlow = async (
    authAction: () => Promise<any>,
    userFetcher: () => Promise<any>,
    redirectPath?: string
  ) => {
    setIsLoading(true);
    try {
      const loginData = await authAction();
      console.log("Auth action successful:", loginData);

      await handleAuthSuccess(loginData, userFetcher, redirectPath);
    } catch (error) {
      console.error("Authentication error:", error);
      showErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    executeAuthFlow,
  };
};
