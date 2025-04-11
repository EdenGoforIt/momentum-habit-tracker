import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data to simulate fetching habit details from API
const MOCK_HABITS = {
  "1": {
    id: 1,
    title: "Morning Meditation",
    startDate: "2025-04-01",
    recurring: true,
    recurringDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
    reminder: true,
    reminderTime: "2025-04-10T06:30:00.000Z",
    streak: 15,
    totalCompletions: 23,
    lastCompleted: "2025-04-10",
    completed: true,
    notes: "Focus on breathing techniques",
  },
  "2": {
    id: 2,
    title: "Read for 30 minutes",
    startDate: "2025-03-15",
    recurring: true,
    recurringDays: {
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: true,
      saturday: true,
      sunday: true,
    },
    reminder: false,
    reminderTime: null,
    streak: 3,
    totalCompletions: 12,
    lastCompleted: "2025-04-09",
    completed: false,
    notes: "Focus on non-fiction books",
  },
};

// Days of week for showing schedule
const DAYS_OF_WEEK = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

export default function HabitDetail() {
  const { id } = useLocalSearchParams();
  const [habit, setHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch habit details
    const fetchHabit = async () => {
      try {
        // In real app, call API with id: await fetch(`/api/habits/${id}`);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay

        const habitData = MOCK_HABITS[id as keyof typeof MOCK_HABITS];

        if (!habitData) {
          Alert.alert("Error", "Habit not found");
          router.back();
          return;
        }

        setHabit(habitData);
        setIsCompleted(habitData.completed);
      } catch (error) {
        Alert.alert("Error", "Failed to load habit details");
      } finally {
        setLoading(false);
      }
    };

    fetchHabit();
  }, [id]);

  const handleToggleCompletion = () => {
    // Update local state
    setIsCompleted(!isCompleted);

    // In real app, update in API: PATCH /api/habits/${id}
    // For mock, we'll just update our local state

    setHabit((prev: Habit) => ({
      ...prev,
      completed: !prev.completed,
      lastCompleted: !prev.completed
        ? new Date().toISOString().split("T")[0]
        : prev.lastCompleted,
      streak: !prev.completed ? prev.streak + 1 : prev.streak - 1,
      totalCompletions: !prev.completed
        ? prev.totalCompletions + 1
        : prev.totalCompletions - 1,
    }));
  };

  const handleEditHabit = () => {
    // In real app, navigate to edit form with habit data
    Alert.alert("Edit", "Navigate to edit form with habit data");
    // router.push(`/habit/edit/${id}`);
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
          onPress: () => {
            // In real app, call API: DELETE /api/habits/${id}
            Alert.alert("Success", "Habit deleted successfully");
            router.back();
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateTimeString: string) => {
    if (!dateTimeString) return null;
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text className="mt-4 text-gray-600">Loading habit details...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Habit Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-1 mr-4">
          <Text className="text-2xl font-bold text-gray-800">
            {habit.title}
          </Text>
          <Text className="text-gray-500 mt-1">
            Started {formatDate(habit.startDate)}
          </Text>
        </View>

        <TouchableOpacity
          className={`w-14 h-14 rounded-full flex items-center justify-center ${
            isCompleted ? "bg-green-500" : "bg-gray-200"
          }`}
          onPress={handleToggleCompletion}
        >
          {isCompleted && <Ionicons name="checkmark" size={28} color="white" />}
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-between bg-gray-50 rounded-xl p-4 mb-6">
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-500">
            {habit.streak}
          </Text>
          <Text className="text-gray-600">Current Streak</Text>
        </View>

        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-500">
            {habit.totalCompletions}
          </Text>
          <Text className="text-gray-600">Total Completions</Text>
        </View>

        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-500">
            {new Date(habit.lastCompleted).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>
          <Text className="text-gray-600">Last Completed</Text>
        </View>
      </View>

      {/* Schedule Section */}
      <View className="mb-6">
        <Text className="font-semibold text-gray-700 mb-2">Schedule</Text>
        {habit.recurring ? (
          <View>
            <View className="flex-row flex-wrap justify-between mb-2">
              {DAYS_OF_WEEK.map((day) => (
                <View
                  key={day.key}
                  className={`rounded-full w-10 h-10 items-center justify-center mb-2 ${
                    habit.recurringDays[day.key] ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={
                      habit.recurringDays[day.key]
                        ? "text-white"
                        : "text-gray-600"
                    }
                  >
                    {day.label}
                  </Text>
                </View>
              ))}
            </View>
            <Text className="text-gray-600">
              Repeating weekly on selected days
            </Text>
          </View>
        ) : (
          <Text className="text-gray-600">
            One-time habit on {formatDate(habit.startDate)}
          </Text>
        )}
      </View>

      {/* Reminder Section */}
      <View className="mb-6">
        <Text className="font-semibold text-gray-700 mb-2">Reminder</Text>
        {habit.reminder ? (
          <View className="flex-row items-center">
            <Ionicons name="notifications" size={20} color="#4a90e2" />
            <Text className="ml-2 text-gray-700">
              {formatTime(habit.reminderTime)}
            </Text>
          </View>
        ) : (
          <Text className="text-gray-600">No reminder set</Text>
        )}
      </View>

      {/* Notes Section */}
      {habit.notes && (
        <View className="mb-6">
          <Text className="font-semibold text-gray-700 mb-2">Notes</Text>
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-gray-800">{habit.notes}</Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity
          className="flex-1 bg-blue-500 py-3 rounded-lg items-center"
          onPress={handleEditHabit}
        >
          <Text className="font-medium text-white">Edit Habit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-red-500 py-3 rounded-lg items-center"
          onPress={handleDeleteHabit}
        >
          <Text className="font-medium text-white">Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
