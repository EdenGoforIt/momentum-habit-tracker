import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Privacy Policy" }} />

      <ScrollView className="flex-1 p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Privacy Policy
        </Text>

        <PolicySection
          title="Information We Collect"
          content="We collect information you provide directly to us, such as when you create an account, update your profile, use interactive features, or contact support. This includes your name, email address, and any other information you choose to provide."
        />

        <PolicySection
          title="How We Use Your Information"
          content="We use the information we collect to provide, maintain, and improve our services, such as to process and complete transactions, send you related information, and communicate with you."
        />

        <PolicySection
          title="Data Storage"
          content="We store your habit data securely in our database. Your personal information is protected using industry-standard encryption and security practices."
        />

        <PolicySection
          title="Your Rights"
          content="You can access and update your personal information at any time through your profile settings. You may also request deletion of your account and associated data."
        />

        <PolicySection
          title="Changes to This Policy"
          content="We may modify this Privacy Policy from time to time. If we make material changes to how we treat our users' personal information, we will notify you through a notice on this screen."
        />

        <Text className="text-gray-500 mt-6 text-center">
          Last Updated: May 6, 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function PolicySection({ title, content }: { title: string; content: string }) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-2">{title}</Text>
      <Text className="text-gray-600 leading-6">{content}</Text>
    </View>
  );
}
