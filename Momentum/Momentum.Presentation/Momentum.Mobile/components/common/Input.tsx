import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  required = false,
  containerClassName = "",
  labelClassName = "text-gray-700 mb-2 font-medium",
  inputClassName = "",
  errorClassName = "text-red-500 mt-1",
  ...textInputProps
}) => {
  const baseInputClass = `border rounded-lg px-4 py-3 text-gray-800 bg-gray-50 ${
    error ? "border-red-500" : "border-gray-300"
  }`;

  return (
    <View className={containerClassName}>
      {label && (
        <Text className={labelClassName}>
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      )}
      <TextInput
        className={`${baseInputClass} ${inputClassName}`}
        {...textInputProps}
      />
      {error && <Text className={errorClassName}>{error}</Text>}
    </View>
  );
};
