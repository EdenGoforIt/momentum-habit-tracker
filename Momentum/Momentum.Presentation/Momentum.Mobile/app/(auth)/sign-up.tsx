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
        // In real app, call your registration API
        // const response = await fetch('your-api-url/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email, password }),
        // });
        // const data = await response.json();

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Sample response data (replace with actual API response)
        const authToken = "sample-auth-token";
        const userData = {
          id: "123",
          email: email,
          name: email.split("@")[0],
        };

        // Store authentication token/user data
        await AsyncStorage.setItem("userToken", authToken);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        await AsyncStorage.setItem("isLoggedIn", "true");

        // Save authentication state using our context
        await login(authToken, userData);

        // Navigate to main app screen
        router.replace("/home");
      } catch (error) {
        Alert.alert(
          "Registration Failed",
          "Unable to create account. Please try again."
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
              source={images.logo}
              className="w-full h-50"
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
