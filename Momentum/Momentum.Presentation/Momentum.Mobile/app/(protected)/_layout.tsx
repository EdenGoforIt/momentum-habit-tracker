// app/(protected)/_layout.tsx
import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          headerTitle: "Profile",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
