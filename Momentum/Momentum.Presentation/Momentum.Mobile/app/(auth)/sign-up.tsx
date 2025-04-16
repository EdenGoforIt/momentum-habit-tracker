import images from "@/constants/images";
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

export default function SignUp() {
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

  const handleSignUp = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);

      try {
        const url = process.env.EXPO_PUBLIC_API_URL;

        const response = await fetch(`${url}auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        // Get response data
        const data = await response.json();
        console.log("Response data:", JSON.stringify(data));

        if (!response.ok) {
          // Handle different error status codes
          if (response.status === 400 && data.errors) {
            // Extract validation errors
            const errorMessages: string[] = [];

            // Get all validation error messages from the response
            Object.keys(data.errors).forEach((key) => {
              errorMessages.push(...data.errors[key]);
            });

            // Display the errors to the user
            Alert.alert("Registration Failed", errorMessages.join("\n\n"), [
              { text: "OK" },
            ]);
          } else {
            // Handle other errors
            Alert.alert(
              "Registration Failed",
              data.title || "Unable to create account. Please try again."
            );
          }
          return;
        }

        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully! Please sign in.",
          [{ text: "Continue", onPress: () => router.replace("/sign-in") }]
        );
      } catch (error) {
        console.error("Registration error:", JSON.stringify(error));
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
              Create an account
            </Text>
          </View>

          <View className="space-y-3 mb-6">
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

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`rounded-lg py-4 ${
              isLoading ? "bg-blue-400" : "bg-blue-600"
            }`}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-center">Register</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
