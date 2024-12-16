import { Pressable, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import Range from "components/date-filters/Range";
import Shortcuts from "components/date-filters/Shortcuts";
import HeaderTitle from "components/HeaderTitle";
import { theme, pressedDefault } from "utils/helpers";

export default function DateFilters() {
  const colors = theme();
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text
                style={{
                  fontFamily: "Circular-Book",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                  color: colors.primary,
                }}
                allowFontScaling={false}
              >
                Done
              </Text>
            </Pressable>
          ),
        }}
      />

      <HeaderTitle
        text="History"
        description="Explore your mood check-in history by selecting a specific date range or tapping a shortcut."
      />

      <View
        style={[
          {
            paddingHorizontal: Device.deviceType !== 1 ? 24 : 16,
            paddingTop: Device.deviceType !== 1 ? 36 : 24,
            gap: Device.deviceType !== 1 ? 48 : 32,
          },
        ]}
      >
        <Range />
        <Shortcuts />
      </View>
    </View>
  );
}
