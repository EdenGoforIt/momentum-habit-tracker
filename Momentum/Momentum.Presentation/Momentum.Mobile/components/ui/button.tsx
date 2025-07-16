import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "danger" | "primary" | "default";
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "default",
  disabled = false,
  loading = false,
}) => {
  let bgColor = "bg-gray-200";
  let textColor = "text-gray-800";
  if (variant === "danger") {
    bgColor = "bg-red-500";
    textColor = "text-white";
  } else if (variant === "primary") {
    bgColor = "bg-blue-500";
    textColor = "text-white";
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-4 rounded-lg items-center ${bgColor} ${disabled ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "danger" || variant === "primary" ? "#fff" : undefined} />
      ) : (
        <Text className={`font-medium ${textColor}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}; 