import { useGetUserHabits } from "@/api";
import { useToggleHabitCompletion, useGetHabitEntries } from "@/api/habits/use-habit-entries";
import { client } from "@/api/common";
import { Header, TabNavigation } from "@/components/common";
import { useAuth, useIsAuthenticated } from "@/lib";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Motivational quotes
const QUOTES = [
  "Small habits make big changes.",
  "Consistency is the key to success.",
  "Every day is a new opportunity to build better habits.",
  "Progress is progress, no matter how small.",
  "Your habits shape your future.",
];

export default function Home() {
  const [quote, setQuote] = useState("");
  const [todaysDateString] = useState(new Date().toISOString().split("T")[0]);
  const [todaysTimestamp] = useState(new Date().getTime());
  const [habitCompletions, setHabitCompletions] = useState<Record<number, boolean>>({});
  const { user } = useAuth();
  const isAuthenticated = useIsAuthenticated();
  const userId = user?.id;
  // Fetch user's habits
  const {
    data: habitsData,
    isPending: habitsLoading,
    isError: habitsError,
  } = useGetUserHabits({
    variables: {
      userId: userId || "",
      date: todaysTimestamp,
    },
    enabled: !!userId,
  });

  // Toggle habit completion mutation
  const toggleHabitMutation = useToggleHabitCompletion();

  // Process habits data to include today's completion status
  const todayHabits = useMemo(() => {
    if (!habitsData || !Array.isArray(habitsData)) return [];

    return habitsData.map((habit: any) => {
      return {
        id: habit.id,
        title: habit.name,
        completed: habitCompletions[habit.id] || false,
        time: habit.preferredTime
          ? new Date(habit.preferredTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : undefined,
        description: habit.description,
      };
    });
  }, [habitsData, habitCompletions]);

  // Calculate stats from habits data
  const stats = useMemo(() => {
    const totalHabits = Array.isArray(habitsData) ? habitsData.length : 0;
    const completedToday = todayHabits.filter(
      (habit: any) => habit.completed
    ).length;
    const completionRate =
      totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    return {
      streak: 0, // TODO: Calculate from habit entries
      completionRate,
      totalCompletions: 0, // TODO: Calculate from habit entries
      habitsCreated: totalHabits,
    };
  }, [habitsData, todayHabits]);

  useEffect(() => {
    // Set a random motivational quote
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  useEffect(() => {
    // Redirect to sign-in if user.id is null or user is not authenticated
    if (!isAuthenticated || !userId) {
      router.replace("/sign-in");
    }
  }, [userId, isAuthenticated]);

  // Fetch habit entries for today to determine completion status
  useEffect(() => {
    if (!habitsData || !Array.isArray(habitsData)) return;

    const fetchHabitEntries = async () => {
      const completions: Record<number, boolean> = {};
      
      for (const habit of habitsData) {
        try {
          const response = await client.get(
            `api/v1/habit-entries/habit/${habit.id}?startDate=${todaysDateString}&endDate=${todaysDateString}`
          );
          const entries = response.data;
          completions[habit.id] = entries.length > 0 && entries[0].completed;
        } catch (error) {
          console.error(`Failed to fetch entries for habit ${habit.id}:`, error);
          completions[habit.id] = false;
        }
      }
      
      setHabitCompletions(completions);
    };

    fetchHabitEntries();
  }, [habitsData, todaysDateString]);

  const toggleHabitCompletion = async (habitId: number) => {
    try {
      const habit = todayHabits.find((h: any) => h.id === habitId);
      if (!habit) return;

      const newCompletedStatus = !habit.completed;
      
      // Optimistically update local state
      setHabitCompletions(prev => ({
        ...prev,
        [habitId]: newCompletedStatus
      }));

      await toggleHabitMutation.mutateAsync({
        habitId,
        date: todaysDateString,
        completed: newCompletedStatus,
      });

    } catch (error) {
      console.error("Failed to toggle habit completion:", error);
      // Revert local state on error
      const habit = todayHabits.find((h: any) => h.id === habitId);
      if (habit) {
        setHabitCompletions(prev => ({
          ...prev,
          [habitId]: habit.completed
        }));
      }
    }
  };

  const completedCount = todayHabits.filter((habit: any) => habit.completed).length;
  const totalHabits = todayHabits.length;
  const completionPercentage =
    totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

  if (habitsLoading) {
    return (
      <SafeAreaView className="bg-white flex-1">
        <Header title="Home" showMenu={true} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading your habits...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (habitsError) {
    return (
      <SafeAreaView className="bg-white flex-1">
        <Header title="Home" showMenu={true} />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-600 text-center mb-4">
            Failed to load your habits. Please try again.
          </Text>
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-full"
            onPress={() => router.replace("/home")}
          >
            <Text className="text-white font-medium">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <Header title="Home" showMenu={true} />
      <ScrollView className="flex-1">
        {/* Greeting section */}
        <View className="px-6 pt-4 pb-4">
          <Text className="text-2xl font-bold text-gray-800">Good Morning</Text>
          <Text className="text-lg text-gray-600">
            Let's build some great habits today!
          </Text>
        </View>

        {/* Progress card */}
        <View className="mx-6 bg-blue-50 rounded-xl p-5 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              Today's Progress
            </Text>
            <Text className="text-xl font-bold text-blue-600">
              {completionPercentage}%
            </Text>
          </View>

          {/* Progress bar */}
          <View className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </View>

          <Text className="text-gray-600">
            You've completed {completedCount} of {totalHabits} habits today
          </Text>
        </View>

        {/* Today's habits */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Today's Habits
            </Text>
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => router.push("/(protected)/habit/add")}
            >
              <Ionicons name="add-circle" size={18} color="#4a90e2" />
              <Text className="text-blue-500 font-medium ml-1">Add New</Text>
            </TouchableOpacity>
          </View>

          {todayHabits.length > 0 ? (
            todayHabits.map((habit: any) => (
              <TouchableOpacity
                key={habit.id}
                className="flex-row items-center py-3 border-b border-gray-100"
                onPress={() => router.push(`/(protected)/habit/${habit.id}`)}
              >
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleHabitCompletion(habit.id);
                  }}
                  className={`w-6 h-6 flex items-center justify-center rounded-full border mr-3 ${
                    habit.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {habit.completed && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
                <View className="flex-1">
                  <Text
                    className={`font-medium ${
                      habit.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {habit.title}
                  </Text>
                  {habit.time && (
                    <Text className="text-gray-500 text-sm">{habit.time}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="py-6 items-center">
              <Text className="text-gray-500 mb-2">
                No habits scheduled for today
              </Text>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-full"
                onPress={() => router.push("/(protected)/habit/add")}
              >
                <Text className="text-white font-medium">
                  Add Your First Habit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats grid */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Your Stats
          </Text>
          <View className="flex-row flex-wrap">
            <View className="w-1/2 pr-2 mb-4">
              <View className="bg-green-50 p-4 rounded-xl">
                <Text className="text-green-800 font-semibold mb-1">
                  Current Streak
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-2xl font-bold text-green-600">
                    {stats.streak}
                  </Text>
                  <Text className="text-green-600 ml-1">days</Text>
                </View>
              </View>
            </View>

            <View className="w-1/2 pl-2 mb-4">
              <View className="bg-orange-50 p-4 rounded-xl">
                <Text className="text-orange-800 font-semibold mb-1">
                  Completion Rate
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-2xl font-bold text-orange-600">
                    {stats.completionRate}%
                  </Text>
                </View>
              </View>
            </View>

            <View className="w-1/2 pr-2">
              <View className="bg-purple-50 p-4 rounded-xl">
                <Text className="text-purple-800 font-semibold mb-1">
                  Total Completions
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-2xl font-bold text-purple-600">
                    {stats.totalCompletions}
                  </Text>
                </View>
              </View>
            </View>

            <View className="w-1/2 pl-2">
              <View className="bg-blue-50 p-4 rounded-xl">
                <Text className="text-blue-800 font-semibold mb-1">
                  Active Habits
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-2xl font-bold text-blue-600">
                    {stats.habitsCreated}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Motivational quote */}
        <View className="mx-6 bg-gray-50 p-5 rounded-xl mb-6 items-center">
          <Text className="text-gray-600 italic text-center mb-2">
            "{quote}"
          </Text>
          <Text className="text-gray-500 text-sm">Momentum</Text>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="flex-1 bg-purple-50 p-4 rounded-xl items-center"
              onPress={() => router.push("/(protected)/habit/calendar")}
            >
              <Ionicons name="calendar-outline" size={24} color="#8B5CF6" />
              <Text className="text-purple-700 font-medium mt-2">Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-50 p-4 rounded-xl items-center"
              onPress={() => router.push("/(protected)/habit/stats")}
            >
              <Ionicons name="analytics-outline" size={24} color="#10B981" />
              <Text className="text-green-700 font-medium mt-2">
                Statistics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-orange-50 p-4 rounded-xl items-center"
              onPress={() => router.push("/(protected)/habit/add")}
            >
              <Ionicons name="add-circle-outline" size={24} color="#F59E0B" />
              <Text className="text-orange-700 font-medium mt-2">
                Add Habit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekly overview */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Weekly Overview
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(protected)/habit/calendar")}
            >
              <Text className="text-blue-500 font-medium">See Calendar</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <View key={index} className="items-center">
                <Text className="text-gray-500 mb-2">{day}</Text>
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    index === 3
                      ? "bg-blue-500"
                      : index < 3
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                >
                  {index <= 3 && (
                    <Ionicons name="checkmark" size={18} color="white" />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating action button */}
      <TouchableOpacity
        className="absolute bottom-20 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-md"
        onPress={() => router.push("/(protected)/habit/add")}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Tab Navigation */}
      <TabNavigation />
    </SafeAreaView>
  );
}
