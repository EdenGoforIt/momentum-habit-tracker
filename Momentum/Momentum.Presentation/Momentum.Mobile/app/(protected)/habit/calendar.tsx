import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DateData, Calendar as RNCalendar } from "react-native-calendars";

// Mock data for habits
const MOCK_HABITS = {
  "2025-04-10": [
    { id: 1, title: "Morning Meditation", completed: true },
    { id: 2, title: "Read for 30 minutes", completed: false },
  ],
  "2025-04-11": [
    { id: 3, title: "Morning Meditation", completed: false },
    { id: 4, title: "Exercise", completed: false },
    { id: 5, title: "Drink 8 glasses of water", completed: true },
  ],
  "2025-04-12": [
    { id: 6, title: "Morning Meditation", completed: false },
    { id: 7, title: "Journal", completed: false },
  ],
};

type Habit = {
  id: number;
  title: string;
  completed: boolean;
};

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [habitsForDay, setHabitsForDay] = useState<Habit[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    // Generate marked dates from habits data
    const marks: MarkedDates = Object.keys(MOCK_HABITS).reduce((acc, date) => {
      const habits = MOCK_HABITS[date as keyof typeof MOCK_HABITS];
      const allCompleted = habits.every((habit) => habit.completed);
      const someCompleted = habits.some((habit) => habit.completed);

      let dotColor = "blue";
      if (allCompleted) dotColor = "green";
      else if (someCompleted) dotColor = "orange";

      return {
        ...acc,
        [date]: {
          marked: true,
          dotColor: dotColor,
        },
      };
    }, {} as MarkedDates);

    // Highlight selected date
    setMarkedDates({
      ...marks,
      [selectedDate]: {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: "#4a90e2",
      },
    });

    // Set habits for the selected date
    setHabitsForDay(
      MOCK_HABITS[selectedDate as keyof typeof MOCK_HABITS] || []
    );
  }, [selectedDate]);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const toggleHabitCompletion = (habitId: number) => {
    const updatedHabits = habitsForDay.map((habit) =>
      habit.id === habitId ? { ...habit, completed: !habit.completed } : habit
    );

    setHabitsForDay(updatedHabits);

    // In a real app, you would update this in your data store/API
    if (MOCK_HABITS[selectedDate as keyof typeof MOCK_HABITS]) {
      MOCK_HABITS[selectedDate as keyof typeof MOCK_HABITS] = updatedHabits;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-4 px-4">
        <RNCalendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#4a90e2",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#4a90e2",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            dotColor: "#4a90e2",
            selectedDotColor: "#ffffff",
            arrowColor: "#4a90e2",
            monthTextColor: "#2d4150",
            indicatorColor: "#4a90e2",
            textDayFontWeight: "300",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      <View className="flex-1 px-4 pt-4">
        <Text className="text-lg font-bold mb-2">
          {formatDate(selectedDate)}
        </Text>
        {habitsForDay.length > 0 ? (
          <ScrollView className="flex-1">
            {habitsForDay.map((habit) => (
              <TouchableOpacity
                key={habit.id}
                onPress={() => toggleHabitCompletion(habit.id)}
                className="flex-row items-center p-4 mb-2 border border-gray-200 rounded-lg"
              >
                <View
                  className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                    habit.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {habit.completed && (
                    <Ionicons name="checkmark" size={18} color="white" />
                  )}
                </View>
                <Text
                  className={`ml-3 text-base ${
                    habit.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {habit.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">
              No habits scheduled for this day
            </Text>
            <TouchableOpacity className="mt-4 bg-blue-500 py-2 px-4 rounded-full">
              <Text className="text-white font-medium">Add Habit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
