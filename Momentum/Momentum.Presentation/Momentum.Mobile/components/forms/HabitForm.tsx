import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getNZToday } from "@/api/habits/date-utils";
import type { CreateHabitDto, Habit, HabitResponse } from "@/api/habits/types";
import { HabitFrequency } from "@/api/habits/types";
import { useGetCategories } from "@/api/habits/use-categories";

// Habit icons
const HABIT_ICONS = [
  "water-outline",
  "book-outline",
  "fitness-outline",
  "leaf-outline",
  "walk-outline",
  "bicycle-outline",
  "musical-notes-outline",
  "brush-outline",
  "camera-outline",
  "heart-outline",
  "restaurant-outline",
  "bed-outline",
  "sunny-outline",
  "moon-outline",
  "code-outline",
  "laptop-outline",
  "calculator-outline",
  "pencil-outline",
  "call-outline",
  "mail-outline",
  "gift-outline",
  "trophy-outline",
  "star-outline",
  "time-outline",
  "alarm-outline",
  "stopwatch-outline",
  "hourglass-outline",
];

// Days of week for repeat selection
const DAYS_OF_WEEK = [
  { key: "monday", label: "Mon", full: "Monday" },
  { key: "tuesday", label: "Tue", full: "Tuesday" },
  { key: "wednesday", label: "Wed", full: "Wednesday" },
  { key: "thursday", label: "Thu", full: "Thursday" },
  { key: "friday", label: "Fri", full: "Friday" },
  { key: "saturday", label: "Sat", full: "Saturday" },
  { key: "sunday", label: "Sun", full: "Sunday" },
];

// Colors for habits
const HABIT_COLORS = [
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#FFB6C1",
  "#DDA0DD",
  "#20B2AA",
  "#FF6B6B",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
];

export interface HabitFormProps {
  habitData?: Habit | HabitResponse;
  isEditMode?: boolean;
  onSubmit: (data: CreateHabitDto | any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  userId: string;
}

export default function HabitForm({
  habitData,
  isEditMode = false,
  onSubmit,
  onCancel,
  isLoading = false,
  userId,
}: HabitFormProps) {
  const [step, setStep] = useState(1);
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedIcon, setSelectedIcon] = useState("star-outline");
  const [selectedColor, setSelectedColor] = useState("#4ECDC4");
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({});
  const [startDate, setStartDate] = useState(getNZToday());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showIconModal, setShowIconModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [priority, setPriority] = useState(2);
  const [difficulty, setDifficulty] = useState(3);
  const [isPublic, setIsPublic] = useState(false);
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(15);
  const [notes, setNotes] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>(
    HabitFrequency.Daily
  );

  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategories();
  const categories = categoriesData || [];

