import { Stack } from "expo-router";

export default function HabitLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackVisible: true,
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Habit Details",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerTitle: "Add Habit",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          headerShown: true,
          headerTitle: "Habit Calendar",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          headerShown: true,
          headerTitle: "Habit History",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="stats"
        options={{
          headerShown: true,
          headerTitle: "Habit Statistics",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
        }}
      />
    </Stack>
  );
}
