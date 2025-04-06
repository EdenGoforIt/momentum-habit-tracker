import { SafeAreaView, ScrollView, Text } from "react-native";

export default function home() {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Text>Home</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
