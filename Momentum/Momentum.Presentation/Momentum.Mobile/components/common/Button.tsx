import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  loadingText = "Loading...",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return loading || disabled ? "bg-blue-400" : "bg-blue-600";
      case "secondary":
        return loading || disabled ? "bg-gray-400" : "bg-gray-600";
      case "outline":
        return "bg-transparent border border-blue-600";
      default:
        return "bg-blue-600";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "py-2 px-4";
      case "md":
        return "py-4 px-6";
      case "lg":
        return "py-5 px-8";
      default:
        return "py-4 px-6";
    }
  };

  const getTextColor = () => {
    return variant === "outline" ? "text-blue-600" : "text-white";
  };

  return (
    <TouchableOpacity
      className={`rounded-lg ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <View className="flex-row justify-center items-center">
          <ActivityIndicator
            color={variant === "outline" ? "#2563eb" : "white"}
          />
          <Text className={`${getTextColor()} ml-2 font-medium`}>
            {loadingText}
          </Text>
        </View>
      ) : (
        <Text className={`${getTextColor()} font-bold text-center`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
