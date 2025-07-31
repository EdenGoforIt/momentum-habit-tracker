import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import type { CreateHabitDto } from "@/api/habits/types";
import { useCreateHabit } from "@/api/habits/use-habits";
import HabitForm from "@/components/forms/HabitForm";
import { useAuth } from "@/lib/auth";

export default function AddHabit() {
  const user = useAuth.use.user();
  const userId = user?.id || "";

  const createHabitMutation = useCreateHabit();

  const handleCreate = async (data: CreateHabitDto) => {
    try {
      await createHabitMutation.mutateAsync(data);
      Alert.alert("Success", "Habit created successfully!", [
        { text: "Add Another", onPress: () => router.replace("/habit/add") },
        {
          text: "View Calendar",
          onPress: () => router.push("/(protected)/habit/calendar"),
        },
        { text: "Done", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Error creating habit:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <HabitForm
      isEditMode={false}
      onSubmit={handleCreate}
      onCancel={handleCancel}
      isLoading={createHabitMutation.isPending}
      userId={userId}
    />
  );
}
