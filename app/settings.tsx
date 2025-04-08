import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Linking, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import { Mail } from "lucide-react-native";
import Name from "components/settings/Name";
import Reminder from "components/settings/Reminder";
import ReminderOverlay from "components/Reminder";
import Version from "components/settings/Version";
import HeaderTitle from "components/HeaderTitle";
import Company from "components/settings/Company";
import Pro from "components/settings/Pro";
import { theme, pressedDefault, getStoredVal } from "utils/helpers";

export default function Settings() {
  const colors = theme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reminderVisible, setReminderVisible] = useState(false);
  const [company, setCompany] = useState("");
  const [pro, setPro] = useState(false);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const dividerStyle = { backgroundColor: colors.secondaryBg, marginVertical: spacing };
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  const getCompany = async () => {
    const name = await getStoredVal("company-name");
    if (name) setCompany(name);
  };

  const getPro = async () => {
    const proID = await getStoredVal("pro-id");
    if (proID) setPro(true);
  };

  useEffect(() => {
    getCompany();
    getPro();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Back"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: fontSize }}
              tintColor={colors.link}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                const email = "support@mood.ai";
                const subject = "Support Request";
                const body = "Hi MOOD.ai team,\n\nI need help with...";
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
                color={colors.link}
                size={Device.deviceType !== 1 ? 28 : 20}
                absoluteStrokeWidth
                strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
              />

              <Text
                style={{
                  fontFamily: "Circular-Book",
                  fontSize: fontSize,
                  color: colors.link,
                }}
                allowFontScaling={false}
              >
                Support
              </Text>
            </Pressable>
          ),
        }}
      />

      <HeaderTitle text="Settings" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: spacing,
          paddingTop: spacing * 1.5,
          paddingBottom: insets.bottom + spacing,
        }}
      >
        <Name />
        <View style={[styles.divider, dividerStyle]} />
        <Reminder reminderVisible={reminderVisible} setReminderVisible={setReminderVisible} />
        <View style={[styles.divider, dividerStyle]} />

        {company && (
          <>
            <Company company={company} setCompany={setCompany} />
            <View style={[styles.divider, dividerStyle]} />
          </>
        )}

        {(!company || (company && pro)) && (
          <>
            <Pro />
            <View style={[styles.divider, dividerStyle]} />
          </>
        )}

        <Version />
        <View style={[styles.divider, dividerStyle]} />
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
