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

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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
    } else if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must have at least one uppercase letter");
      return false;
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
      setPasswordError(
        "Password must have at least one non-alphanumeric character"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignUp = async () => {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isPasswordValid
    ) {
      setIsLoading(true);

      try {
        const url = process.env.EXPO_PUBLIC_API_URL;

        const response = await fetch(`${url}auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
          }),
        });

        const data = await response.json();
        console.log("Response data:", JSON.stringify(data));

        if (response.ok || response.status === 200) {
          Alert.alert(
            "Registration Successful",
            "Your account has been created successfully! Please sign in.",
            [{ text: "Continue", onPress: () => router.replace("/sign-in") }]
          );
          return;
        }

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
      } catch (error) {
        console.error("Registration error:", error);
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
          <View className="mb-2 items-center">
            <Image
              source={images.logoOnly}
              className="w-full h-[200px]"
              resizeMode="contain"
            />
            <Text className="text-xl text-center text-gray-700">
              Create an account
            </Text>
          </View>

          <View className="space-y-3 mb-6">
            {/* First Name Field */}
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

            {/* Last Name Field */}
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
              ) : (
                <Text className="text-gray-500 mt-1 text-xs">
                  Password must be at least 6 characters with at least one
                  uppercase letter (A-Z) and one special character (!@#$%^&*,
                  etc).
                </Text>
              )}
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
