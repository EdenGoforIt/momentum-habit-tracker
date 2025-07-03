import { useAuth } from "@/lib";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
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

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateCurrentPassword = () => {
    if (!currentPassword) {
      setCurrentPasswordError("Current password is required");
      return false;
    }

    setCurrentPasswordError("");
    return true;
  };

  const validateNewPassword = () => {
    if (!newPassword) {
      setNewPasswordError("New password is required");
      return false;
    } else if (newPassword.length < 6) {
      setNewPasswordError("Password must be at least 6 characters");
      return false;
    } else if (!/[A-Z]/.test(newPassword)) {
      setNewPasswordError("Password must have at least one uppercase letter");
      return false;
    } else if (!/[^a-zA-Z0-9]/.test(newPassword)) {
      setNewPasswordError(
        "Password must have at least one non-alphanumeric character"
      );
      return false;
    } else if (newPassword === currentPassword) {
      setNewPasswordError(
        "New password must be different from current password"
      );
      return false;
    }

    setNewPasswordError("");
    return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Passwords don't match");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  const handleChangePassword = async () => {
    const isCurrentPasswordValid = validateCurrentPassword();
    const isNewPasswordValid = validateNewPassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (
      isCurrentPasswordValid &&
      isNewPasswordValid &&
      isConfirmPasswordValid
    ) {
      setIsLoading(true);

      try {
        const url = process.env.EXPO_PUBLIC_API_URL;
        const { token: accessToken } = useAuth();
        if (!accessToken) {
          throw new Error("No access token found");
        }

        const response = await fetch(`${url}user/change-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const data = await response.json();
        console.log("Response data:", JSON.stringify(data));

        if (response.ok) {
          Alert.alert(
            "Success",
            "Your password has been changed successfully!",
            [{ text: "OK", onPress: () => router.back() }]
          );
          return;
        }

        // Handle different error responses
        if (response.status === 400) {
          // Validation errors
          if (data.errors) {
            const errorMessages: string[] = [];
            Object.keys(data.errors).forEach((key) => {
              errorMessages.push(...data.errors[key]);
            });
            Alert.alert("Error", errorMessages.join("\n"));
          } else if (data.message) {
            Alert.alert("Error", data.message);
          } else {
            Alert.alert("Error", "Invalid password change request");
          }
        } else if (response.status === 401) {
          // Current password is incorrect
          setCurrentPasswordError("Current password is incorrect");
          Alert.alert("Error", "Your current password is incorrect");
        } else {
          // Other errors
          Alert.alert(
            "Error",
            data.message || "Failed to change password. Please try again later."
          );
        }
      } catch (error) {
        console.error("Password change error:", error);
        Alert.alert(
          "Connection Error",
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Change Password",
          headerBackTitle: "Back",
          headerTitleAlign: "center",
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-gray-600 mb-6">
            To change your password, please enter your current password and then
            create a new one.
          </Text>

          {/* Current Password */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">
              Current Password
            </Text>
            <View className="flex-row relative">
              <TextInput
                className={`border ${
                  currentPasswordError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-800 bg-gray-50 w-full`}
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                onBlur={validateCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {currentPasswordError ? (
              <Text className="text-red-500 mt-1">{currentPasswordError}</Text>
            ) : null}
          </View>

          {/* New Password */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">New Password</Text>
            <View className="flex-row relative">
              <TextInput
                className={`border ${
                  newPasswordError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-800 bg-gray-50 w-full`}
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                onBlur={validateNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {newPasswordError ? (
              <Text className="text-red-500 mt-1">{newPasswordError}</Text>
            ) : (
              <Text className="text-gray-500 mt-1 text-xs">
                Password must be at least 6 characters with at least one
                uppercase letter (A-Z) and one special character (!@#$%^&*,
                etc).
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">
              Confirm New Password
            </Text>
            <View className="flex-row relative">
              <TextInput
                className={`border ${
                  confirmPasswordError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-800 bg-gray-50 w-full`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={validateConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text className="text-red-500 mt-1">{confirmPasswordError}</Text>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`rounded-lg py-4 ${
              isLoading ? "bg-blue-400" : "bg-blue-600"
            }`}
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-center">
                Change Password
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
