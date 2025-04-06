import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Habit() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Habit {id}</Text>
    </View>
  );
}
