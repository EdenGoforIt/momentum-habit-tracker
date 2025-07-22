import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  SafeAreaView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { TabNavigation } from "@/components/common";

import { useGetUserHabits } from "@/api/habits/use-habits";
import { useToggleHabitCompletion } from "@/api/habits/use-habit-entries-real";
import { getHabitEntriesByHabitId } from "@/api/habits/use-habit-entries";
import { useAuth } from "@/lib/auth";
import type { Habit, HabitEntry } from "@/api/habits/types";

export default function HabitCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showHabitModal, setShowHabitModal] = useState(false);
  
  const user = useAuth.use.user();
  const userId = user?.id || "";

  // Calculate date range for the current month
  const currentMonth = new Date(selectedDate);
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  
  const startDate = startOfMonth.toISOString().split('T')[0];
  const endDate = endOfMonth.toISOString().split('T')[0];

  // API hooks
  const { data: habitsData, isLoading: habitsLoading } = useGetUserHabits({
    variables: { userId },
    enabled: !!userId
  });
  
  const [habitEntriesData, setHabitEntriesData] = useState<Record<number, HabitEntry[]>>({});
  const [entriesLoading, setEntriesLoading] = useState(false);
  
  const toggleHabitMutation = useToggleHabitCompletion();

  const habits = habitsData?.habits || [];

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
              const entries = await getHabitEntriesByHabitId(habit.id, startDate, endDate);
              return { habitId: habit.id, entries };
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
  }, [habits, startDate, endDate]);

  // Get habits for selected date (all habits for now)
  const selectedDateHabits = habits;

  // Get completed habits for selected date
  const completedHabits = useMemo(() => {
    const completed: number[] = [];
    habits.forEach(habit => {
      const entries = habitEntriesData[habit.id] || [];
      const dayEntry = entries.find(entry => entry.date === selectedDate);
      if (dayEntry?.completed) {
        completed.push(habit.id);
      }
    });
    return completed;
  }, [habits, habitEntriesData, selectedDate]);

  // Calculate marked dates for calendar
  const markedDates = useMemo(() => {
    const marked: any = {};
    
    // Generate all dates in the current month
    const currentDate = new Date(startOfMonth);
    while (currentDate <= endOfMonth) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Calculate completion rate for this date
      let completedCount = 0;
      habits.forEach(habit => {
        const entries = habitEntriesData[habit.id] || [];
        const dayEntry = entries.find(entry => entry.date === dateStr);
        if (dayEntry?.completed) {
          completedCount++;
        }
      });
      
      const completionRate = habits.length > 0 ? completedCount / habits.length : 0;
      
      let color = '#f0f0f0'; // light gray for no habits
      if (completionRate >= 1) color = '#4ECDC4'; // green for 100%
      else if (completionRate >= 0.75) color = '#96CEB4'; // light green for 75%+
      else if (completionRate >= 0.5) color = '#FFEAA7'; // yellow for 50%+
      else if (completionRate > 0) color = '#FFB6C1'; // light red for partial
      
      marked[dateStr] = {
        selected: dateStr === selectedDate,
        selectedColor: dateStr === selectedDate ? '#45B7D1' : color,
        marked: completionRate > 0,
        dotColor: color,
      };
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure selected date is marked
    if (!marked[selectedDate]) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#45B7D1',
      };
    } else {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = '#45B7D1';
    }

    return marked;
  }, [habits, habitEntriesData, selectedDate, startOfMonth, endOfMonth]);

  const toggleHabitCompletion = async (habitId: number) => {
    const isCurrentlyCompleted = completedHabits.includes(habitId);
    
    try {
      await toggleHabitMutation.mutateAsync({
        habitId,
        date: selectedDate,
        completed: !isCurrentlyCompleted,
      });
      
      // Refresh the entries for this habit
      const entries = await getHabitEntriesByHabitId(habitId, startDate, endDate);
      setHabitEntriesData(prev => ({
        ...prev,
        [habitId]: entries,
      }));
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update habit completion"
      );
    }
  };

  const getStreakInfo = () => {
    if (habits.length === 0) return { currentStreak: 0 };
    
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    // Calculate current streak
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      let completedCount = 0;
      habits.forEach(habit => {
        const entries = habitEntriesData[habit.id] || [];
        const dayEntry = entries.find(entry => entry.date === dateStr);
        if (dayEntry?.completed) {
          completedCount++;
        }
      });
      
      const completionRate = completedCount / habits.length;
      
      if (completionRate >= 0.8) { // 80% completion rate to count as streak
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
      {/* Header */}
      <View className="px-4 py-6 bg-blue-50">
        <View className="flex-row items-center justify-between mb-4">
          <View className="w-6" />
          <Text className="text-xl font-bold text-gray-800">Habit Calendar</Text>
          <TouchableOpacity onPress={() => setShowHabitModal(true)}>
            <Ionicons name="add-circle" size={24} color="#4a90e2" />
          </TouchableOpacity>
        </View>

        {/* Streak info */}
        <View className="bg-white rounded-lg p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-semibold text-gray-800">Current Streak</Text>
              <Text className="text-gray-600">Keep it going!</Text>
            </View>
            <View className="items-center">
              <Text className="text-3xl font-bold text-blue-500">{streakInfo.currentStreak}</Text>
              <Text className="text-gray-600">days</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Calendar */}
        <View className="px-4 py-2">
          <Calendar
            current={selectedDate}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#45B7D1',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#45B7D1',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#45B7D1',
              disabledArrowColor: '#d9e1e8',
              monthTextColor: '#2d4150',
              indicatorColor: '#45B7D1',
              textDayFontFamily: 'Rubik-Regular',
              textMonthFontFamily: 'Rubik-SemiBold',
              textDayHeaderFontFamily: 'Rubik-Medium',
              textDayFontWeight: '300',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
          />
        </View>

        {/* Legend */}
        <View className="px-4 py-2">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Legend</Text>
          <View className="flex-row flex-wrap">
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-4 h-4 rounded-full bg-green-400 mr-2" />
              <Text className="text-gray-600">100% Complete</Text>
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
              <View className="w-4 h-4 rounded-full bg-gray-300 mr-2" />
              <Text className="text-gray-600">No habits</Text>
            </View>
          </View>
        </View>

        {/* Selected Date Habits */}
        <View className="px-4 py-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Habits for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>

          {selectedDateHabits.length > 0 ? (
            selectedDateHabits.map((habit) => {
              const isCompleted = completedHabits.includes(habit.id);
              return (
                <TouchableOpacity
                  key={habit.id}
                  className={`flex-row items-center py-4 border-b border-gray-100 ${
                    toggleHabitMutation.isPending ? 'opacity-50' : ''
                  }`}
                  onPress={() => toggleHabitCompletion(habit.id)}
                  disabled={toggleHabitMutation.isPending}
                >
                  <View 
                    className={`w-12 h-12 rounded-full items-center justify-center mr-4`}
                    style={{ backgroundColor: isCompleted ? (habit.color || '#4ECDC4') : '#f0f0f0' }}
                  >
                    <Ionicons 
                      name={isCompleted ? "checkmark" : (habit.iconName || "star-outline") as any} 
                      size={20} 
                      color={isCompleted ? "white" : (habit.color || '#4ECDC4')} 
                    />
                  </View>
                  
                  <View className="flex-1">
                    <Text 
                      className={`font-medium text-lg ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}
                    >
                      {habit.name}
                    </Text>
                    <Text className="text-gray-500">
                      {isCompleted ? 'Completed' : 'Not completed'}
                    </Text>
                  </View>

                  <View 
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {isCompleted && <Ionicons name="checkmark" size={14} color="white" />}
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
                onPress={() => router.push('/(protected)/habit/add')}
              >
                <Text className="text-white font-medium">Add Habit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View className="px-4 py-4 mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Quick Stats</Text>
          
          <View className="flex-row">
            <View className="flex-1 bg-green-50 p-4 rounded-xl mr-2">
              <Text className="text-green-800 font-semibold">Total Habits</Text>
              <Text className="text-2xl font-bold text-green-600">{habits.length}</Text>
              <Text className="text-green-600 text-sm">Active</Text>
            </View>
            
            <View className="flex-1 bg-blue-50 p-4 rounded-xl ml-2">
              <Text className="text-blue-800 font-semibold">Today</Text>
              <Text className="text-2xl font-bold text-blue-600">
                {habits.length > 0 ? Math.round((completedHabits.length / habits.length) * 100) : 0}%
              </Text>
              <Text className="text-blue-600 text-sm">Complete</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal
        visible={showHabitModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowHabitModal(false)}>
              <Text className="text-blue-500 font-medium">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold">Quick Add</Text>
            <TouchableOpacity onPress={() => {
              setShowHabitModal(false);
              router.push('/(protected)/habit/add');
            }}>
              <Text className="text-blue-500 font-medium">Full Form</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView className="flex-1 p-4">
            <Text className="text-lg font-semibold mb-4">Add Habit for Today</Text>
            <TouchableOpacity 
              className="bg-blue-500 py-4 rounded-lg items-center"
              onPress={() => {
                setShowHabitModal(false);
                router.push('/(protected)/habit/add');
              }}
            >
              <Text className="text-white font-medium text-lg">Create New Habit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Tab Navigation */}
      <TabNavigation />
    </SafeAreaView>
  );
}