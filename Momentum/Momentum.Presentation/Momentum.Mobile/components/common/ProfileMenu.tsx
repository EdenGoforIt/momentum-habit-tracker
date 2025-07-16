import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface MenuItem {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

interface ProfileMenuProps {
  items: MenuItem[];
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ items }) => {
  return (
    <View className="bg-white mx-4 my-4 rounded-lg border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900 p-4 border-b border-gray-100">
        Menu
      </Text>
      
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={item.onPress}
          className={`px-4 py-3 border-b border-gray-100 ${
            index === items.length - 1 ? 'border-b-0' : ''
          }`}
        >
          <View className="flex-row items-center">
            {item.icon && (
              <Text className="text-xl mr-3">{item.icon}</Text>
            )}
            <View className="flex-1">
              <Text
                className={`font-medium ${
                  item.isDestructive ? 'text-red-600' : 'text-gray-900'
                }`}
              >
                {item.title}
              </Text>
              {item.subtitle && (
                <Text className="text-sm text-gray-500 mt-1">
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Text className="text-gray-400">›</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}; 