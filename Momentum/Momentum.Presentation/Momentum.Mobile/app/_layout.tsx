import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

import "../global.css";

// This component handles protected routes
function AuthStateChangeListener() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Check if the current route should be protected
  const isProtectedRoute = segments[0] === "(protected)";

  useEffect(() => {
    if (isLoading) return;

    // If the user is not signed in and the route is protected, redirect to signin
    if (!isAuthenticated && isProtectedRoute) {
      router.replace("/sign-in");
    }

    // If the user is signed in and trying to access auth screens, redirect to home
    if (isAuthenticated && segments[0] === "(auth)") {
      router.replace("/home");
    }
  }, [isAuthenticated, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthStateChangeListener />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/sign-in"
          options={{
            headerShown: true,
            headerTitle: "Sign In",
            headerBackTitle: "Back",
            headerBackVisible: true,
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="(auth)/sign-up"
          options={{
            headerShown: true,
            headerTitle: "Sign Up",
            headerBackTitle: "Back",
            headerBackVisible: true,
            headerTitleAlign: "center",
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "white",
            },
            headerTitleStyle: {
              fontWeight: "600",
            },
          }}
        />
        <Stack.Screen
          name="(protected)/home"
          options={{ headerShown: false }}
        />
        {/* Add other screens */}
      </Stack>
    </AuthProvider>
  );
}
