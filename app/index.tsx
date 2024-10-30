import { View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Stack } from "expo-router";
import * as Device from "expo-device";
import { Settings } from "lucide-react-native";
import BigButton from "components/BigButton";
import Calendar from "components/home/Calendar";
import { pressedDefault, theme } from "utils/helpers";

export default function Home() {
  const colors = theme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { padding: Device.deviceType !== 1 ? 24 : 16 }]}>
        <Stack.Screen
          options={{
            headerTitle: "",
            headerRight: () => (
              <Pressable onPress={() => null} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
                <Settings
                  color={colors.primary}
                  size={Device.deviceType !== 1 ? 40 : 32}
                  absoluteStrokeWidth
                  strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
                />
              </Pressable>
            ),
          }}
        />

        <Calendar />
        <BigButton text="Check-in" route="check-in" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
