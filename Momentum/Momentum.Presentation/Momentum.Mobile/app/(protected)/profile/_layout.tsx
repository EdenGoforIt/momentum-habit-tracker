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
        name="change-password" // This implies app/(profile)/change-password.tsx
        options={{
          header: () => (
            <Header title="Change Password" showBack={true} showClose={true} />
          ),
        }}
      />
      {/* ... and so on for your other Stack.Screen components */}
      <Stack.Screen
        name="edit" // This implies app/(profile)/edit.tsx
        options={{
          header: () => <Header title="Edit Profile" showClose={true} />,
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
      <Stack.Screen
        name="privacy-policy" // This implies app/(profile)/privacy-policy.tsx
        options={{
          header: () => <Header title="Privacy Policy" showClose={true} />,
        }}
      />
      <Stack.Screen
        name="update-email" // This implies app/(profile)/update-email.tsx
        options={{
          header: () => <Header title="Update Email" showClose={true} />,
        }}
      />
    </Stack>
  );
}