  // Load habit data for editing
  useEffect(() => {
    if (isEditMode && habitData) {
      const habit: Habit = 'habit' in habitData ? habitData.habit : habitData;
      setHabitName(habit.name);
      setHabitDescription(habit.description || "");
      setSelectedCategory(habit.categoryId || null);
      setSelectedIcon(habit.iconName || "star-outline");
      setSelectedColor(habit.color || "#4ECDC4");
      setPriority(habit.priority || 2);
      setDifficulty(habit.difficultyLevel || 3);
      setNotes(habit.notes || "");
      setFrequency(habit.frequency);
      setIsPublic(habit.isPublic || false);

      if (habit.startDate) {
        setStartDate(new Date(habit.startDate));
      }
      if (habit.endDate) {
        setEndDate(new Date(habit.endDate));
        setHasEndDate(true);
      }
      if (habit.preferredTime) {
        const [hours, minutes] = habit.preferredTime.split(":").map(Number);
        const time = new Date();
        time.setHours(hours, minutes, 0, 0);
        setReminderTime(time);
        setEnableReminder(habit.notificationsEnabled || false);
        setReminderMinutesBefore(habit.reminderMinutesBefore || 15);
      }
    }
  }, [isEditMode, habitData]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleDateChange = (
    _event: any,
    selectedDate?: Date,
    type: "start" | "end" = "start"
  ) => {
    if (type === "start") {
      if (Platform.OS === "android") {
        setShowStartDatePicker(false);
      }
      if (selectedDate) {
        setStartDate(selectedDate);
      }
    } else {
      if (Platform.OS === "android") {
        setShowEndDatePicker(false);
      }
      if (selectedDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!habitName.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      if (isEditMode && habitData) {
        const originalHabit: Habit = 'habit' in habitData ? habitData.habit : habitData;
        
        const updateData: any = {
          id: originalHabit.id,
          name: habitName.trim(),
          description: habitDescription.trim() || "",
          userId: userId,
          frequency: frequency,
          iconName: selectedIcon,
          color: selectedColor,
          priority: priority,
          difficultyLevel: difficulty,
          startDate: startDate.toISOString(),
          endDate: hasEndDate && endDate ? endDate.toISOString() : null,
          preferredTime: enableReminder ? reminderTime.toTimeString().slice(0, 8) : null,
          isPublic: isPublic || false,
          notificationsEnabled: enableReminder || false,
          reminderMinutesBefore: enableReminder ? reminderMinutesBefore : 0,
          sortOrder: originalHabit.sortOrder || 0,
          notes: notes.trim() || "",
          createdAt: originalHabit.createdAt || new Date().toISOString(),
          archivedAt: originalHabit.archivedAt || null,
          categoryId: selectedCategory
        };
        
        await onSubmit(updateData);
      } else {
        const habitData: CreateHabitDto = {
          id: 0,
          name: habitName.trim(),
          description: habitDescription.trim() || undefined,
          frequency: frequency,
          categoryId: selectedCategory,
          userId: userId,
          iconName: selectedIcon,
          color: selectedColor,
          priority: priority,
          difficultyLevel: difficulty,
          startDate: startDate.toISOString(),
          endDate: hasEndDate && endDate ? endDate.toISOString() : null,
          preferredTime: enableReminder
            ? reminderTime.toTimeString().slice(0, 8)
            : null,
          isPublic: isPublic,
          notificationsEnabled: enableReminder,
          reminderMinutesBefore: enableReminder ? reminderMinutesBefore : 0,
          sortOrder: 0,
          notes: notes.trim() || null,
          createdAt: new Date().toISOString(),
          archivedAt: null,
        };

        await onSubmit(habitData);
      }
    } catch (error: any) {
      console.error("Error saving habit:", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save habit. Please try again."
      );
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!habitName.trim()) {
        Alert.alert("Error", "Please enter a habit name");
        return;
      }
      if (!selectedCategory) {
        Alert.alert("Error", "Please select a category");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
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

  const selectedCategoryData = categories.find(
    (cat) => cat.id === selectedCategory
  );

  if (categoriesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text className="text-gray-600 mt-2">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-4 py-6 bg-blue-50">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">
              {isEditMode ? "Edit Habit" : "Create Habit"}
              {step === 2 ? " - Schedule" : step === 3 ? " - Settings" : ""}
            </Text>
            <Text className="text-blue-500 font-medium">{step}/3</Text>
          </View>

          {/* Progress indicator */}
          <View className="flex-row space-x-2">
            {[1, 2, 3].map((s) => (
              <View
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <View>
              {/* Habit Name */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Habit Name *
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-lg"
                  placeholder="What habit do you want to build?"
                  value={habitName}
                  onChangeText={setHabitName}
                  maxLength={50}
                />
                <Text className="text-gray-500 text-sm mt-1">
                  {habitName.length}/50 characters
                </Text>
              </View>

              {/* Description */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Description
                </Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 h-20"
                  placeholder="Optional description..."
                  value={habitDescription}
                  onChangeText={setHabitDescription}
                  multiline
                  textAlignVertical="top"
                  maxLength={200}
                />
                <Text className="text-gray-500 text-sm mt-1">
                  {habitDescription.length}/200 characters
                </Text>
              </View>

              {/* Category */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Category *
                </Text>
                <View className="flex-row flex-wrap">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`flex-row items-center p-3 rounded-lg mr-2 mb-2 border ${
                        selectedCategory === category.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <View
                        className="w-6 h-6 rounded-full items-center justify-center mr-2"
                        style={{ backgroundColor: category.color || "#4ECDC4" }}
                      >
                        <Ionicons
                          name={
                            (category.icon ||
                              "ellipsis-horizontal-outline") as any
                          }
                          size={14}
                          color="white"
                        />
                      </View>
                      <Text
                        className={`text-sm ${
                          selectedCategory === category.id
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Icon & Color */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Appearance
                </Text>
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-4 items-center mr-2"
                    onPress={() => setShowIconModal(true)}
                  >
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: selectedColor }}
                    >
                      <Ionicons
                        name={selectedIcon as any}
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text className="text-gray-600">Choose Icon</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-4 items-center"
                    onPress={() => setShowColorModal(true)}
                  >
                    <View
                      className="w-12 h-12 rounded-full mb-2"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <Text className="text-gray-600">Choose Color</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <View>
              {/* Start Date */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Start Date
                </Text>
                <TouchableOpacity
                  className="flex-row items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Text className="text-lg">{formatDate(startDate)}</Text>
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* End Date */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-700">End Date</Text>
                  <Switch
                    value={hasEndDate}
                    onValueChange={setHasEndDate}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={hasEndDate ? "#4a90e2" : "#f4f3f4"}
                  />
                </View>

                {hasEndDate && (
                  <TouchableOpacity
                    className="flex-row items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                    onPress={() => setShowEndDatePicker(true)}
                  >
                    <Text className="text-lg">
                      {endDate ? formatDate(endDate) : "Select end date"}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Frequency */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Frequency
                </Text>
                <View className="flex-row space-x-2">
                  {[
                    { value: HabitFrequency.Daily, label: "Daily" },
                    { value: HabitFrequency.Weekly, label: "Weekly" },
                    { value: HabitFrequency.Monthly, label: "Monthly" },
                    { value: HabitFrequency.Custom, label: "Custom" },
                  ].map((f) => (
                    <TouchableOpacity
                      key={f.value}
                      className={`flex-1 py-2 px-3 rounded-lg border mr-2 ${
                        frequency === f.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
                      onPress={() => setFrequency(f.value)}
                    >
                      <Text
                        className={`text-center ${
                          frequency === f.value
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Repeat Days */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Repeat on
                </Text>
                <View className="flex-row justify-between">
                  {DAYS_OF_WEEK.map((day) => (
                    <TouchableOpacity
                      key={day.key}
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        selectedDays[day.key] ? "bg-blue-500" : "bg-gray-200"
                      }`}
                      onPress={() => toggleDay(day.key)}
                    >
                      <Text
                        className={`font-medium ${
                          selectedDays[day.key] ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quick selections */}
                <View className="flex-row mt-3 space-x-2">
                  <TouchableOpacity
                    className="bg-blue-50 px-3 py-1 rounded-full"
                    onPress={() => {
                      const weekdays = {
                        monday: true,
                        tuesday: true,
                        wednesday: true,
                        thursday: true,
                        friday: true,
                      };
                      setSelectedDays({ ...selectedDays, ...weekdays });
                    }}
                  >
                    <Text className="text-blue-600 text-sm">Weekdays</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-purple-50 px-3 py-1 rounded-full"
                    onPress={() => {
                      const everyday = DAYS_OF_WEEK.reduce(
                        (acc, day) => ({
                          ...acc,
                          [day.key]: true,
                        }),
                        {}
                      );
                      setSelectedDays(everyday);
                    }}
                  >
                    <Text className="text-purple-600 text-sm">Every Day</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-gray-50 px-3 py-1 rounded-full"
                    onPress={() => setSelectedDays({})}
                  >
                    <Text className="text-gray-600 text-sm">Clear</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Selected days preview */}
              {Object.values(selectedDays).some(Boolean) && (
                <View className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <Text className="font-medium text-blue-800 mb-1">
                    Selected Days:
                  </Text>
                  <Text className="text-blue-600">
                    {DAYS_OF_WEEK.filter((day) => selectedDays[day.key])
                      .map((day) => day.full)
                      .join(", ")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Step 3: Settings */}
          {step === 3 && (
            <View>
              {/* Priority */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Priority
                </Text>
                <View className="flex-row space-x-2">
                  {[
                    { value: 1, label: "High", color: "#FF6B6B" },
                    { value: 2, label: "Medium", color: "#FFEAA7" },
                    { value: 3, label: "Low", color: "#DDA0DD" },
                  ].map((p) => (
                    <TouchableOpacity
                      key={p.value}
                      className={`flex-1 py-3 px-4 rounded-lg border mr-2 ${
                        priority === p.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
                      onPress={() => setPriority(p.value)}
                    >
                      <View className="items-center">
                        <View
                          className="w-4 h-4 rounded-full mb-1"
                          style={{ backgroundColor: p.color }}
                        />
                        <Text
                          className={
                            priority === p.value
                              ? "text-blue-700"
                              : "text-gray-600"
                          }
                        >
                          {p.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Difficulty */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">
                  Difficulty Level: {difficulty}/5
                </Text>
                <View className="flex-row justify-between items-center">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        difficulty >= level ? "bg-orange-500" : "bg-gray-200"
                      }`}
                      onPress={() => setDifficulty(level)}
                    >
                      <Text
                        className={`font-bold ${
                          difficulty >= level ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text className="text-gray-500 text-sm mt-2">
                  {difficulty === 1 && "Very Easy"}
                  {difficulty === 2 && "Easy"}
                  {difficulty === 3 && "Moderate"}
                  {difficulty === 4 && "Hard"}
                  {difficulty === 5 && "Very Hard"}
                </Text>
              </View>

              {/* Reminder */}
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
                    <Text className="text-lg">{formatTime(reminderTime)}</Text>
                    <Ionicons name="time-outline" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Notes */}
              <View className="mb-6">
                <Text className="font-semibold text-gray-700 mb-2">Notes</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 h-24"
                  placeholder="Any additional notes..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  textAlignVertical="top"
                  maxLength={300}
                />
                <Text className="text-gray-500 text-sm mt-1">
                  {notes.length}/300 characters
                </Text>
              </View>

              {/* Preview */}
              <View className="p-4 bg-gray-50 rounded-xl">
                <Text className="font-semibold text-gray-700 mb-3">
                  Preview
                </Text>
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: selectedColor }}
                  >
                    <Ionicons
                      name={selectedIcon as any}
                      size={24}
                      color="white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-lg text-gray-800">
                      {habitName}
                    </Text>
                    {selectedCategoryData && (
                      <Text className="text-gray-500">
                        {selectedCategoryData.name}
                      </Text>
                    )}
                    {Object.values(selectedDays).some(Boolean) && (
                      <Text className="text-blue-600 text-sm">
                        {DAYS_OF_WEEK.filter((day) => selectedDays[day.key])
                          .map((day) => day.label)
                          .join(", ")}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation */}
        <View className="px-4 py-4 border-t border-gray-200">
          <View className="flex-row space-x-4">
            {step > 1 && (
              <TouchableOpacity
                className="flex-1 bg-gray-200 py-3 rounded-lg items-center mr-2"
                onPress={prevStep}
              >
                <Text className="font-medium text-gray-800">Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              className="flex-1 bg-blue-500 py-3 rounded-lg items-center"
              onPress={step === 3 ? handleSubmit : nextStep}
              disabled={isLoading}
            >
              <Text className="font-medium text-white">
                {isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : step === 3 ? (
                  isEditMode ? (
                    "Update Habit"
                  ) : (
                    "Create Habit"
                  )
                ) : (
                  "Next"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Pickers */}
        {Platform.OS === "ios" ? (
          <>
            {/* Start Date Picker Modal for iOS */}
            <Modal
              visible={showStartDatePicker}
              animationType="slide"
              presentationStyle="formSheet"
            >
              <View className="bg-white" style={{ height: 350 }}>
                <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(false)}
                  >
                    <Text className="text-blue-500 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-semibold">
                    Select Start Date
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(false)}
                  >
                    <Text className="text-blue-500 font-medium">Done</Text>
                  </TouchableOpacity>
                </View>

                <View className="justify-center items-center py-8">
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="spinner"
                    onChange={(e, date) => handleDateChange(e, date, "start")}
                    minimumDate={new Date()}
                    style={{ width: 300, height: 200 }}
                  />
                </View>
              </View>
            </Modal>

            {/* End Date Picker Modal for iOS */}
            <Modal
              visible={showEndDatePicker && hasEndDate}
              animationType="slide"
              presentationStyle="formSheet"
            >
              <View className="bg-white" style={{ height: 350 }}>
                <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text className="text-blue-500 font-medium">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="text-lg font-semibold">Select End Date</Text>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                    <Text className="text-blue-500 font-medium">Done</Text>
                  </TouchableOpacity>
                </View>

                <View className="justify-center items-center py-8">
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(e, date) => handleDateChange(e, date, "end")}
                    minimumDate={startDate}
                    style={{ width: 300, height: 200 }}
                  />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <>
            {/* Android Date Pickers */}
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(e, date) => handleDateChange(e, date, "start")}
                minimumDate={new Date()}
              />
            )}

            {showEndDatePicker && hasEndDate && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(e, date) => handleDateChange(e, date, "end")}
                minimumDate={startDate}
              />
            )}
          </>
        )}

        {/* Time Picker Modal */}
        <Modal
          visible={showTimePicker && enableReminder}
          animationType="slide"
          presentationStyle="formSheet"
        >
          <View className="bg-white" style={{ height: 350 }}>
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text className="text-blue-500 font-medium">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Set Reminder Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text className="text-blue-500 font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            <View className="justify-center items-center py-8">
              <DateTimePicker
                value={reminderTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={{ width: 300, height: 200 }}
              />
            </View>
          </View>
        </Modal>

        {/* Icon Selection Modal */}
        <Modal
          visible={showIconModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowIconModal(false)}>
                <Text className="text-blue-500 font-medium">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Choose Icon</Text>
              <TouchableOpacity onPress={() => setShowIconModal(false)}>
                <Text className="text-blue-500 font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              <View className="flex-row flex-wrap">
                {HABIT_ICONS.map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`w-16 h-16 m-2 rounded-lg items-center justify-center ${
                      selectedIcon === icon ? "bg-blue-500" : "bg-gray-100"
                    }`}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons
                      name={icon as any}
                      size={24}
                      color={selectedIcon === icon ? "white" : "#666"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Color Selection Modal */}
        <Modal
          visible={showColorModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowColorModal(false)}>
                <Text className="text-blue-500 font-medium">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Choose Color</Text>
              <TouchableOpacity onPress={() => setShowColorModal(false)}>
                <Text className="text-blue-500 font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              <View className="flex-row flex-wrap">
                {HABIT_COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`w-16 h-16 m-2 rounded-lg border-4 ${
                      selectedColor === color
                        ? "border-gray-800"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <View className="flex-1 items-center justify-center">
                        <Ionicons name="checkmark" size={24} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}