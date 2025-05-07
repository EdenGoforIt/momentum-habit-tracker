import { Stack } from "expo-router";

export default function HabitLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: "Habit Details",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          headerShown: true,
          headerTitle: "Add Habit",
          headerTitleAlign: "center",
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
        }}
      />
      <Stack.Screen
        name="stats"
        options={{
          headerShown: true,
          headerTitle: "Habit Statistics",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
