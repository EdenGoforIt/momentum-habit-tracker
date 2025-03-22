import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/sign-in">SignIn</Link>
      <Link href="/explore">Explore</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/habit/1">Habit</Link>
      <Link href="/sign-in">SignIn</Link>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
