import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useUpdateUser } from "@/api/users/use-users";
import { signOut, useAuth } from "@/lib/auth";

export default function UpdateProfile() {
  const { user, setUser } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateUserMutation = useUpdateUser();

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [user]);

  const handleSave = async () => {
    // Validate inputs
    if (!firstName.trim()) {
      Alert.alert("Error", "First name is required");
      return;
    }

    if (!lastName.trim()) {
      Alert.alert("Error", "Last name is required");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not found in session");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Updating user with ID:", user.id);
      console.log("Current user object:", user);
      
      const updatedUser = await updateUserMutation.mutateAsync({
        id: user.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      console.log("Update successful:", updatedUser);

      // Update the user in the auth store
      setUser(updatedUser);

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.push("/(protected)/profile") },
      ]);
    } catch (error: any) {
      console.error("Update error:", error);
      console.error("Error response:", error?.response?.data);
      
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data?.title ||
                          "Failed to update profile. Please try again.";
      
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    return (
      firstName.trim() !== (user?.firstName || "") ||
      lastName.trim() !== (user?.lastName || "")
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white px-4 py-4 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Edit Profile</Text>
            <View className="w-6" />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-6">
          {/* Profile Icon */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center">
              <Text className="text-white text-3xl font-bold">
                {firstName.charAt(0).toUpperCase() || user?.firstName?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text className="text-gray-600 mt-2">{user?.email}</Text>
            {/* Debug info - remove this in production */}
            <Text className="text-xs text-gray-400 mt-1">ID: {user?.id}</Text>
          </View>

          {/* Form Fields */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            {/* First Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                First Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            {/* Last Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Last Name <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-base"
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            {/* Email (Read-only) */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                <Text className="text-base text-gray-600">{user?.email}</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </Text>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 rounded-lg p-4 mt-6 flex-row">
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <View className="flex-1 ml-2">
              <Text className="text-sm text-blue-800">
                Only your first name and last name can be updated. For other changes, please contact support.
              </Text>
            </View>
          </View>

          {/* Error Notice for Invalid User */}
          {user?.id === "74ea04cf-51c1-475a-bafc-d6c7c252ca2b" && (
            <View className="bg-red-50 rounded-lg p-4 mt-4 flex-row">
              <Ionicons name="warning" size={20} color="#dc2626" />
              <View className="flex-1 ml-2">
                <Text className="text-sm font-medium text-red-800 mb-1">
                  Account Issue Detected
                </Text>
                <Text className="text-sm text-red-700">
                  Your account data is out of sync. Please sign out and sign back in to refresh your session.
                </Text>
                <TouchableOpacity
                  className="mt-2 bg-red-600 px-3 py-2 rounded"
                  onPress={() => {
                    Alert.alert(
                      "Sign Out Required",
                      "Your account needs to be refreshed. Would you like to sign out now?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Sign Out",
                          style: "destructive",
                          onPress: async () => {
                            try {
                              await signOut();
                            } catch (error) {
                              console.error("Sign out error:", error);
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Text className="text-white text-sm font-medium">Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Buttons */}
        <View className="bg-white px-4 py-4 border-t border-gray-200">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 bg-gray-200 py-3 rounded-lg items-center mr-2"
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text className="font-medium text-gray-800">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-lg items-center ${
                hasChanges() && !isLoading && user?.id !== "74ea04cf-51c1-475a-bafc-d6c7c252ca2b"
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }`}
              onPress={handleSave}
              disabled={!hasChanges() || isLoading || user?.id === "74ea04cf-51c1-475a-bafc-d6c7c252ca2b"}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-medium text-white">Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}