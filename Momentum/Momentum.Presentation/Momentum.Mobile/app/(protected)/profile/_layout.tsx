import { Header } from "@/components/common";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* This 'index' screen will be your actual 'menu' content */}
      <Stack.Screen
        name="index" // <-- Changed from "menu" to "index"
        options={{
          header: () => <Header title="Profile" showClose={true} />,
        }}
      />

      <Stack.Screen
        name="support" // This implies app/(profile)/support.tsx
        options={{
          header: () => <Header title="Help & Support" showClose={true} />,
        }}
      />
      <Stack.Screen
        name="about" // This implies app/(profile)/about.tsx
        options={{
          header: () => <Header title="About Momentum" showClose={true} />,
        }}
      />
    </Stack>
  );
}
