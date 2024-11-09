import { Pressable, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import Range from "components/date-filters/Range";
import Shortcuts from "components/date-filters/Shortcuts";
import { theme, pressedDefault } from "utils/helpers";

export default function DateFilters() {
  const colors = theme();
  const router = useRouter();
  const textSize = Device.deviceType !== 1 ? 20 : 16;

  return (
    <View style={[{ padding: Device.deviceType !== 1 ? 24 : 16, gap: Device.deviceType !== 1 ? 48 : 32 }]}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text style={[styles.text, { fontSize: textSize, color: colors.primary }]} allowFontScaling={false}>
                Done
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={{ gap: Device.deviceType !== 1 ? 8 : 4 }}>
        <Text
          style={[styles.title, { fontSize: Device.deviceType !== 1 ? 48 : 36, color: colors.primary }]}
          allowFontScaling={false}
        >
          History
        </Text>

        <Text style={[styles.text, { color: colors.secondary, fontSize: textSize }]} allowFontScaling={false}>
          Explore your mood check-in history by selecting a specific date range or tapping a shortcut.
        </Text>
      </View>

      <Range />
      <Shortcuts />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "Circular-Bold",
  },
  text: {
    fontFamily: "Circular-Book",
  },
});
