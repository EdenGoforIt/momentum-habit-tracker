import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LineChart, PieChart, ProgressChart } from "react-native-chart-kit";
import { TabNavigation } from "@/components/common";

import { useGetUserHabits } from "@/api/habits/use-habits";
import { useAuth } from "@/lib/auth";
import { client } from "@/api/common";
import type { HabitEntry } from "@/api/habits/types";

const screenWidth = Dimensions.get("window").width;

export default function HabitStats() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [selectedTab, setSelectedTab] = useState<"overview" | "habits" | "achievements">("overview");
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

  // Calculate date ranges based on selected period
  const dateRange = useMemo(() => {
    const today = new Date();
    let startDate: Date;
    let endDate = new Date(today);

    switch (selectedPeriod) {
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        break;
      case "year":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 365);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, [selectedPeriod]);

  // Fetch habit entries for statistics
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

  // Calculate statistics from real data
  const stats = useMemo(() => {
    if (habits.length === 0) {
      return {
        overall: {
          totalHabits: 0,
          activeHabits: 0,
          totalCompletions: 0,
          currentStreak: 0,
          longestStreak: 0,
          overallCompletionRate: 0,
        },
        weeklyTrend: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
        },
        habitPerformance: [],
        categoryBreakdown: [],
      };
    }

    const allEntries = Object.values(habitEntriesData).flat();
    const completedEntries = allEntries.filter(entry => entry.completed);
    
    // Calculate overall stats
    const totalCompletions = completedEntries.length;
    const overallCompletionRate = allEntries.length > 0 ? (totalCompletions / allEntries.length) * 100 : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      let dayCompletions = 0;
      
      habits.forEach(habit => {
        const entries = habitEntriesData[habit.id] || [];
        const dayEntry = entries.find(entry => entry.date === dateStr);
        if (dayEntry?.completed) {
          dayCompletions++;
        }
      });
      
      const dayCompletionRate = habits.length > 0 ? dayCompletions / habits.length : 0;
      
      if (dayCompletionRate >= 0.8) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate weekly trend
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let dayCompletions = 0;
      habits.forEach(habit => {
        const entries = habitEntriesData[habit.id] || [];
        const dayEntry = entries.find(entry => entry.date === dateStr);
        if (dayEntry?.completed) {
          dayCompletions++;
        }
      });
      
      const rate = habits.length > 0 ? (dayCompletions / habits.length) * 100 : 0;
      weeklyData.push(Math.round(rate));
    }

    // Calculate habit performance
    const habitPerformance = habits.map(habit => {
      const entries = habitEntriesData[habit.id] || [];
      const completedEntries = entries.filter(entry => entry.completed);
      const completionRate = entries.length > 0 ? (completedEntries.length / entries.length) * 100 : 0;
      
      // Calculate streak for this habit
      let habitStreak = 0;
      let currentDate = new Date(today);
      
      while (true) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayEntry = entries.find(entry => entry.date === dateStr);
        
        if (dayEntry?.completed) {
          habitStreak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      return {
        name: habit.name,
        completionRate: Math.round(completionRate),
        streak: habitStreak,
        color: habit.color || '#4ECDC4',
      };
    });

    // Calculate category breakdown
    const categoryMap = new Map<string, { count: number; color: string }>();
    habits.forEach(habit => {
      const categoryName = habit.category?.name || 'Uncategorized';
      const categoryColor = habit.category?.color || '#C0C0C0';
      
      if (categoryMap.has(categoryName)) {
        categoryMap.get(categoryName)!.count++;
      } else {
        categoryMap.set(categoryName, { count: 1, color: categoryColor });
      }
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      color: data.color,
      legendFontColor: "#7F7F7F",
    }));

    return {
      overall: {
        totalHabits: habits.length,
        activeHabits: habits.filter(h => !h.archivedAt).length,
        totalCompletions,
        currentStreak,
        longestStreak: currentStreak, // For simplicity, using current as longest
        overallCompletionRate: Math.round(overallCompletionRate),
      },
      weeklyTrend: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
          data: weeklyData,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          strokeWidth: 3,
        }],
      },
      habitPerformance,
      categoryBreakdown,
    };
  }, [habits, habitEntriesData]);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#3b82f6",
    },
    withInnerLines: false,
    withOuterLines: false,
    withHorizontalLabels: false,
    withVerticalLabels: false,
  };

  const progressData = {
    labels: ["Completion", "Streak", "Goals"],
    data: [
      stats.overall.overallCompletionRate / 100,
      Math.min(stats.overall.currentStreak / 30, 1), // Progress towards 30-day streak
      Math.min(stats.overall.totalCompletions / 100, 1), // Progress towards 100 completions
    ],
  };

  // Loading state
  if (habitsLoading || entriesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text className="text-gray-600 mt-2">Loading statistics...</Text>
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
            <Text className="text-2xl font-bold text-white">{stats.overall.currentStreak}</Text>
            <Text className="text-blue-100 text-sm">Current Streak</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">{stats.overall.overallCompletionRate}%</Text>
            <Text className="text-blue-100 text-sm">Completion Rate</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">{stats.overall.totalCompletions}</Text>
            <Text className="text-blue-100 text-sm">Total Completions</Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row bg-gray-50 mx-4 mt-4 rounded-lg p-1">
        {[
          { key: "overview", label: "Overview", icon: "analytics-outline" },
          { key: "habits", label: "Habits", icon: "list-outline" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className={`flex-1 flex-row items-center justify-center py-3 px-4 rounded-md ${
              selectedTab === tab.key ? "bg-white shadow-sm" : "bg-transparent"
            }`}
            onPress={() => setSelectedTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={16} 
              color={selectedTab === tab.key ? "#3b82f6" : "#666"} 
            />
            <Text
              className={`ml-2 font-medium ${
                selectedTab === tab.key ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <View>
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

            {/* Progress Circles */}
            {progressData.data.some(d => d > 0) && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <ProgressChart
                    key={`progress-${selectedPeriod}`}
                    data={progressData}
                    width={screenWidth - 64}
                    height={220}
                    strokeWidth={16}
                    radius={32}
                    chartConfig={chartConfig}
                    hideLegend={false}
                  />
                </View>
              </View>
            )}

            {/* Weekly Trend */}
            {stats.weeklyTrend.datasets[0].data.some((d: number) => d > 0) && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-4">Weekly Completion Rate</Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <LineChart
                    key={`line-${selectedPeriod}`}
                    data={stats.weeklyTrend}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                  />
                </View>
              </View>
            )}

            {/* Category Breakdown */}
            {stats.categoryBreakdown.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-4">Habits by Category</Text>
                <View className="bg-gray-50 rounded-xl p-4">
                  <PieChart
                    key={`pie-${selectedPeriod}`}
                    data={stats.categoryBreakdown}
                    width={screenWidth - 64}
                    height={220}
                    chartConfig={chartConfig}
                    accessor="count"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[10, 10]}
                  />
                </View>
              </View>
            )}

            {/* Summary Cards */}
            <View className="flex-row mb-6">
              <View className="flex-1 bg-green-50 p-4 rounded-xl mr-2">
                <Text className="text-green-800 font-semibold">Active Habits</Text>
                <Text className="text-2xl font-bold text-green-600">{stats.overall.activeHabits}</Text>
                <Text className="text-green-600 text-sm">Currently tracking</Text>
              </View>
              
              <View className="flex-1 bg-blue-50 p-4 rounded-xl ml-2">
                <Text className="text-blue-800 font-semibold">Best Streak</Text>
                <Text className="text-2xl font-bold text-blue-600">{stats.overall.longestStreak}</Text>
                <Text className="text-blue-600 text-sm">Days in a row</Text>
              </View>
            </View>
          </View>
        )}

        {/* Habits Tab */}
        {selectedTab === "habits" && (
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-4">Habit Performance</Text>
            
            {stats.habitPerformance.length > 0 ? (
              stats.habitPerformance.map((habit, index) => (
                <View key={index} className="bg-gray-50 rounded-xl p-4 mb-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: habit.color }}
                      >
                        <Ionicons name="checkmark" size={20} color="white" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-gray-800">{habit.name}</Text>
                        <Text className="text-gray-600 text-sm">
                          {habit.streak} day streak • {habit.completionRate}% completion
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full rounded-full"
                      style={{ 
                        width: `${habit.completionRate}%`,
                        backgroundColor: habit.color 
                      }}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View className="py-8 items-center">
                <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
                <Text className="text-gray-500 mt-2 text-center">
                  No habit data available
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-1">
                  Start tracking habits to see performance metrics
                </Text>
              </View>
            )}

            {/* Summary Cards */}
            {stats.habitPerformance.length > 0 && (
              <View className="flex-row mb-6">
                <View className="flex-1 bg-green-50 p-4 rounded-xl mr-2">
                  <Text className="text-green-800 font-semibold">Best Performer</Text>
                  <Text className="text-green-600 text-sm">
                    {stats.habitPerformance.reduce((best, current) => 
                      current.completionRate > best.completionRate ? current : best
                    ).name} ({stats.habitPerformance.reduce((best, current) => 
                      current.completionRate > best.completionRate ? current : best
                    ).completionRate}%)
                  </Text>
                </View>
                <View className="flex-1 bg-orange-50 p-4 rounded-xl ml-2">
                  <Text className="text-orange-800 font-semibold">Needs Attention</Text>
                  <Text className="text-orange-600 text-sm">
                    {stats.habitPerformance.reduce((worst, current) => 
                      current.completionRate < worst.completionRate ? current : worst
                    ).name} ({stats.habitPerformance.reduce((worst, current) => 
                      current.completionRate < worst.completionRate ? current : worst
                    ).completionRate}%)
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Tab Navigation */}
      <TabNavigation />
    </SafeAreaView>
  );
}