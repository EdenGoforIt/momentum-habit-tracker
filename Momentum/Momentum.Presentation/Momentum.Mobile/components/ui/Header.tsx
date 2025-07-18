import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
interface HeaderProps {
  title: string;
  showMenu?: boolean;
  showClose?: boolean;
  showBack?: boolean;
  right?: React.ReactNode;
  onMenuPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showMenu = true,
  showBack = false,
  right,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.back();
    }
  };

  const handleMenuPress = () => {
    router.push("/(protected)/profile");
  };

  const renderRightContent = () => {
    if (right) {
      return right;
    }

    return (
      <View className="flex-row items-center  ">
        {showMenu && (
          <TouchableOpacity
            onPress={handleMenuPress}
            accessibilityLabel="Menu"
            className="color-black-100"
          >
            <Ionicons name="menu" size={24} color={"#000"} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        {/* Left: Back button */}
        <View className="w-10">
          {showBack && (
            <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={28} color="green" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center: Title */}
        <View className="flex-1 items-center">
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        </View>

        {/* Right: Menu or right content */}
        <View className="w-10 items-end">{renderRightContent()}</View>
      </View>
    </View>
  );
};

export default Header;
