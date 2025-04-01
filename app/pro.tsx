import { Pressable, Text, View, Platform, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { HeaderBackButton } from "@react-navigation/elements";
import { Sparkles } from "lucide-react-native";
import IAP from "components/pro/IAP";
import { theme, pressedDefault } from "utils/helpers";

export default function Pro() {
  const colors = theme();
  const router = useRouter();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerLeft:
            Platform.OS === "android"
              ? () => (
                  <HeaderBackButton
                    onPress={() => router.back()}
                    label="Back"
                    labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
                    tintColor={colors.primary}
                    allowFontScaling={false}
                    style={{ marginLeft: -8 }}
                  />
                )
              : () => (
                  <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => pressedDefault(pressed)}
                    hitSlop={16}
                  >
                    <Text
                      style={{
                        fontFamily: "Circular-Book",
                        fontSize: Device.deviceType !== 1 ? 20 : 16,
                        color: colors.primary,
                      }}
                      allowFontScaling={false}
                    >
                      Close
                    </Text>
                  </Pressable>
                ),
          headerRight:
            Platform.OS === "ios"
              ? () => (
                  <Pressable onPress={() => null} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
                    <Text
                      style={{
                        fontFamily: "Circular-Book",
                        fontSize: Device.deviceType !== 1 ? 20 : 16,
                        color: colors.primary,
                      }}
                      allowFontScaling={false}
                    >
                      Restore
                    </Text>
                  </Pressable>
                )
              : () => null,
        }}
      />
      <ScrollView contentContainerStyle={{ padding: spacing, gap: spacing }}>
        <View style={{ alignItems: "center", gap: spacing / 2 }}>
          <Sparkles
            color={colors.primary}
            size={Device.deviceType !== 1 ? 88 : 64}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 5.5 : 4}
          />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              fontSize: Device.deviceType !== 1 ? 48 : 36,
              color: colors.primary,
            }}
            allowFontScaling={false}
          >
            MOOD.ai Pro
          </Text>
        </View>
      </ScrollView>

      <IAP />
    </View>
  );
}
