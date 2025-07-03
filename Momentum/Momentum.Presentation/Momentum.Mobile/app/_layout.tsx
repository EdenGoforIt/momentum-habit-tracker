// Import  global CSS file
import "../global.css";

import { APIProvider } from "@/api";
import { hydrateAuth } from "@/lib";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(app)",
};

hydrateAuth();

export default function RootLayout() {
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerBackVisible: false,
          headerShown: false,
        }}
      />
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.container}>
      <APIProvider>
        <BottomSheetModalProvider>
          {children}
          <FlashMessage position="top" />
        </BottomSheetModalProvider>
      </APIProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
