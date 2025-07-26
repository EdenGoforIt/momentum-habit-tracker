import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/lib/auth";

export default function ContactSupport() {
  const { user } = useAuth();

  const handleEmailSupport = async () => {
    const email = "support@momentum.com";
    const subject = "Support Request - Momentum App";
    const body = `Hi Momentum Support Team,

I need assistance with the following:

[Please describe your issue here]

App Details:
- User: ${user?.firstName} ${user?.lastName}
- Email: ${user?.email}
- User ID: ${user?.id}

Thank you for your help!

Best regards,
${user?.firstName || "User"}`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
      } else {
        // Fallback: copy email to clipboard and show alert
        Alert.alert(
          "Email App Not Available",
          `Please send your support request to:\n\n${email}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        `Unable to open email app. Please contact us at: ${email}`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            Contact Support
          </Text>
          <View className="w-6" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Header Section */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 rounded-full bg-blue-500 items-center justify-center mb-4">
            <Ionicons name="mail" size={32} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            We're Here to Help
          </Text>
          <Text className="text-gray-600 text-center leading-6">
            Have a question or need assistance? Our support team is ready to
            help you get the most out of Momentum.
          </Text>
        </View>

        {/* Quick Contact */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Get in Touch
          </Text>

          <TouchableOpacity
            className="flex-row items-center p-4 bg-blue-50 rounded-lg border border-blue-200"
            onPress={handleEmailSupport}
          >
            <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-4">
              <Ionicons name="mail" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-800">Email Support</Text>
              <Text className="text-blue-600 mt-1">support@momentum.com</Text>
              <Text className="text-sm text-gray-500 mt-1">
                Tap to compose email
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Response Time */}
        <View className="bg-green-50 rounded-lg p-4 mb-6 flex-row">
          <Ionicons name="time" size={20} color="#059669" />
          <View className="flex-1 ml-3">
            <Text className="font-medium text-green-800">Response Time</Text>
            <Text className="text-sm text-green-700 mt-1">
              We typically respond within 24 hours during business days.
            </Text>
          </View>
        </View>
        {/* Tips for Better Support */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Tips for Faster Support
          </Text>

          <View className="space-y-3">
            <View className="flex-row">
              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
              <Text className="flex-1 text-gray-700">
                Be specific about the issue you're experiencing
              </Text>
            </View>

            <View className="flex-row">
              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">2</Text>
              </View>
              <Text className="flex-1 text-gray-700">
                Include steps to reproduce the problem if applicable
              </Text>
            </View>

            <View className="flex-row">
              <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3 mt-1">
                <Text className="text-white text-xs font-bold">3</Text>
              </View>
              <Text className="flex-1 text-gray-700">
                Mention your device type and app version
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
