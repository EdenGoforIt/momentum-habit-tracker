import images from "@/constants/images";
import React from "react";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function signIn() {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.signIn}
          className="w-full h-4/6"
          resizeMode="contain"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
