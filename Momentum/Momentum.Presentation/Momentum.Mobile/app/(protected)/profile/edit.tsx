import { useAuth } from "@/lib/auth";
import { showErrorAlert } from "@/utils/errorHandler";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const { user, token, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Form validation
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = () => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  };

  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      return false;
    }
    setFirstNameError("");
    return true;
  };

  const validateLastName = () => {
    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      return false;
    }
    setLastNameError("");
    return true;
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to change your profile picture."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const handleSave = async () => {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();

    if (!isFirstNameValid || !isLastNameValid) return;

    setIsSaving(true);

    try {
      const url = process.env.EXPO_PUBLIC_API_URL;
      const accessToken = token?.accessToken;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Handle profile image upload if changed
      let profileImageUrl = profileImage;

      // Update user profile via API
      const response = await fetch(`${url}user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          profileImage: profileImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedUserData = await response.json();

      // Update Zustand store with new user data
      const newUserData = {
        ...user,
        firstName,
        lastName,
        profileImage: profileImageUrl,
        // Spread any additional data from API response
        ...updatedUserData,
      };

      setUser(newUserData);

      Alert.alert("Success", "Your profile has been updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      showErrorAlert(
        error,
        "Update Failed",
        "Failed to update your profile. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading only if we don't have user data yet
  if (!user && isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerTitle: "Edit Profile",
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
          {/* Profile Picture Section */}
          <View className="items-center mb-8">
            <TouchableOpacity className="relative" onPress={pickImage}>
              <View className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full bg-blue-500 items-center justify-center">
                    <Text className="text-white text-5xl font-bold">
                      {firstName?.charAt(0) ||
                        user?.email?.charAt(0)?.toUpperCase() ||
                        "?"}
                    </Text>
                  </View>
                )}
              </View>

              <View className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-2 border-white">
                <Ionicons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>

            <Text className="text-gray-500 mt-2">
              Tap to change profile picture
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-5">
            {/* First Name */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">First Name</Text>
              <TextInput
                className={`border ${
                  firstNameError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-800 bg-gray-50`}
                placeholder="Enter your first name"
                value={firstName}
                onChangeText={setFirstName}
                onBlur={validateFirstName}
                autoCapitalize="words"
                editable={!isSaving}
              />
              {firstNameError ? (
                <Text className="text-red-500 mt-1">{firstNameError}</Text>
              ) : null}
            </View>

            {/* Last Name */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Last Name</Text>
              <TextInput
                className={`border ${
                  lastNameError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-800 bg-gray-50`}
                placeholder="Enter your last name"
                value={lastName}
                onChangeText={setLastName}
                onBlur={validateLastName}
                autoCapitalize="words"
                editable={!isSaving}
              />
              {lastNameError ? (
                <Text className="text-red-500 mt-1">{lastNameError}</Text>
              ) : null}
            </View>

            {/* Email - Read only */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
                <Text className="text-gray-800">{user?.email || ""}</Text>
              </View>
              <Text className="text-gray-500 mt-1 text-xs">
                To change your email address, use the "Update Email" option in
                the Account section.
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <View className="mt-8 mb-6">
            <TouchableOpacity
              className={`rounded-lg py-4 ${
                isSaving ? "bg-blue-400" : "bg-blue-600"
              }`}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-center">
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
