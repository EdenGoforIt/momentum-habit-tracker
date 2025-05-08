import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Form validation
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
        setFirstName(parsedData.firstName || "");
        setLastName(parsedData.lastName || "");
        setProfileImage(parsedData.profileImage || null);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      Alert.alert("Error", "Failed to load your profile information");
    } finally {
      setIsLoading(false);
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

    if (isFirstNameValid && isLastNameValid) {
      setIsSaving(true);

      try {
        // In a production app, we would upload the image to a server here
        // and send the user data to the API
        const url = process.env.EXPO_PUBLIC_API_URL;
        const accessToken = await AsyncStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("No access token found");
        }

        // First, handle profile image if it's changed
        let profileImageUrl = profileImage;
        if (profileImage && profileImage !== userData?.profileImage) {
          // In a real app, you would upload the image to your server here
          // and get back a URL. For now, we'll just use the local URI
          profileImageUrl = profileImage;
        }

        // Then update user profile
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

        // For demo, we'll simulate a successful update by updating AsyncStorage
        // In a real app, you would parse the response from your API
        const updatedUserData = {
          ...userData,
          firstName,
          lastName,
          profileImage: profileImageUrl,
        };

        await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));

        Alert.alert("Success", "Your profile has been updated successfully!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } catch (error) {
        console.error("Failed to update profile:", error);
        Alert.alert(
          "Error",
          "Failed to update your profile. Please try again."
        );
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
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
                        userData?.email?.charAt(0)?.toUpperCase() ||
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
              />
              {lastNameError ? (
                <Text className="text-red-500 mt-1">{lastNameError}</Text>
              ) : null}
            </View>

            {/* Email - Read only */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
                <Text className="text-gray-800">{userData?.email || ""}</Text>
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
