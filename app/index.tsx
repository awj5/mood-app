import { View, StyleSheet, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import * as Device from "expo-device";
import BigButton from "components/BigButton";

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { padding: Device.deviceType !== 1 ? 24 : 16 }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <BigButton text="Check-in" route="check-in" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
