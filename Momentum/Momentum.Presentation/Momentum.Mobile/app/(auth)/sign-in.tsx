import { useGetUser } from "@/api";
import { useLogin } from "@/api/auth";
import AuthLink from "@/components/AuthLink";
import { Button, Input } from "@/components/common";
import { AUTH_VALIDATION_SCHEMAS } from "@/constants";
import images from "@/constants/images";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useAuth } from "@/lib/auth";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { errors, validateAll, validateField } = useFormValidation(
    AUTH_VALIDATION_SCHEMAS.signIn
  );
  const { signIn, setUser } = useAuth();
  const { mutateAsync: loginMutateAsync } = useLogin();
  const { refetch: refetchUser } = useGetUser({
    variables: { email },
    enabled: false,
  });

  const handleSignIn = async () => {
    const isValid = validateAll({ email, password });
    if (!isValid) return;

    setIsLoading(true);
    try {
      const loginData = await loginMutateAsync({ email, password });

      // Store token in Zustand
      signIn({
        accessToken: loginData.accessToken,
        expiresIn: loginData.expiresIn,
        refreshToken: loginData.refreshToken,
      });

      // Fetch user data using API pattern
      const userResult = await refetchUser();
      const userData = userResult.data;

      // Store user in Zustand
      if (userData) {
        setUser(userData);
      }

      // Navigate to home
      router.replace("/home");
    } catch (error: any) {
      console.error("Sign-in error:", error);
      Alert.alert(
        "Sign In Failed",
        error?.response?.data?.message ||
          "Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
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
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateField("email", email)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              required
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              onBlur={() => validateField("password", password)}
              error={errors.password}
              secureTextEntry
              editable={!isLoading}
              required
            />
          </View>

          <Button
            title="Sign In"
            onPress={handleSignIn}
            loading={isLoading}
            loadingText="Signing in..."
            className="mb-4"
          />

          <AuthLink
            question="Don't have an account?"
            linkText="Register"
            route="./sign-up"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
