import { useState } from "react";
import { Pressable, StyleSheet, Text, View, Linking, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import { Mail } from "lucide-react-native";
import Name from "components/settings/Name";
import Reminder from "components/settings/Reminder";
import ReminderOverlay from "components/Reminder";
import { theme, pressedDefault } from "utils/helpers";

export default function Settings() {
  const colors = theme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reminderVisible, setReminderVisible] = useState(false);
  const textSize = Device.deviceType !== 1 ? 24 : 18;
  const padding = Device.deviceType !== 1 ? 24 : 16;
  const dividerStyle = { backgroundColor: colors.secondaryBg, marginVertical: padding };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Back"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: textSize }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                const email = "support@mood.ai";
                const subject = "Support Request";
                const body = "Hi team,\n\nI need help with...";
                const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                  body
                )}`;

                Linking.openURL(emailUrl).catch((err) => console.error("Failed to open email URL:", err));
              }}
              style={({ pressed }) => [
                pressedDefault(pressed),
                styles.support,
                { gap: Device.deviceType !== 1 ? 12 : 8 },
              ]}
              hitSlop={16}
            >
              <Mail
                color={colors.primary}
                size={Device.deviceType !== 1 ? 32 : 24}
                absoluteStrokeWidth
                strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
              />

              <Text
                style={{ fontFamily: "Circular-Book", fontSize: textSize, color: colors.primary }}
                allowFontScaling={false}
              >
                Support
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={{ paddingHorizontal: padding, paddingVertical: padding / 2 }}>
        <Text
          style={{ fontFamily: "Circular-Bold", fontSize: Device.deviceType !== 1 ? 48 : 36, color: colors.primary }}
          allowFontScaling={false}
        >
          Settings
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: padding,
          paddingTop: padding / 2,
          paddingBottom: insets.bottom + padding,
        }}
      >
        <Name />
        <View style={[styles.divider, dividerStyle]} />
        <Reminder reminderVisible={reminderVisible} setReminderVisible={setReminderVisible} />
      </ScrollView>

      <ReminderOverlay visible={reminderVisible} setVisible={setReminderVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  support: {
    flexDirection: "row",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
  },
});
