import { View, StyleSheet, Pressable, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import { pressedDefault, theme } from "utils/helpers";

export default function Home() {
  const router = useRouter();
  const colors = theme();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable
        onPress={() => router.push("check-in")}
        style={({ pressed }) => [pressedDefault(pressed), styles.button, { backgroundColor: colors.secondary }]}
        hitSlop={8}
      >
        <Text style={styles.text}>Check-in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: "Circular-Book",
    color: "white",
    fontSize: 18,
  },
});
