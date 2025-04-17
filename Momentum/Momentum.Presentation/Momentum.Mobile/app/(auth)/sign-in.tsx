import images from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignIn = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);

      try {
        const url = process.env.EXPO_PUBLIC_API_URL;

        const response = await fetch(`${url}auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Response data:", JSON.stringify(data));

        if (!response.ok) {
          // Handle error responses based on status code
          if (response.status === 401) {
            Alert.alert(
              "Authentication Failed",
              "Invalid email or password. Please try again."
            );
          } else {
            Alert.alert(
              "Sign In Failed",
              data.title || "Something went wrong. Please try again later."
            );
          }
          return;
        }

        // Extract token data from response
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;
        const tokenType = data.tokenType;
        const expiresIn = data.expiresIn;

        if (!accessToken) {
          throw new Error("No access token received");
        }

        // For now, create basic user data from email
        // In a real app, you'd likely make another API call to get user profile
        // or the login endpoint would return user data
        const userData = {
          id: "user-id", // Replace with actual user ID if available from response
          email: email,
          name: email.split("@")[0],
        };

        // Store authentication token/user data
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("tokenType", tokenType);
        await AsyncStorage.setItem(
          "tokenExpires",
          (Date.now() + expiresIn * 1000).toString()
        );
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        // Save authentication state using our context
        await login(accessToken, userData);

        // Navigate to main app screen
        router.replace("/home");
      } catch (error) {
        console.error("Sign in error:", error);
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
    <SafeAreaView className="bg-white h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-8 items-center">
            <Image
              source={images.logoOnly}
              className="w-full h-46"
              resizeMode="contain"
            />
            <Text className="text-xl text-center text-gray-700">
              Welcome back!
            </Text>
          </View>

          <View className="space-y-4 mb-6">
            {/* Email Field */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className={`border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-800 bg-gray-50`}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                onBlur={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? (
                <Text className="text-red-500 mt-1">{emailError}</Text>
              ) : null}
            </View>

            {/* Password Field */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <TextInput
                className={`border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 text-gray-800 bg-gray-50`}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                onBlur={validatePassword}
                secureTextEntry
              />
              {passwordError ? (
                <Text className="text-red-500 mt-1">{passwordError}</Text>
              ) : null}
            </View>
          </View>

          {/* Forgot Password Link - Commented out for now 
          <TouchableOpacity
            className="self-end mb-6"
            onPress={() => router.push("/forgot-password")}
          >
            <Text className="text-blue-600">Forgot Password?</Text>
          </TouchableOpacity>
          */}

          {/* Sign In Button */}
          <TouchableOpacity
            className={`rounded-lg py-4 ${
              isLoading ? "bg-blue-400" : "bg-blue-600"
            }`}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-center">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-up")}>
              <Text className="text-blue-600 font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
