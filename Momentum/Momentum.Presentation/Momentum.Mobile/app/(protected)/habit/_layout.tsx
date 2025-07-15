import { Header } from "@/components/common";
import { Stack } from "expo-router";

export default function HabitLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          header: () => <Header title="Habit Details" />,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          header: () => <Header title="Add Habit" showClose={true} />,
        }}
      />
      <Stack.Screen
        name="calendar"
        options={{
          header: () => <Header title="Habit Calendar" />,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          header: () => <Header title="Habit History" showClose={true} />,
        }}
      />
      <Stack.Screen
        name="stats"
        options={{
          header: () => <Header title="Habit Statistics" showClose={true} />,
        }}
      />
    </Stack>
  );
}
