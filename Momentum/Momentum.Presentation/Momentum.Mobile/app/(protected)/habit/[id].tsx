import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import type { Habit, HabitResponse } from "@/api/habits/types";
import { useGetHabit, useUpdateHabit } from "@/api/habits/use-habits";
import HabitForm from "@/components/forms/HabitForm";
import { useAuth } from "@/lib/auth";

export default function EditHabit() {
  const params = useLocalSearchParams();
  const habitId = params.id ? Number(params.id) : null;

  const user = useAuth.use.user();
  const userId = user?.id || "";

  const { data: habitData, isLoading: habitLoading } = useGetHabit({
    variables: { habitId: habitId! },
    enabled: !!habitId,
  }) as { data: Habit | HabitResponse | undefined; isLoading: boolean };
  const updateHabitMutation = useUpdateHabit();

  const handleUpdate = async (data: any) => {
    try {
      await updateHabitMutation.mutateAsync({
        id: habitId!,
        data: data,
      });
      Alert.alert("Success", "Habit updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error("Error updating habit:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!habitId) {
    Alert.alert("Error", "Invalid habit ID");
    router.back();
    return null;
  }

  return (
    <HabitForm
      habitData={habitData}
      isEditMode={true}
      onSubmit={handleUpdate}
      onCancel={handleCancel}
      isLoading={updateHabitMutation.isPending || habitLoading}
      userId={userId}
    />
  );
}
