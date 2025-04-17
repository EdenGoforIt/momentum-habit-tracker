import { logAllStorage } from "@/utils/storageUtils";
import { useEffect } from "react";
import { SafeAreaView, ScrollView, Text } from "react-native";

export default function home() {
  useEffect(() => {
    logAllStorage();
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="h-full">
        <Text>Home</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
