import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Days of week for repeat selection
const DAYS_OF_WEEK = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

export default function AddHabit() {
  const [title, setTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  const handleSave = () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a habit title");
      return;
    }

    // Check if any days are selected when it's a recurring habit
    const anyDaySelected = Object.values(selectedDays).some(
      (selected) => selected
    );
    if (!anyDaySelected) {
      Alert.alert(
        "Info",
        "No repeat days selected. This will be a one-time habit."
      );
    }

    // Format the data for saving
    const habitData = {
      id: Date.now(), // Simple ID generation
      title: title.trim(),
      startDate: startDate.toISOString().split("T")[0],
      recurring: anyDaySelected,
      recurringDays: selectedDays,
      reminder: enableReminder,
      reminderTime: enableReminder ? reminderTime.toISOString() : null,
      completed: false,
    };

    // Here you'd save to your API / backend
    console.log("Saving habit:", habitData);

    // In a real app, save to API then navigate back
    Alert.alert("Success", "Habit created successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white px-4 py-6">
        <View className="mb-6">
          <Text className="font-semibold text-gray-700 mb-2">Habit Title</Text>
          <TextInput
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
            placeholder="What habit do you want to build?"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-700 mb-2">Start Date</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{formatDate(startDate)}</Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View className="mb-6">
          <Text className="font-semibold text-gray-700 mb-2">Repeat</Text>
          <View className="flex-row flex-wrap justify-between">
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day.key}
                className={`rounded-full w-10 h-10 items-center justify-center mb-2 ${
                  selectedDays[day.key] ? "bg-blue-500" : "bg-gray-200"
                }`}
                onPress={() => toggleDay(day.key)}
              >
                <Text
                  className={
                    selectedDays[day.key] ? "text-white" : "text-gray-600"
                  }
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="font-semibold text-gray-700">Reminder</Text>
            <Switch
              value={enableReminder}
              onValueChange={setEnableReminder}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={enableReminder ? "#4a90e2" : "#f4f3f4"}
            />
          </View>

          {enableReminder && (
            <TouchableOpacity
              className="flex-row items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{formatTime(reminderTime)}</Text>
              <Ionicons name="time-outline" size={20} color="#666" />
            </TouchableOpacity>
          )}

          {showTimePicker && enableReminder && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 bg-gray-200 py-3 rounded-lg items-center"
            onPress={() => router.back()}
          >
            <Text className="font-medium text-gray-800">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-blue-500 py-3 rounded-lg items-center"
            onPress={handleSave}
          >
            <Text className="font-medium text-white">Save Habit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
