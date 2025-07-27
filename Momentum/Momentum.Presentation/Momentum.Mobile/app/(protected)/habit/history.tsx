import { TabNavigation } from "@/components/common";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { client } from "@/api/common";
import { getNZDateOnly } from "@/api/habits/date-utils";
import { useGetUserHabits } from "@/api/habits/use-habits";
import { useAuth } from "@/lib/auth";

export default function HabitHistory() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "completed">(
    "all"
  );

  const user = useAuth.use.user();
  const userId = user?.id || "";

  // Calculate current month for API call (like calendar does)
  const currentMonth = useMemo(() => {
    const today = getNZDateOnly();
    return today.substring(0, 7); // "2025-07-26" -> "2025-07"
  }, []);

  // API hooks - get habits for current month
  const { data: habitsData, isLoading: habitsLoading } = useGetUserHabits({
    variables: { userId, month: currentMonth },
    enabled: !!userId,
  });

  const habits = habitsData || [];

  // Calculate date range for the last 30 days
  const dateRange = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);

    return {
      startDate: getNZDateOnly(startDate),
      endDate: getNZDateOnly(today),
    };
  }, []);

  // State to store habit completion data for all dates
  const [habitCompletionData, setHabitCompletionData] = useState<
    Record<string, Record<number, boolean>>
  >({});

  // Fetch habit entries for all habits and dates (like home.tsx does)
  useEffect(() => {
    if (!habits || habits.length === 0) return;

    const fetchAllHabitEntries = async () => {
      const completionData: Record<string, Record<number, boolean>> = {};

      // Generate all dates in range
      const currentDate = new Date(dateRange.endDate);
      const startDate = new Date(dateRange.startDate);
      const dates: string[] = [];

      while (currentDate >= startDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() - 1);
      }

      // Fetch entries for each habit and each date
      for (const date of dates) {
        completionData[date] = {};
        
        const promises = habits.map(async (habit) => {
          try {
            const response = await client.get(
              `api/v1/habit-entries/habit/${habit.id}?startDate=${date}&endDate=${date}`
            );
            const entries = response.data || [];
            completionData[date][habit.id] = 
              entries.length > 0 ? entries[0].completed : false;
          } catch (error) {
            completionData[date][habit.id] = false;
          }
        });

        await Promise.all(promises);
      }

      setHabitCompletionData(completionData);
    };

    fetchAllHabitEntries();
  }, [habits, dateRange]);

  // Process data by date using real completion data
  const historyData = useMemo(() => {
    const dateMap: Record<
      string,
      {
        id: string;
        date: string;
        habits: Array<{
          name: string;
          completed: boolean;
          time: string;
          duration: string;
        }>;
        completionRate: number;
      }
    > = {};

    // Generate all dates in range
    const currentDate = new Date(dateRange.endDate);
    const startDate = new Date(dateRange.startDate);

    while (currentDate >= startDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      dateMap[dateStr] = {
        id: dateStr,
        date: dateStr,
        habits: [],
        completionRate: 0,
      };
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Use real completion data from API (same as home.tsx)
    habits.forEach((habit) => {
      Object.keys(dateMap).forEach((date) => {
        // Get completion status from our fetched data
        const completed = habitCompletionData[date]?.[habit.id] || false;

        dateMap[date].habits.push({
          name: habit.name,
          completed,
          time: completed ? "10:30 AM" : "-",
          duration: completed ? "15 min" : "-",
        });
      });
    });

    // Calculate completion rates
    Object.values(dateMap).forEach((day) => {
      if (day.habits.length > 0) {
        const completedCount = day.habits.filter((h) => h.completed).length;
        day.completionRate = Math.round(
          (completedCount / day.habits.length) * 100
        );

      }
    });

    return Object.values(dateMap).sort((a, b) => {
      try {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0; // Keep original order if dates are invalid
        }
        return dateB.getTime() - dateA.getTime();
      } catch (error) {
        console.warn('Invalid date in sort:', a.date, b.date);
        return 0;
      }
    });
  }, [habits, dateRange, habitCompletionData]);

  const filteredHistory = historyData.filter((day) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "completed") return day.completionRate === 100;
    return true;
  });


  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if date is invalid
      }
      
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });
      }
    } catch (error) {
      console.warn('Invalid date in formatDate:', dateString);
      return dateString;
    }
  };

  if (habitsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Habit History" showMenu={true} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text className="mt-4 text-gray-600">Loading habit history...</Text>
        </View>
        <TabNavigation />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header 
        title="Habit History" 
        showMenu={true}
      />
      
      {/* Filter section */}
      <View className="px-4 py-4">

        {/* Filter Tabs */}
        <View className="flex-row bg-gray-100 rounded-lg p-1" key={`filter-container-${selectedFilter}`}>
          {(["all", "completed"] as const).map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
            <TouchableOpacity
              key={filter}
              className="flex-1 py-2 px-4 rounded-md"
              style={{
                backgroundColor: isSelected ? "#3b82f6" : "#f3f4f6"
              }}
              onPress={() => {
                setSelectedFilter(filter);
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center capitalize ${
                  isSelected
                    ? "text-white font-medium"
                    : "text-gray-600"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {filteredHistory.map((day) => (
          <View key={day.id} className="mb-6 bg-gray-50 rounded-xl p-4">
            {/* Date Header */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-semibold text-gray-800">
                {formatDate(day.date)}
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  day.completionRate === 100
                    ? "bg-green-100"
                    : day.completionRate >= 75
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <Text
                  className={`font-medium ${
                    day.completionRate === 100
                      ? "text-green-700"
                      : day.completionRate >= 75
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {day.completionRate}%
                </Text>
              </View>
            </View>

            {/* Habits List */}
            {day.habits.map((habit, index) => (
              <View
                key={index}
                className="flex-row items-center py-3 border-b border-gray-200 last:border-b-0"
              >
                <View
                  className={`w-6 h-6 rounded-full mr-3 items-center justify-center ${
                    habit.completed ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {habit.completed && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>

                <View className="flex-1">
                  <Text
                    className={`font-medium ${
                      habit.completed ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {habit.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {habit.time}{" "}
                    {habit.duration !== "-" && `• ${habit.duration}`}
                  </Text>
                </View>

                {habit.completed ? (
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                ) : (
                  <Ionicons name="close-circle" size={20} color="#ef4444" />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Summary Stats */}
        <View className="mb-8 mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            History Summary
          </Text>
          <View className="flex-row justify-between">
            <View className="flex-1 bg-blue-50 p-4 rounded-xl mr-2">
              <Text className="text-2xl font-bold text-blue-600">
                {historyData.length}
              </Text>
              <Text className="text-gray-600 text-sm">Days Tracked</Text>
            </View>
            <View className="flex-1 bg-green-50 p-4 rounded-xl mx-1">
              <Text className="text-2xl font-bold text-green-600">
                {historyData.filter((d) => d.completionRate === 100).length}
              </Text>
              <Text className="text-gray-600 text-sm">Perfect Days</Text>
            </View>
            <View className="flex-1 bg-orange-50 p-4 rounded-xl ml-2">
              <Text className="text-2xl font-bold text-orange-600">
                {historyData.length > 0
                  ? (
                      historyData.reduce(
                        (acc, d) => acc + d.completionRate,
                        0
                      ) / historyData.length
                    ).toFixed(0)
                  : "0"}
                %
              </Text>
              <Text className="text-gray-600 text-sm">Avg Completion</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Tab Navigation */}
      <TabNavigation />
    </SafeAreaView>
  );
}
