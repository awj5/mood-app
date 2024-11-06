import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import Range from "components/date-filters/Range";
import Shortcuts from "components/date-filters/Shortcuts";
import { theme, pressedDefault } from "utils/helpers";

export default function DateFilters() {
  const colors = theme();
  const router = useRouter();

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: "",
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text style={[styles.headerText, { fontSize: Device.deviceType !== 1 ? 24 : 18, color: colors.primary }]}>
                Done
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={[{ padding: Device.deviceType !== 1 ? 24 : 16, gap: Device.deviceType !== 1 ? 48 : 32 }]}>
        <Range />
        <Shortcuts />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "Circular-Book",
  },
});
