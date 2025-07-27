import { TabNavigation } from "@/components/common";
import Header from "@/components/ui/Header";
import { useGetUserHabits } from "@/api/habits/use-habits";
import { useAuth } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HabitStats() {
  const user = useAuth.use.user();
  const userId = user?.id || "";

  // Calculate current month for API call (consistent with other screens)
  const currentMonth = React.useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }, []);

  const {
    data: habitsData,
    isLoading: habitsLoading,
  } = useGetUserHabits({
    variables: { userId, month: currentMonth },
    enabled: !!userId,
  });

  const habits = habitsData || [];

  if (habitsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Statistics" showMenu={true} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600">Loading...</Text>
        </View>
        <TabNavigation />
      </SafeAreaView>
    );
  }

  if (habits.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Header title="Statistics" showMenu={true} />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="bar-chart-outline" size={64} color="#ccc" />
          <Text className="text-xl font-semibold text-gray-800 mt-4 mb-2">
            No Statistics Yet
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Create habits to see your progress statistics.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-6 py-3 rounded-lg"
            onPress={() => router.push("/(protected)/habit/add")}
          >
            <Text className="text-white font-medium">Create First Habit</Text>
          </TouchableOpacity>
        </View>
        <TabNavigation />
      </SafeAreaView>
    );
  }

  const mockStats = {
    totalHabits: habits.length,
    completedToday: Math.floor(habits.length * 0.7),
    currentStreak: 5,
    weeklyCompletion: 78,
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Statistics" showMenu={true} />
      
      <ScrollView className="flex-1">
        {/* Overview Cards */}
        <View className="px-4 py-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Overview</Text>
          
          <View className="flex-row flex-wrap">
            <View className="w-1/2 pr-2 mb-4">
              <View className="bg-blue-50 p-4 rounded-xl">
                <Text className="text-blue-800 font-semibold mb-1">Current Streak</Text>
                <Text className="text-2xl font-bold text-blue-600">{mockStats.currentStreak}</Text>
                <Text className="text-blue-600 text-sm">days</Text>
              </View>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <View className="bg-green-50 p-4 rounded-xl">
                <Text className="text-green-800 font-semibold mb-1">Active Habits</Text>
                <Text className="text-2xl font-bold text-green-600">{mockStats.totalHabits}</Text>
                <Text className="text-green-600 text-sm">total</Text>
              </View>
            </View>
            
            <View className="w-1/2 pr-2 mb-4">
              <View className="bg-orange-50 p-4 rounded-xl">
                <Text className="text-orange-800 font-semibold mb-1">Today</Text>
                <Text className="text-2xl font-bold text-orange-600">{mockStats.completedToday}</Text>
                <Text className="text-orange-600 text-sm">completed</Text>
              </View>
            </View>
            
            <View className="w-1/2 pl-2 mb-4">
              <View className="bg-purple-50 p-4 rounded-xl">
                <Text className="text-purple-800 font-semibold mb-1">This Week</Text>
                <Text className="text-2xl font-bold text-purple-600">{mockStats.weeklyCompletion}%</Text>
                <Text className="text-purple-600 text-sm">completion</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Habits Progress */}
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Habit Progress</Text>
          
          {habits.map((habit: any, index: number) => {
            const mockProgress = [85, 72, 91, 68, 78, 95, 82][index % 7];
            return (
              <View key={habit.id} className="bg-gray-50 rounded-lg p-4 mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-medium text-gray-800 flex-1" numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text className="text-lg font-bold text-blue-600">{mockProgress}%</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <View
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${mockProgress}%` }}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 bg-blue-50 p-4 rounded-xl items-center"
              onPress={() => router.push("/(protected)/habit/calendar")}
            >
              <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
              <Text className="text-blue-700 font-medium mt-2">View Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-50 p-4 rounded-xl items-center"
              onPress={() => router.push("/(protected)/habit/add")}
            >
              <Ionicons name="add-circle-outline" size={24} color="#10B981" />
              <Text className="text-green-700 font-medium mt-2">Add Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <TabNavigation />
    </SafeAreaView>
  );
}