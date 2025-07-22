import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { TabNavigation } from "@/components/common";

import { useGetUserHabits } from "@/api/habits/use-habits";
import { useAuth } from "@/lib/auth";
import { client } from "@/api/common";
import type { Habit, HabitEntry } from "@/api/habits/types";

export default function HabitHistory() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "completed" | "missed">("all");
  const [habitEntriesData, setHabitEntriesData] = useState<Record<number, HabitEntry[]>>({});
  const [entriesLoading, setEntriesLoading] = useState(false);
  
  const user = useAuth.use.user();
  const userId = user?.id || "";

  // API hooks
  const { data: habitsData, isLoading: habitsLoading } = useGetUserHabits({
    variables: { userId },
    enabled: !!userId
  });

  const habits = habitsData?.habits || [];

  // Calculate date range for the last 30 days
  const dateRange = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 30);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    };
  }, []);

  // Fetch habit entries for all habits in the last 30 days
  useEffect(() => {
    if (habits.length > 0) {
      setEntriesLoading(true);
      const fetchAllEntries = async () => {
        const entriesMap: Record<number, HabitEntry[]> = {};
        
        try {
          const promises = habits.map(async (habit) => {
            try {
              const response = await client.get(
                `api/v1/habit-entries/habit/${habit.id}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
              );
              return { habitId: habit.id, entries: response.data };
            } catch (error) {
              console.error(`Failed to fetch entries for habit ${habit.id}:`, error);
              return { habitId: habit.id, entries: [] };
            }
          });
          
          const results = await Promise.all(promises);
          results.forEach(({ habitId, entries }) => {
            entriesMap[habitId] = entries;
          });
        } catch (error) {
          console.error('Error fetching habit entries:', error);
        }
        
        setHabitEntriesData(entriesMap);
        setEntriesLoading(false);
      };

      fetchAllEntries();
    }
  }, [habits, dateRange]);

  // Process data by date
  const historyData = useMemo(() => {
    const dateMap: Record<string, {
      id: string;
      date: string;
      habits: Array<{
        name: string;
        completed: boolean;
        time: string;
        duration: string;
      }>;
      completionRate: number;
    }> = {};

    // Generate all dates in range
    const currentDate = new Date(dateRange.endDate);
    const startDate = new Date(dateRange.startDate);
    
    while (currentDate >= startDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap[dateStr] = {
        id: dateStr, // Use date as unique id
        date: dateStr,
        habits: [],
        completionRate: 0,
      };
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Populate with habit data
    habits.forEach(habit => {
      const entries = habitEntriesData[habit.id] || [];
      
      Object.keys(dateMap).forEach(date => {
        const entry = entries.find(e => e.date === date);
        const completed = entry?.completed || false;
        
        dateMap[date].habits.push({
          name: habit.name,
          completed,
          time: completed && entry?.completedAt 
            ? new Date(entry.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : "-",
          duration: entry?.duration || "-",
        });
      });
    });

    // Calculate completion rates
    Object.values(dateMap).forEach(day => {
      if (day.habits.length > 0) {
        const completedCount = day.habits.filter(h => h.completed).length;
        day.completionRate = Math.round((completedCount / day.habits.length) * 100);
      }
    });

    return Object.values(dateMap).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [habits, habitEntriesData, dateRange]);

  const filteredHistory = historyData.filter((day) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "completed") return day.completionRate === 100;
    if (selectedFilter === "missed") return day.completionRate < 100;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  };

  if (habitsLoading || entriesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text className="mt-4 text-gray-600">Loading habit history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-6 bg-blue-50">
        <View className="flex-row items-center justify-between mb-4">
          <View className="w-6" />
          <Text className="text-xl font-bold text-gray-800">Habit History</Text>
          <TouchableOpacity onPress={() => router.push("/(protected)/habit/stats")}>
            <Ionicons name="stats-chart" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row bg-white rounded-lg p-1">
          {(["all", "completed", "missed"] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              className={`flex-1 py-2 px-4 rounded-md ${
                selectedFilter === filter ? "bg-blue-500" : "bg-transparent"
              }`}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                className={`text-center capitalize ${
                  selectedFilter === filter ? "text-white font-medium" : "text-gray-600"
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
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
                    {habit.time} {habit.duration !== "-" && `• ${habit.duration}`}
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
                {historyData.length > 0 ? (
                  historyData.reduce((acc, d) => acc + d.completionRate, 0) /
                  historyData.length
                ).toFixed(0) : '0'}
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