import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Profile",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          headerTitle: "Change Password",
          headerTitleAlign: "center",
          presentation: "card", // Standard push navigation
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerTitle: "Edit Profile",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="support"
        options={{
          headerTitle: "Help & Support",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerTitle: "About Momentum",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="privacy-policy"
        options={{
          headerTitle: "Privacy Policy",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="update-email"
        options={{
          headerTitle: "Update Email",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
