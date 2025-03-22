import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Link href="/sign-in">SignIn</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/habit/1">Habit</Link>
      <Link href="/sign-in">SignIn</Link>
      <Text className="font-bold text-lg my-3 bg-red-500  border-white py-2">
        Edit app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
