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
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
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
          name="(protected)/profile"
          options={{
            headerShown: true,
            headerTitle: "Profile",
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="(protected)/habit/[id]"
          options={{
            headerShown: true,
            headerTitle: "Habit Details",
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="(protected)/habit/add"
          options={{
            headerShown: true,
            headerTitle: "Add Habit",
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="(protected)/habit/calendar"
          options={{
            headerShown: true,
            headerTitle: "Habit Calendar",
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="(protected)/habit/history"
          options={{
            headerShown: true,
            headerTitle: "Habit History",
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="(protected)/habit/stats"
          options={{
            headerShown: true,
            headerTitle: "Habit Statistics",
            headerTitleAlign: "center",
          }}
        />

        <Stack.Screen
          name="(root)/(tabs)/explore"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(root)/(tabs)/index"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  );
}
