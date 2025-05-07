import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-in"
        options={{
          headerShown: true,
          headerTitle: "Sign In",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: true,
          headerTitle: "Sign Up",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
