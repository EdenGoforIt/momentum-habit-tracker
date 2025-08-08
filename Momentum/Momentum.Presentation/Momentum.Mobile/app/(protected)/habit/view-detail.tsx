import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { getNZDateOnly } from "@/api/habits/date-utils";
import { HabitFrequency } from "@/api/habits/types";
import {
  useGetHabitEntries,
  useToggleHabitCompletion,
} from "@/api/habits/use-habit-entries";
import { useDeleteHabit, useGetHabit } from "@/api/habits/use-habits";
import { useAuth } from "@/lib/auth";

export default function HabitDetail() {
  const { id } = useLocalSearchParams();
  const habitId = Number(id);
  const [todaysDate] = useState(getNZDateOnly(new Date()));
  const queryClient = useQueryClient();
  
  const user = useAuth.use.user();
  const userId = user?.id || "";

  // Fetch habit details
  const {
    data: habitData,
    isPending: habitLoading,
    isError: habitError,
  } = useGetHabit({
    variables: { habitId },
    enabled: !!habitId && !isNaN(habitId),
  });

  // Fetch habit entries for statistics
  const { data: entriesData } = useGetHabitEntries({
    variables: {
      habitId,
      startDate: getNZDateOnly(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // Last 30 days
      endDate: todaysDate,
    },
    enabled: !!habitId && !isNaN(habitId),
  });

  // Mutations
  const deleteMutation = useDeleteHabit();
  const toggleCompletionMutation = useToggleHabitCompletion();

  // Calculate stats from entries
  const stats = useMemo(() => {
    if (!entriesData) return { streak: 0, totalCompletions: 0 };

    const completedEntries = entriesData.filter((entry) => entry.completed);
    const totalCompletions = completedEntries.length;

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const entry = entriesData.find((e) => e.date === dateStr);
      if (entry?.completed) {
        streak++;
      } else if (i > 0) {
        // Don't break on today if not completed yet
        break;
      }
    }

    return { streak, totalCompletions };
  }, [entriesData]);

  // Check if habit is completed today
  const isCompletedToday = useMemo(() => {
    if (!entriesData) return false;
    const todayEntry = entriesData.find((entry) => entry.date === todaysDate);
    return todayEntry?.completed || false;
  }, [entriesData, todaysDate]);

  const handleToggleCompletion = async () => {
    try {
      await toggleCompletionMutation.mutateAsync({
        habitId,
        date: todaysDate,
        completed: !isCompletedToday,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to update habit completion");
    }
  };

  const handleEditHabit = () => {
    router.push(`/(protected)/habit/${habitId}`);
  };

  const handleDeleteHabit = () => {
    Alert.alert(
      "Delete Habit",
      "Are you sure you want to delete this habit? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync({ habitId, userId });
              // Invalidate all habit-related queries to force refetch
              await queryClient.invalidateQueries({ queryKey: ["userHabits"] });
              await queryClient.invalidateQueries({ queryKey: ["habit"] });
              await queryClient.invalidateQueries({ queryKey: ["habitEntries"] });
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to delete habit");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateTimeString: string | null | undefined) => {
    if (!dateTimeString) return null;
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFrequencyText = (frequency: HabitFrequency) => {
    switch (frequency) {
      case HabitFrequency.Daily:
        return "Daily";
      case HabitFrequency.Weekly:
        return "Weekly";
      case HabitFrequency.Monthly:
        return "Monthly";
      case HabitFrequency.Custom:
        return "Custom";
      default:
        return "Unknown";
    }
  };

  if (habitLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text className="mt-4 text-gray-600">Loading habit details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (habitError || !habitData) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-600 text-center mb-4">
            Failed to load habit details
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-full"
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Handle both direct habit response and wrapped response
  const habit = habitData && "habit" in habitData ? habitData.habit : habitData;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-gray-800 flex-1 text-center mr-10">
          Habit Details
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Habit Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-bold text-gray-800">
              {habit.name}
            </Text>
            <Text className="text-gray-500 mt-1">
              Started {formatDate(habit.startDate || habit.createdAt)}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View className="flex-row justify-between bg-gray-50 rounded-xl p-4 mb-6">
          <View className="items-center">
            <Text className="text-2xl font-bold text-blue-500">
              {stats.streak}
            </Text>
            <Text className="text-gray-600">Current Streak</Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl font-bold text-green-500">
              {stats.totalCompletions}
            </Text>
            <Text className="text-gray-600">Total Completions</Text>
          </View>

          <View className="items-center">
            <Text className="text-2xl font-bold text-purple-500">
              {getFrequencyText(habit.frequency)}
            </Text>
            <Text className="text-gray-600">Frequency</Text>
          </View>
        </View>

        {/* Habit Details */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Habit Details
          </Text>

          {habit.description && (
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-1">
                Description
              </Text>
              <Text className="text-gray-700">{habit.description}</Text>
            </View>
          )}

          {habit.category && (
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-1">Category</Text>
              <View className="flex-row items-center">
                <View
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: habit.category.color || "#ccc" }}
                />
                <Text className="text-gray-700">{habit.category.name}</Text>
              </View>
            </View>
          )}

          {habit.preferredTime && (
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-1">
                Preferred Time
              </Text>
              <Text className="text-gray-700">
                {formatTime(habit.preferredTime)}
              </Text>
            </View>
          )}

          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Priority</Text>
            <Text className="text-gray-700">
              {habit.priority === 1
                ? "High"
                : habit.priority === 2
                ? "Medium"
                : "Low"}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 font-medium mb-1">Difficulty</Text>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((level) => (
                <Ionicons
                  key={level}
                  name={
                    level <= habit.difficultyLevel ? "star" : "star-outline"
                  }
                  size={20}
                  color={level <= habit.difficultyLevel ? "#fbbf24" : "#d1d5db"}
                />
              ))}
            </View>
          </View>

          {habit.notificationsEnabled && (
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-1">Reminder</Text>
              <Text className="text-gray-700">
                {habit.reminderMinutesBefore} minutes before preferred time
              </Text>
            </View>
          )}

          {habit.notes && (
            <View className="mb-4">
              <Text className="text-gray-600 font-medium mb-1">Notes</Text>
              <Text className="text-gray-700">{habit.notes}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-3 mb-6">
          <TouchableOpacity
            className="flex-1 bg-blue-500 py-3 rounded-lg items-center mr-2"
            onPress={handleEditHabit}
          >
            <Text className="font-medium text-white">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-red-500 py-3 rounded-lg items-center"
            onPress={handleDeleteHabit}
            disabled={deleteMutation.isPending}
          >
            <Text className="font-medium text-white">
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
