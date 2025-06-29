import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface AuthLinkProps {
  question: string;
  linkText: string;
  route: string;
  marginTop?: number;
}

export default function AuthLink({
  question,
  linkText,
  route,
  marginTop = 8,
}: AuthLinkProps) {
  return (
    <View className={`flex-row justify-center mt-${marginTop}`}>
      <Text className="text-gray-600">{question} </Text>
      <TouchableOpacity onPress={() => router.push(route)}>
        <Text className="text-blue-600 font-semibold">{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}
