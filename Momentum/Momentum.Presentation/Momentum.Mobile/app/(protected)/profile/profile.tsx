import { useAuth } from "@/lib/auth";
import { showErrorAlert } from "@/utils/errorHandler";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // App preferences - these would ideally come from a settings store
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [weekStartsOnMonday, setWeekStartsOnMonday] = useState(true);

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          setIsLoading(true);
          try {
            // Use Zustand signOut - it handles token cleanup automatically
            signOut();
            router.replace("/sign-in");
          } catch (error) {
            console.error("Logout error:", error);
            showErrorAlert(
              error,
              "Logout Failed",
              "Failed to log out. Please try again."
            );
          } finally {
            setIsLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  // Show loading only if we're actively logging out
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* User info section */}
        <View className="px-6 pt-8 pb-6 items-center">
          {/* <View className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                className="w-full h-full"
              />
            ) : (
              <View className="w-full h-full bg-blue-500 items-center justify-center">
                <Text className="text-white text-3xl font-bold">
                  {user?.firstName?.charAt(0) ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "?"}
                </Text>
              </View>
            )}
          </View> */}
          <Text className="text-2xl font-bold text-gray-800">
            {user?.firstName
              ? `${user.firstName} ${user.lastName || ""}`
              : "User"}
          </Text>
          <Text className="text-gray-500">{user?.email || ""}</Text>

          <TouchableOpacity
            className="mt-4 px-6 py-2 bg-blue-500 rounded-full"
            onPress={handleEditProfile}
          >
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="h-2 bg-gray-100" />

        {/* Stats summary */}
        {/* <View className="p-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Your Progress
          </Text>
          <View className="flex-row justify-between">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-500">
                {user?.currentStreak || 0}
              </Text>
              <Text className="text-gray-600">Current Streak</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-500">
                {user?.completionRate ? `${user.completionRate}%` : "0%"}
              </Text>
              <Text className="text-gray-600">Completion Rate</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-500">
                {user?.totalCompletions || 0}
              </Text>
              <Text className="text-gray-600">Total Completions</Text>
            </View>
          </View>
        </View> */}

        <View className="h-2 bg-gray-100" />

        {/* App Settings */}
        <View className="p-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            App Preferences
          </Text>

          <View className="mb-4">
            <SettingsRow
              icon="notifications-outline"
              title="Enable Notifications"
              isSwitch={true}
              switchValue={notifications}
              onSwitchChange={setNotifications}
            />

            <SettingsRow
              icon="moon-outline"
              title="Dark Mode"
              isSwitch={true}
              switchValue={darkMode}
              onSwitchChange={setDarkMode}
            />

            <SettingsRow
              icon="calendar-outline"
              title="Week Starts on Monday"
              isSwitch={true}
              switchValue={weekStartsOnMonday}
              onSwitchChange={setWeekStartsOnMonday}
            />
          </View>
        </View>

        <View className="h-2 bg-gray-100" />

        {/* Account Settings */}
        <View className="p-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Account</Text>

          <View className="mb-4">
            <SettingsRow
              icon="lock-closed-outline"
              title="Change Password"
              onPress={() => router.push("/profile/change-password")}
            />
          </View>
        </View>

        <View className="h-2 bg-gray-100" />

        {/* Support & About */}
        <View className="p-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Support & About
          </Text>

          <View className="mb-4">
            <SettingsRow
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => router.push("/profile/support")}
            />

            <SettingsRow
              icon="information-circle-outline"
              title="About Momentum"
              onPress={() => router.push("/profile/about")}
            />

            <SettingsRow
              icon="shield-checkmark-outline"
              title="Privacy Policy"
              onPress={() => router.push("/profile/privacy-policy")}
            />
          </View>
        </View>

        {/* Logout Button */}
        <View className="p-6">
          <TouchableOpacity
            className="py-4 bg-gray-100 rounded-lg items-center"
            onPress={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <Text className="text-red-500 font-medium">Logout</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for settings rows
type SettingsRowProps = {
  icon: any;
  title: string;
  value?: string;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
};

function SettingsRow({
  icon,
  title,
  value,
  isSwitch = false,
  switchValue = false,
  onSwitchChange = () => {},
  onPress = () => {},
}: SettingsRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-3 border-b border-gray-100"
      onPress={!isSwitch ? onPress : undefined}
    >
      <View className="flex-row items-center">
        <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
          <Ionicons name={icon} size={18} color="#4a90e2" />
        </View>
        <Text className="text-gray-800 font-medium">{title}</Text>
      </View>

      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#e2e8f0", true: "#4a90e2" }}
        />
      ) : (
        <View className="flex-row items-center">
          {value && <Text className="text-gray-500 mr-2">{value}</Text>}
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </View>
      )}
    </TouchableOpacity>
  );
}
