import { useGetUser, UserDto } from "@/api";
import { useLogin } from "@/api/auth";
import AuthLink from "@/components/AuthLink";
import images from "@/constants/images";
import { useAuth } from "@/lib/auth";
import { showErrorAlert } from "@/utils/errorHandler";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const { signIn, setUser } = useAuth();

  // Simplified login mutation
  const { isPending: isLoginPending, mutateAsync: loginMutateAsync } =
    useLogin();

  // Get user query - disabled by default
  const { refetch: refetchUser } = useGetUser({
    variables: { email },
    enabled: false,
  });

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
    // Validate inputs first
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) return;

    try {
      // Step 1: Login and get tokens
      const loginData = await loginMutateAsync({ email, password });

      // Step 2: Store authentication tokens immediately
      signIn({
        accessToken: loginData.accessToken,
        expiresIn: loginData.expiresIn,
        refreshToken: loginData.refreshToken,
      });

      // Step 3: Fetch and store user profile
      setIsLoadingProfile(true);
      const userResult = await refetchUser();

      if (userResult.data) {
        setUser(userResult.data as UserDto);
        console.log("User profile fetched:", userResult.data);
      } else {
        console.warn("User fetch succeeded but no data returned");
      }

      // Step 4: Navigate to home
      router.replace("/home");
    } catch (error) {
      console.error("Authentication error:", error);
      showErrorAlert(error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const isLoading = isLoginPending || isLoadingProfile;

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
                editable={!isLoading}
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
                editable={!isLoading}
              />
              {passwordError ? (
                <Text className="text-red-500 mt-1">{passwordError}</Text>
              ) : null}
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className={`rounded-lg py-4 ${
              isLoading ? "bg-blue-400" : "bg-blue-600"
            }`}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator color="white" />
                <Text className="text-white ml-2">
                  {isLoginPending ? "Signing in..." : "Loading profile..."}
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-center">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <AuthLink
            question="Don't have an account?"
            linkText="Register"
            route="sign-up"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
