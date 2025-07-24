import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text } from "react-native";

interface TabItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  label: string;
}

const tabs: TabItem[] = [
  {
    name: "home",
    icon: "home",
    route: "/home",
    label: "Home",
  },
  {
    name: "calendar",
    icon: "calendar",
    route: "/(protected)/habit/calendar",
    label: "Calendar",
  },
  {
    name: "stats",
    icon: "stats-chart",
    route: "/(protected)/habit/stats",
    label: "Stats",
  },
  {
    name: "history",
    icon: "time",
    route: "/(protected)/habit/history",
    label: "History",
  },
];

export default function TabNavigation() {
  const pathname = usePathname();

  const isActiveTab = (route: string) => {
    if (route === "/home" && (pathname === "/home" || pathname === "/")) {
      return true;
    }
    return pathname.includes(route.split('/').pop() || '');
  };

  return (
    <View className="flex-row bg-white border-t border-gray-200 px-2 py-1 safe-area-bottom">
      {tabs.map((tab) => {
        const isActive = isActiveTab(tab.route);
        
        return (
          <TouchableOpacity
            key={tab.name}
            className="flex-1 items-center py-2"
            onPress={() => router.push(tab.route as any)}
          >
            <Ionicons
              name={isActive ? tab.icon : `${tab.icon}-outline` as any}
              size={24}
              color={isActive ? "#4a90e2" : "#666"}
            />
            <Text
              className={`text-xs mt-1 ${
                isActive ? "text-blue-500 font-medium" : "text-gray-600"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}