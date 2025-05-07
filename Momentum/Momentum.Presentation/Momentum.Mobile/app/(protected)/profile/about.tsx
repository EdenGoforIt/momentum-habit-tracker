import images from "@/constants/images";
import { Stack } from "expo-router";
import React from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "About Momentum" }} />

      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-8">
          <Image
            source={images.logoOnly}
            className="w-28 h-28 mb-4"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-800">Momentum</Text>
          <Text className="text-gray-500">Version 1.0.0</Text>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Our Mission
          </Text>
          <Text className="text-gray-600 leading-6">
            Momentum aims to help you build consistent habits and achieve your
            goals through small, daily actions. We believe that consistent
            progress, no matter how small, leads to significant improvements
            over time.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-2">The Team</Text>
          <Text className="text-gray-600 leading-6">
            Momentum was created by a team of passionate developers at Massey
            University as part of a final project. Our team is dedicated to
            helping people build better habits and improve their productivity.
          </Text>
        </View>

        <View>
          <Text className="text-lg font-bold text-gray-800 mb-2">Contact</Text>
          <Text className="text-gray-600">
            For any questions or feedback, please email us at:
          </Text>
          <Text className="text-blue-500 mt-1">contact@momentumapp.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
