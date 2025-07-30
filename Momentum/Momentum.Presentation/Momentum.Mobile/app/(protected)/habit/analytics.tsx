import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

import { useGetHabit } from "@/api/habits/use-habits";
import { client } from "@/api/common";
import type { HabitEntry } from "@/api/habits/types";

const screenWidth = Dimensions.get("window").width;

export default function HabitAnalytics() {
  const { id } = useLocalSearchParams();
  const habitId = Number(id);
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [habitEntries, setHabitEntries] = useState<HabitEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

  // API hooks
  const { data: habitData, isLoading: habitLoading } = useGetHabit({
    variables: { habitId },
    enabled: !!habitId
  });

  const habit = habitData ? ('habit' in habitData ? habitData.habit : habitData) : undefined;

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

  // Fetch habit entries
  useEffect(() => {
    if (habitId && dateRange) {
      setEntriesLoading(true);
      const fetchEntries = async () => {
        try {
          const response = await client.get(
            `api/v1/habit-entries/habit/${habitId}?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
          );
          setHabitEntries(response.data);
        } catch (error) {
          console.error('Failed to fetch habit entries:', error);
          setHabitEntries([]);
        } finally {
          setEntriesLoading(false);
        }
      };
      
      fetchEntries();
    }
  }, [habitId, dateRange]);

  // Calculate analytics from real data
  const analyticsData = useMemo(() => {
    if (!habit || habitEntries.length === 0) {
      return null;
    }

    const completedEntries = habitEntries.filter(entry => entry.completed);
    const totalDays = habitEntries.length;
    const completedDays = completedEntries.length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayEntry = habitEntries.find(entry => entry.date === dateStr);
      
      if (dayEntry?.completed) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak (simplified - checking consecutive entries)
    let longestStreak = 0;
    let tempStreak = 0;
    
    const sortedEntries = [...habitEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    for (const entry of sortedEntries) {
      if (entry.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate weekly data
    const weeklyData = [];
    const daysPerWeek = selectedPeriod === "week" ? 1 : selectedPeriod === "month" ? 4 : 52;
    const daysInPeriod = selectedPeriod === "week" ? 7 : selectedPeriod === "month" ? 30 : 365;
    const intervalDays = Math.floor(daysInPeriod / daysPerWeek);
    
    for (let i = 0; i < daysPerWeek; i++) {
      const startDay = new Date(dateRange.endDate);
      startDay.setDate(startDay.getDate() - (i + 1) * intervalDays);
      const endDay = new Date(dateRange.endDate);
      endDay.setDate(endDay.getDate() - i * intervalDays);
      
      const weekEntries = habitEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDay && entryDate <= endDay;
      });
      
      const weekCompleted = weekEntries.filter(entry => entry.completed).length;
      
      weeklyData.unshift({
        week: selectedPeriod === "week" ? `Day ${7 - i}` : 
              selectedPeriod === "month" ? `Week ${daysPerWeek - i}` : 
              `Period ${daysPerWeek - i}`,
        completed: weekCompleted,
        total: weekEntries.length || 1,
      });
    }

    // Calculate mood data if available
    const moodBefore = completedEntries
      .filter(entry => entry.moodBefore !== undefined)
      .map(entry => entry.moodBefore!);
    const moodAfter = completedEntries
      .filter(entry => entry.moodAfter !== undefined)
      .map(entry => entry.moodAfter!);

    // Calculate difficulty ratings
    const difficultyRatings = completedEntries
      .filter(entry => entry.difficultyRating !== undefined)
      .map(entry => entry.difficultyRating!);

    // Calculate time of day data (simplified - using creation time)
    const timeOfDayMap = new Map<string, number>();
    completedEntries.forEach(entry => {
      if (entry.completedAt) {
        const hour = new Date(entry.completedAt).getHours();
        const timeOfDay = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
        timeOfDayMap.set(timeOfDay, (timeOfDayMap.get(timeOfDay) || 0) + 1);
      }
    });

    const timeOfDayData = Array.from(timeOfDayMap.entries()).map(([name, count], index) => ({
      name,
      count,
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1'][index] || '#C0C0C0',
      legendFontColor: "#7F7F7F",
    }));

    // Generate monthly trend data
    const monthlyTrend = {
      labels: weeklyData.map(w => w.week.slice(0, 6)), // Shortened labels
      datasets: [{
        data: weeklyData.map(w => Math.round((w.completed / w.total) * 100)),
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      }],
    };

    return {
      habitId,
      habitName: habit.name,
      totalDays,
      completedDays,
      currentStreak,
      longestStreak,
      completionRate: Math.round(completionRate * 10) / 10,
      weeklyData,
      monthlyTrend,
      timeOfDayData: timeOfDayData.length > 0 ? timeOfDayData : [
        { name: "No data", count: 1, color: "#C0C0C0", legendFontColor: "#7F7F7F" }
      ],
      moodData: {
        before: moodBefore.length > 0 ? moodBefore : [5],
        after: moodAfter.length > 0 ? moodAfter : [5],
      },
      difficultyRatings: difficultyRatings.length > 0 ? difficultyRatings : [3],
    };
  }, [habit, habitEntries, selectedPeriod, dateRange]);

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
  };

  const completionRateData = useMemo(() => {
    if (!analyticsData) return { labels: [], datasets: [{ data: [] }] };
    
    return {
      labels: analyticsData.weeklyData.map(w => w.week),
      datasets: [
        {
          data: analyticsData.weeklyData.map(w => Math.round((w.completed / w.total) * 100)),
        },
      ],
    };
  }, [analyticsData]);

  const averageMoodImprovement = useMemo(() => {
    if (!analyticsData || analyticsData.moodData.before.length === 0) return "0";
    
    const beforeAvg = analyticsData.moodData.before.reduce((a, b) => a + b, 0) / analyticsData.moodData.before.length;
    const afterAvg = analyticsData.moodData.after.reduce((a, b) => a + b, 0) / analyticsData.moodData.after.length;
    
    if (beforeAvg === 0) return "0";
    return ((afterAvg - beforeAvg) / beforeAvg * 100).toFixed(1);
  }, [analyticsData]);

  const averageDifficulty = useMemo(() => {
    if (!analyticsData || analyticsData.difficultyRatings.length === 0) return "3.0";
    
    return (analyticsData.difficultyRatings.reduce((a, b) => a + b, 0) / analyticsData.difficultyRatings.length).toFixed(1);
  }, [analyticsData]);

  if (habitLoading || entriesLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading analytics...</Text>
      </SafeAreaView>
    );
  }

  if (!habit || !analyticsData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Ionicons name="analytics-outline" size={64} color="#ccc" />
        <Text className="text-gray-600 mt-4 text-center">No analytics data available</Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Start tracking this habit to see detailed analytics
        </Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-6 bg-blue-50">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-800 flex-1">
              {analyticsData.habitName} Analytics
            </Text>
          </View>
          
          {/* Period Selector */}
          <View className="flex-row bg-white rounded-lg p-1">
            {(["week", "month", "year"] as const).map((period) => (
              <TouchableOpacity
                key={period}
                className={`flex-1 py-2 px-4 rounded-md ${
                  selectedPeriod === period ? "bg-blue-500" : "bg-transparent"
                }`}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  className={`text-center capitalize ${
                    selectedPeriod === period ? "text-white font-medium" : "text-gray-600"
                  }`}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-4 py-6">
          {/* Key Metrics */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</Text>
            <View className="flex-row flex-wrap justify-between">
              <View className="w-[48%] bg-green-50 p-4 rounded-xl mb-4">
                <Text className="text-2xl font-bold text-green-600">
                  {analyticsData.completionRate}%
                </Text>
                <Text className="text-gray-600">Completion Rate</Text>
              </View>
              
              <View className="w-[48%] bg-blue-50 p-4 rounded-xl mb-4">
                <Text className="text-2xl font-bold text-blue-600">
                  {analyticsData.currentStreak}
                </Text>
                <Text className="text-gray-600">Current Streak</Text>
              </View>
              
              <View className="w-[48%] bg-purple-50 p-4 rounded-xl mb-4">
                <Text className="text-2xl font-bold text-purple-600">
                  {analyticsData.longestStreak}
                </Text>
                <Text className="text-gray-600">Longest Streak</Text>
              </View>
              
              <View className="w-[48%] bg-orange-50 p-4 rounded-xl mb-4">
                <Text className="text-2xl font-bold text-orange-600">
                  {analyticsData.completedDays}/{analyticsData.totalDays}
                </Text>
                <Text className="text-gray-600">Days Completed</Text>
              </View>
            </View>
          </View>

          {/* Completion Rate Trend */}
          {completionRateData.datasets[0].data.length > 0 && completionRateData.datasets[0].data.some(d => d > 0) && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Completion Rate Trend</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <BarChart
                  data={completionRateData}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={chartConfig}
                  verticalLabelRotation={30}
                  showValuesOnTopOfBars
                  fromZero
                  yAxisLabel=""
                  yAxisSuffix="%"
                />
              </View>
            </View>
          )}

          {/* Monthly Trend */}
          {analyticsData.monthlyTrend.datasets[0].data.length > 0 && analyticsData.monthlyTrend.datasets[0].data.some(d => d > 0) && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Trend Analysis</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <LineChart
                  data={analyticsData.monthlyTrend}
                  width={screenWidth - 64}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                />
              </View>
            </View>
          )}

          {/* Time of Day Analysis */}
          {analyticsData.timeOfDayData.length > 0 && analyticsData.timeOfDayData[0].name !== "No data" && (
            <View className="mb-8">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Preferred Time</Text>
              <View className="bg-gray-50 rounded-xl p-4">
                <PieChart
                  data={analyticsData.timeOfDayData}
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

          {/* Mood & Difficulty Insights */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Insights</Text>
            
            {analyticsData.moodData.before.length > 1 && analyticsData.moodData.before[0] !== 5 && (
              <View className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl mb-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="happy-outline" size={24} color="#10b981" />
                  <Text className="text-lg font-medium text-gray-800 ml-2">Mood Impact</Text>
                </View>
                <Text className="text-gray-600">
                  This habit improves your mood by an average of {averageMoodImprovement}%
                </Text>
              </View>
            )}

            <View className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="fitness-outline" size={24} color="#f59e0b" />
                <Text className="text-lg font-medium text-gray-800 ml-2">Difficulty Level</Text>
              </View>
              <Text className="text-gray-600">
                Average difficulty rating: {averageDifficulty}/5 - 
                {parseFloat(averageDifficulty) < 2 ? " Very Easy" : 
                 parseFloat(averageDifficulty) < 3 ? " Easy" :
                 parseFloat(averageDifficulty) < 4 ? " Moderate" : " Challenging"}
              </Text>
            </View>
          </View>

          {/* Recommendations */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Recommendations</Text>
            
            <View className="space-y-3">
              {analyticsData.completionRate < 70 && (
                <View className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <Text className="font-medium text-yellow-800">Consistency Tip</Text>
                  <Text className="text-yellow-700 mt-1">
                    Your completion rate is below 70%. Try setting reminders or reducing the difficulty.
                  </Text>
                </View>
              )}
              
              {analyticsData.currentStreak < 3 && (
                <View className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <Text className="font-medium text-blue-800">Streak Building</Text>
                  <Text className="text-blue-700 mt-1">
                    Focus on building a 7-day streak. Small consistent actions lead to big results!
                  </Text>
                </View>
              )}

              {parseFloat(averageDifficulty) > 4 && (
                <View className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <Text className="font-medium text-red-800">Difficulty Adjustment</Text>
                  <Text className="text-red-700 mt-1">
                    This habit seems quite challenging. Consider breaking it into smaller steps.
                  </Text>
                </View>
              )}

              {analyticsData.completionRate >= 90 && analyticsData.currentStreak >= 7 && (
                <View className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <Text className="font-medium text-green-800">Excellent Progress!</Text>
                  <Text className="text-green-700 mt-1">
                    You're doing great with this habit! Keep up the excellent work.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}