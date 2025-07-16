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
      <View className="flex-row items-center">
        {showMenu && (
          <TouchableOpacity
            onPress={handleMenuPress}
            accessibilityLabel="Menu"
            className="me-1"
          >
            <Ionicons name="menu" size={32} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>
          )}
        </View>

        <Text className="text-lg font-semibold text-gray-800 absolute left-0 right-0 text-center">
          {title}
        </Text>

        <View className="flex-row items-center flex-1 justify-end">
          {renderRightContent()}
        </View>
      </View>
    </View>
  );
};

export default Header;
