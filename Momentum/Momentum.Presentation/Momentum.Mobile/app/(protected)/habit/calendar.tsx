import { TabNavigation } from "@/components/common";
import Header from "@/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useQueryClient } from "@tanstack/react-query";

import { getNZDateOnly } from "@/api/habits/date-utils";
import type { HabitEntry } from "@/api/habits/types";
import { useToggleHabitCompletion } from "@/api/habits/use-habit-entries";
import { useGetUserHabits, useDeleteHabit } from "@/api/habits/use-habits";
import { client } from "@/api/common";
import { useAuth } from "@/lib/auth";

export default function HabitCalendar() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(
    getNZDateOnly(new Date())
  );
  const [currentMonth, setCurrentMonth] = useState(() => {
    const nzDate = getNZDateOnly(new Date());
    const [year, month] = nzDate.split('-');
    return `${year}-${month}`;
  });

  const user = useAuth.use.user();
  const userId = user?.id || "";

  // Calculate date range for the current month
  const [year, month] = currentMonth.split("-").map(Number);
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  // API hooks - now includes month parameter
  const { data: habitsData, isLoading: habitsLoading } = useGetUserHabits({
    variables: { userId, month: currentMonth },
    enabled: !!userId,
  });
  const [habitEntriesData, setHabitEntriesData] = useState<
    Record<number, HabitEntry[]>
  >({});
  const [entriesLoading, setEntriesLoading] = useState(false);

  const toggleHabitMutation = useToggleHabitCompletion();
  const deleteHabitMutation = useDeleteHabit();

  const habits = habitsData || [];

  // Fetch habit entries for all habits in the current month
  useEffect(() => {
    if (habits.length > 0) {
      setEntriesLoading(true);
      const fetchAllEntries = async () => {
        const entriesMap: Record<number, HabitEntry[]> = {};

        try {
          // Fetch entries for all habits in parallel
          const promises = habits.map(async (habit) => {
            try {
              const startDate = `${currentMonth}-01`;
              const endDate = `${currentMonth}-31`;
              const response = await client.get(
                `api/v1/habit-entries/habit/${habit.id}?startDate=${startDate}&endDate=${endDate}`
              );
              const entries = response.data;
              return { habitId: habit.id, entries };
            } catch (error) {
              return { habitId: habit.id, entries: [] };
            }
          });

          const results = await Promise.all(promises);
          results.forEach(({ habitId, entries }) => {
            entriesMap[habitId] = entries;
          });
        } catch (error) {
        }

        setHabitEntriesData(entriesMap);
        setEntriesLoading(false);
      };

      fetchAllEntries();
    }
  }, [habits, currentMonth]);

  // Get habits for selected date (only habits active on this date)
  const selectedDateHabits = useMemo(() => {
    return habits.filter((habit) => {
      const habitStartDate = getNZDateOnly(habit.startDate);
      const habitEndDate = habit.endDate
        ? getNZDateOnly(habit.endDate)
        : getNZDateOnly(new Date()); // If no end date, consider it active until today

      // Check if selected date is within habit's active period
      return selectedDate >= habitStartDate && selectedDate <= habitEndDate;
    });
  }, [habits, selectedDate]);

  // Get completed habits for selected date
  const completedHabits = useMemo(() => {
    const completed: number[] = [];
    habits.forEach((habit) => {
      const entries = habitEntriesData[habit.id] || [];
      const dayEntry = entries.find((entry) => {
        // Handle both date formats: "2025-07-30" and "2025-07-30T00:00:00"
        const entryDate = entry.date.split("T")[0];
        return entryDate === selectedDate;
      });
      if (dayEntry?.completed) {
        completed.push(habit.id);
      }
    });
    return completed;
  }, [habits, habitEntriesData, selectedDate]);

  // Calculate marked dates for calendar
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Only calculate if we have habit entries data
    if (Object.keys(habitEntriesData).length === 0 && habits.length > 0) {
      // If we have habits but no entries yet, return empty to avoid showing stale data
      return marked;
    }

    // Generate all dates in the current month
    const currentDate = new Date(startOfMonth);
    while (currentDate <= endOfMonth) {
      const dateStr = currentDate.toISOString().split("T")[0];

      // Calculate completion rate for this date
      let completedCount = 0;
      habits.forEach((habit) => {
        const entries = habitEntriesData[habit.id] || [];
        const dayEntry = entries.find((entry) => {
          // Handle both date formats: "2025-07-30" and "2025-07-30T00:00:00"
          const entryDate = entry.date.split("T")[0];
          return entryDate === dateStr;
        });
        if (dayEntry?.completed) {
          completedCount++;
        }
      });

      const completionRate =
        habits.length > 0 ? completedCount / habits.length : 0;

      let color = "#D1D5DB"; // gray for no completion
      if (completionRate >= 1) color = "#10B981"; // green for 100%
      else if (completionRate >= 0.75)
        color = "#6EE7B7"; // light green for 75%+
      else if (completionRate >= 0.5) color = "#FFEAA7"; // yellow for 50%+
      else if (completionRate > 0) color = "#FFB6C1"; // light red for partial

      // Check if any habits are active on this date
      let hasActiveHabits = false;
      habits.forEach((habit) => {
        // Use getNZDateOnly to handle the date conversion properly
        const habitStartDate = getNZDateOnly(habit.startDate);
        // If endDate is null, use today's date as endDate (ongoing habit)
        const habitEndDate = habit.endDate
          ? getNZDateOnly(habit.endDate)
          : getNZDateOnly(new Date());

        // Habit is active if current date is between start and end dates (inclusive)
        if (dateStr >= habitStartDate && dateStr <= habitEndDate) {
          hasActiveHabits = true;
        }
      });

      // Mark dates where habits are active
      if (hasActiveHabits) {
        marked[dateStr] = {
          selected: dateStr === selectedDate,
          selectedColor: dateStr === selectedDate ? "#45B7D1" : undefined,
          dots: [{ color: color, selectedDotColor: "white" }],
        };
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure selected date is marked
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: "#3B82F6",
      };
    } else {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = "#45B7D1";
    }

    return marked;
  }, [habits, habitEntriesData, startOfMonth, endOfMonth]);

  const toggleHabitCompletion = async (habitId: number) => {
    const isCurrentlyCompleted = completedHabits.includes(habitId);

    try {
      await toggleHabitMutation.mutateAsync({
        habitId,
        date: selectedDate,
        completed: !isCurrentlyCompleted,
      });

      // Refresh the entries for this habit
      try {
        const startDate = `${currentMonth}-01`;
        const endDate = `${currentMonth}-31`;
        const response = await client.get(
          `api/v1/habit-entries/habit/${habitId}?startDate=${startDate}&endDate=${endDate}`
        );
        const entries = response.data;
        setHabitEntriesData((prev) => ({
          ...prev,
          [habitId]: entries,
        }));
      } catch (error) {
        console.error('Failed to refresh habit entries:', error);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update habit completion"
      );
    }
  };

  const handleDeleteHabit = (habitId: number, habitName: string) => {
    Alert.alert(
      "Delete Habit",
      `Are you sure you want to delete "${habitName}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteHabitMutation.mutateAsync({ habitId, userId });
              // Invalidate all habit-related queries to force refetch
              await queryClient.invalidateQueries({ queryKey: ["userHabits"] });
              await queryClient.invalidateQueries({ queryKey: ["habit"] });
              await queryClient.invalidateQueries({ queryKey: ["habitEntries"] });
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.response?.data?.message || "Failed to delete habit"
              );
            }
          },
        },
      ]
    );
  };

  const getStreakInfo = () => {
    if (habits.length === 0) return { currentStreak: 0 };

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Calculate current streak
    while (true) {
      const dateStr = currentDate.toISOString().split("T")[0];

      let completedCount = 0;
      habits.forEach((habit) => {
        const entries = habitEntriesData[habit.id] || [];
        const dayEntry = entries.find((entry) => {
          const entryDate = entry.date.split("T")[0];
          return entryDate === dateStr;
        });
        if (dayEntry?.completed) {
          completedCount++;
        }
      });

      const completionRate = completedCount / habits.length;

      if (completionRate >= 0.8) {
        // 80% completion rate to count as streak
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { currentStreak: streak };
  };

  const streakInfo = getStreakInfo();

  // Loading state
  if (habitsLoading || entriesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text className="text-gray-600 mt-2">Loading calendar...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header 
        title="Habit Calendar" 
        showMenu={true}
      />
      
      {/* Streak info */}
      <View className="px-4 py-4 bg-blue-50">
        <View className="bg-white rounded-lg p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                Current Streak
              </Text>
              <Text className="text-gray-600">Keep it going!</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-500">
                {streakInfo.currentStreak}
              </Text>
              <Text className="text-gray-600">days</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Calendar */}
        <View className="px-4 py-2">
          <Calendar
            key={currentMonth}
            current={`${year}-${String(month).padStart(2, "0")}-01`}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            onMonthChange={(month: any) => {
              const newMonth = `${month.year}-${String(month.month).padStart(
                2,
                "0"
              )}`;
              setCurrentMonth(newMonth);
              // Clear habit entries immediately to prevent showing old data
              setHabitEntriesData({});
            }}
            markedDates={markedDates}
            markingType={"multi-dot"}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#45B7D1",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#45B7D1",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              arrowColor: "#45B7D1",
              disabledArrowColor: "#d9e1e8",
              monthTextColor: "#2d4150",
              indicatorColor: "#45B7D1",
              textDayFontFamily: "Rubik-Regular",
              textMonthFontFamily: "Rubik-SemiBold",
              textDayHeaderFontFamily: "Rubik-Medium",
              textDayFontWeight: "300",
              textMonthFontWeight: "600",
              textDayHeaderFontWeight: "500",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>

        {/* Legend */}
        <View className="px-4 py-2">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Legend
          </Text>
          <View className="flex-row flex-wrap">
            <View className="flex-row items-center mr-4 mb-2">
              <View
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "#10B981" }}
              />
              <Text className="text-gray-600">100% Complete</Text>
            </View>
            <View className="flex-row items-center mr-4 mb-2">
              <View
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: "#6EE7B7" }}
              />
              <Text className="text-gray-600">75%+ Complete</Text>
            </View>
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />
              <Text className="text-gray-600">50-75% Complete</Text>
            </View>
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-4 h-4 rounded-full bg-red-300 mr-2" />
              <Text className="text-gray-600">Partial</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <View className="w-4 h-4 rounded-full bg-gray-400 mr-2" />
              <Text className="text-gray-600">Not completed</Text>
            </View>
          </View>
        </View>

        {/* Selected Date Habits */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              Habits for{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push("/(protected)/habit/add")}
            >
              <Ionicons name="add-circle" size={18} color="#4a90e2" />
              <Text className="text-blue-500 font-medium ml-1">Add New</Text>
            </TouchableOpacity>
          </View>

          {selectedDateHabits.length > 0 && (
            <Text className="text-xs text-gray-500 mb-2 text-center">
              Tap to toggle completion • Long press to delete
            </Text>
          )}

          {selectedDateHabits.length > 0 ? (
            selectedDateHabits.map((habit) => {
              const isCompleted = completedHabits.includes(habit.id);
              return (
                <TouchableOpacity
                  key={habit.id}
                  className={`flex-row items-center py-4 border-b border-gray-100 ${
                    toggleHabitMutation.isPending || deleteHabitMutation.isPending ? "opacity-50" : ""
                  }`}
                  onPress={() => toggleHabitCompletion(habit.id)}
                  onLongPress={() => handleDeleteHabit(habit.id, habit.name)}
                  disabled={toggleHabitMutation.isPending || deleteHabitMutation.isPending}
                >
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center mr-4`}
                    style={{
                      backgroundColor: isCompleted ? "#10B981" : "#f0f0f0",
                    }}
                  >
                    <Ionicons
                      name={
                        isCompleted
                          ? "checkmark"
                          : ((habit.iconName || "star-outline") as any)
                      }
                      size={20}
                      color={isCompleted ? "white" : (habit.color || "#4ECDC4")}
                    />
                  </View>

                  <View className="flex-1">
                    <Text
                      className={`font-medium text-lg ${
                        isCompleted
                          ? "text-gray-400 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {habit.name}
                    </Text>
                    <Text className="text-gray-500">
                      {isCompleted ? "Completed" : "Not completed"}
                    </Text>
                  </View>

                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isCompleted ? "" : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: isCompleted
                        ? "#10B981"
                        : "transparent",
                      borderColor: isCompleted
                        ? "#10B981"
                        : undefined,
                    }}
                  >
                    {isCompleted && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text className="text-gray-500 mt-2 text-center">
                No habits found
              </Text>
              <TouchableOpacity
                className="mt-4 bg-blue-500 px-6 py-2 rounded-full"
                onPress={() => router.push("/(protected)/habit/add")}
              >
                <Text className="text-white font-medium">Add Habit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View className="px-4 py-4 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Stats
          </Text>

          <View className="flex-row">
            <View className="flex-1 bg-green-50 p-4 rounded-xl mr-2">
              <Text className="text-green-800 font-semibold">Total Habits</Text>
              <Text className="text-2xl font-bold text-green-600">
                {habits.length}
              </Text>
              <Text className="text-green-600 text-sm">Active</Text>
            </View>

            <View className="flex-1 bg-blue-50 p-4 rounded-xl ml-2">
              <Text className="text-blue-800 font-semibold">Today</Text>
              <Text className="text-2xl font-bold text-blue-600">
                {habits.length > 0
                  ? Math.round((completedHabits.length / habits.length) * 100)
                  : 0}
                %
              </Text>
              <Text className="text-blue-600 text-sm">Complete</Text>
            </View>
          </View>
        </View>
      </ScrollView>


      {/* Tab Navigation */}
      <TabNavigation />
    </SafeAreaView>
  );
}
