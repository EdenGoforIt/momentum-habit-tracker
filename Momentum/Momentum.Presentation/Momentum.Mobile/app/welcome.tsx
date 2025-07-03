import { ROUTENAMES } from "@/constants";
import { AUTH_STATUS } from "@/constants/auth";
import images from "@/constants/images";
import { useAuth } from "@/lib";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function welcome() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (status === AUTH_STATUS.SIGNED_IN) {
      router.replace(ROUTENAMES.HOME);
    }
  }, [status, router]);

  // Show loading or nothing while checking auth status
  if (status === AUTH_STATUS.IDLE) {
    return null; // or a loading spinner
  }

  // If user is signed in, don't show welcome screen (redirect is happening)
  if (status === AUTH_STATUS.SIGNED_IN) {
    return null;
  }
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.signIn}
          className="w-full h-3/5"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="text-base text-center uppercase font-rubik text-black-200">
            Welcome to Momentum
          </Text>
          <Text className="text-2xl font-rubik-bold text-black-300 text-center mt-2">
            Discover Yourself{"\n"}
            <Text className="text-primary-300">By Tracking Your Habit</Text>
          </Text>
        </View>
        <View className="flex flex-col justify-center items-center w-full">
          <TouchableOpacity
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-[80%] py-4 mt-5"
            onPress={() => router.push(ROUTENAMES.SIGN_IN)}
          >
            <Text className="text-lg font-rubik-medium text-black-300 text-center">
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-[80%] py-4 mt-5"
            onPress={() => router.push(ROUTENAMES.SIGN_UP)}
          >
            <Text className="text-lg font-rubik-medium text-black-300 text-center">
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
