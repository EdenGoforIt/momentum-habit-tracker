import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SupportScreen() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage("");
      Alert.alert(
        "Message Sent",
        "Thank you for your feedback! Our team will review your message.",
        [{ text: "OK" }]
      );
    }, 1000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Help & Support" }} />

      <ScrollView className="flex-1 p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          How can we help you?
        </Text>

        {/* FAQ Section */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </Text>

          <FaqItem
            question="How do I create a new habit?"
            answer="To create a new habit, go to the home screen and tap the + button in the bottom right corner. Fill out the habit details and save."
          />

          <FaqItem
            question="What is a streak?"
            answer="A streak represents the number of consecutive days you've completed a habit. Missing a day will reset your streak to zero."
          />

          <FaqItem
            question="How do I change my password?"
            answer="Go to Profile → Account → Change Password to update your password."
          />

          <FaqItem
            question="Can I export my data?"
            answer="Currently, data export is not available, but we're working on adding this feature in a future update."
          />
        </View>

        {/* Contact Form */}
        <View>
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Contact Us
          </Text>
          <Text className="text-gray-600 mb-4">
            Can't find what you're looking for? Send us a message and we'll get
            back to you.
          </Text>

          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Your Message</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 min-h-[120px] text-gray-800 bg-gray-50"
              multiline
              placeholder="Describe your issue or question..."
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <TouchableOpacity
            className={`rounded-lg py-3 ${
              isLoading ? "bg-blue-400" : "bg-blue-500"
            }`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium text-center">Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="border-b border-gray-100 py-3">
      <TouchableOpacity
        className="flex-row justify-between items-center"
        onPress={() => setExpanded(!expanded)}
      >
        <Text className="text-gray-800 font-medium flex-1">{question}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#4a90e2"
        />
      </TouchableOpacity>

      {expanded && <Text className="text-gray-600 mt-2">{answer}</Text>}
    </View>
  );
}
