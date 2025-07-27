import { TabNavigation } from "@/components/common";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getNZDateOnly } from "@/api/habits/date-utils";
import type { HabitEntry } from "@/api/habits/types";
import { useGetUserHabits } from "@/api/habits/use-habits";
import { useAuth } from "@/lib/auth";

type PeriodType = "week" | "month" | "year";

export default function HabitStats() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("month");
  
  const user = useAuth.use.user();
  const userId = user?.id || "";

  // Calculate current month for API call (consistent with other screens)
  const currentMonth = useMemo(() => {
    const today = getNZDateOnly();
    return today.substring(0, 7); // "2025-07-26" -> "2025-07"
  }, []);

  // API hooks - get habits for current month
  const { data: habitsData, isLoading: habitsLoading } = useGetUserHabits({
    variables: { userId, month: currentMonth },
    enabled: !!userId
  });

  const habits = habitsData || [];

  // Calculate basic stats from habits data (simplified)
  const stats = useMemo(() => {
    if (habits.length === 0) {
      return {
        totalCompletions: 0,
        currentStreak: 7, // Mock data
        overallCompletionRate: 0,
        habitPerformance: [],
      };
    }

    // Simplified stats without habit entries (to avoid direct API calls)
    const habitPerformance = habits.map((habit, index) => {
      // Mock completion rates for demo
      const mockCompletionRates = [85, 72, 91, 68, 78, 95, 82];
      const completionRate = mockCompletionRates[index % mockCompletionRates.length];
      
      return {
        name: habit.name,
        completionRate,
        completions: Math.floor(completionRate * 0.3), // Mock completions
        color: habit.color || '#4ECDC4',
      };
    }).sort((a, b) => b.completionRate - a.completionRate);

    const avgCompletionRate = Math.round(
      habitPerformance.reduce((sum, h) => sum + h.completionRate, 0) / habitPerformance.length
    );

    return {
      totalCompletions: habitPerformance.reduce((sum, h) => sum + h.completions, 0),
      currentStreak: Math.floor(avgCompletionRate / 10), // Mock streak based on avg
      overallCompletionRate: avgCompletionRate,
      habitPerformance,
    };
  }, [habits]);

  // Loading state
  if (habitsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text className="text-gray-600 mt-2">Loading statistics...</Text>
      </SafeAreaView>
    );
  }

  // No habits state
  if (habits.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-4 py-4 bg-blue-500">
          <View className="flex-row items-center justify-between mb-2">
            <View className="w-6" />
            <Text className="text-xl font-bold text-white">Statistics</Text>
            <TouchableOpacity onPress={() => router.push("/(protected)/habit/calendar")}>
              <Ionicons name="calendar-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="bar-chart-outline" size={64} color="#ccc" />
          <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2">
            No Statistics Yet
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Create your first habit to start tracking your progress and see detailed statistics.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => router.push("/(protected)/habit/add")}
          >
            <Text className="text-white font-medium">Create First Habit</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-6 bg-blue-500">
        <View className="flex-row items-center justify-between mb-4">
          <View className="w-6" />
          <Text className="text-xl font-bold text-white">Statistics</Text>
          <TouchableOpacity onPress={() => router.push("/(protected)/habit/calendar")}>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">{stats.currentStreak}</Text>
            <Text className="text-blue-100 text-sm">Day Streak</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">{stats.overallCompletionRate}%</Text>
            <Text className="text-blue-100 text-sm">Completion</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">{stats.totalCompletions}</Text>
            <Text className="text-blue-100 text-sm">Total Done</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Period Selector */}
        <View className="flex-row bg-gray-100 rounded-lg p-1 mb-6">
          {(["week", "month", "year"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              className={`flex-1 py-2 px-4 rounded-md ${
                selectedPeriod === period ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                className={`text-center capitalize font-medium ${
                  selectedPeriod === period ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Habit Performance */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Habit Performance</Text>
          {stats.habitPerformance.map((habit, index) => (
            <View key={index} className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="font-medium text-gray-800 flex-1" numberOfLines={1}>
                  {habit.name}
                </Text>
                <Text className="text-lg font-bold text-blue-600 ml-2">
                  {habit.completionRate}%
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <View
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${habit.completionRate}%` }}
                  />
                </View>
                <Text className="text-sm text-gray-500">
                  {habit.completions} completed
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Summary Cards */}
        <View className="flex-row flex-wrap mb-4">
          <View className="w-1/2 pr-2 mb-4">
            <View className="bg-green-50 p-4 rounded-xl border border-green-100">
              <Text className="text-green-800 font-semibold mb-1">Active Habits</Text>
              <Text className="text-2xl font-bold text-green-600">{habits.length}</Text>
            </View>
          </View>
          <View className="w-1/2 pl-2 mb-4">
            <View className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <Text className="text-purple-800 font-semibold mb-1">Avg Completion</Text>
              <Text className="text-2xl font-bold text-purple-600">{stats.overallCompletionRate}%</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TabNavigation />
    </SafeAreaView>
  );
}