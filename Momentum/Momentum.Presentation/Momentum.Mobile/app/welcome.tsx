import images from "@/constants/images";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function welcome() {
  const router = useRouter();
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
            onPress={() => router.push("/sign-in")}
          >
            <Text className="text-lg font-rubik-medium text-black-300 text-center">
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white shadow-md shadow-zinc-300 rounded-full w-[80%] py-4 mt-5"
            onPress={() => router.push("/sign-up")}
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
