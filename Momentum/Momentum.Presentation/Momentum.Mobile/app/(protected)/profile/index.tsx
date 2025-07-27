import { Button } from "@/components/ui/button";
import Header from "@/components/ui/Header";
import { useAuth } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const userData = {
    username:
      user?.userName?.split("@")[0] ||
      "user",
    email: user?.email,
    displayName: user?.firstName || "User",
    givenName: user?.firstName || "",
    surname: user?.lastName || "",
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            // Navigation is handled by AuthProvider
          } catch (error) {
          }
        },
      },
    ]);
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Export your Site Visit records, CPD records, and Self-Reflection records?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => {
            // TODO: Implement data export functionality
            Alert.alert(
              "Export Started",
              "Your data export will be ready shortly. You will receive an email when complete."
            );
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    router.push("/(protected)/profile/contact");
  };

  const handleUpdateProfile = () => {
    router.push("/(protected)/profile/update");
  };

  const menuItems = [
    {
      title: "Update Profile",
      subtitle: "Update your profile details",
      icon: "👤",
      onPress: handleUpdateProfile,
    },
    {
      title: "Contact Support",
      subtitle: "Get help",
      icon: "💬",
      onPress: handleContactSupport,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header 
        title="Profile" 
        showMenu={false} 
        right={
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Close"
            className="p-2"
          >
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
        }
      />
      
      {/* Profile Info */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <View className="items-center">
          {/* Profile Avatar */}
          <View className="w-20 h-20 bg-green-600 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">
              {userData.displayName
                .split(" ")
                .map((name: string) => name[0])
                .join("")}
            </Text>
          </View>

          {/* User Info */}
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {userData.displayName}
          </Text>
          <Text className="text-gray-600 mb-1">{userData.email}</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Quick Settings */}
        <View className="bg-white mx-4 my-4 rounded-lg border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">
            Settings
          </Text>

          <View className="px-4 py-3 flex-row items-center justify-between">
            <View>
              <Text className="text-gray-900 font-medium">Notifications</Text>
              <Text className="text-sm text-gray-500">
                Receive app notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#d1d5db", true: "#059669" }}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white mx-4 my-4 rounded-lg border border-gray-200">
          <Text className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">
            Menu
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className={`px-4 py-3 border-b border-gray-100 ${
                index === menuItems.length - 1 ? "border-b-0" : ""
              }`}
            >
              <View className="flex-row items-center">
                {item.icon && <Text className="text-xl mr-3">{item.icon}</Text>}
                <View className="flex-1">
                  <Text className={`font-medium text-gray-900`}>{item.title}</Text>
                  {item.subtitle && (
                    <Text className="text-sm text-gray-500 mt-1">{item.subtitle}</Text>
                  )}
                </View>
                <Text className="text-gray-400">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View className="bg-white mx-4 mb-4 rounded-lg border border-gray-200 p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            About
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">App Version</Text>
              <Text className="text-gray-900">
                {Constants.expoConfig?.version ?? "N/A"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Build</Text>
              <Text className="text-gray-900">
                {Constants.expoConfig?.ios?.buildNumber ??
                  Constants.expoConfig?.android?.versionCode ??
                  "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <View className="mx-4 mb-6">
          <Button variant="danger" onPress={handleSignOut} title="Sign Out" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
