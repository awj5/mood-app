import { useEffect, useState } from "react";
import { View, ScrollView, useColorScheme, Pressable, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import Name from "components/settings/Name";
import Reminder from "components/settings/Reminder";
import ReminderOverlay from "components/Reminder";
import Version from "components/settings/Version";
import HeaderTitle from "components/HeaderTitle";
import Company from "components/settings/Company";
import Pro from "components/settings/Pro";
import Support from "components/settings/Support";
import { getStoredVal, getTheme, pressedDefault } from "utils/helpers";

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [company, setCompany] = useState("");
  const [hasPro, setHasPro] = useState(false);

  const dividerStyle = {
    backgroundColor: theme.color.secondaryBg,
    marginVertical: theme.spacing.base,
    width: "100%" as const,
    height: 1,
  };

  useEffect(() => {
    (async () => {
      // Check if user has a company and/or a Pro sub
      const companyName = await getStoredVal("company-name");
      const proID = await getStoredVal("pro-id");
      if (companyName) setCompany(companyName);
      if (proID) setHasPro(true);
    })();
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
              labelStyle={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body }}
              tintColor={theme.color.link}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
          headerRight: () => <Support />,
        }}
      />

      <HeaderTitle text="Settings" />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.base,
          paddingBottom: insets.bottom + theme.spacing.base,
        }}
      >
        <Name />
        <View style={dividerStyle} />
        <Reminder reminderVisible={reminderVisible} setReminderVisible={setReminderVisible} />
        <View style={dividerStyle} />

        {company && (
          <>
            <Company company={company} setCompany={setCompany} />
            <View style={dividerStyle} />
          </>
        )}

        {(!company || (company && hasPro)) && (
          <>
            <Pro hasPro={hasPro} />
            <View style={dividerStyle} />
          </>
        )}

        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/terms/?iab=1")}
          style={({ pressed }) => pressedDefault(pressed)}
          hitSlop={16}
        >
          <Text
            style={{
              color: theme.color.link,
              fontFamily: "Circular-Book",
              fontSize: theme.fontSize.body,
            }}
            allowFontScaling={false}
          >
            Terms of Use
          </Text>
        </Pressable>

        <View style={dividerStyle} />

        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/privacy-policy/?iab=1")}
          style={({ pressed }) => pressedDefault(pressed)}
          hitSlop={16}
        >
          <Text
            style={{
              color: theme.color.link,
              fontFamily: "Circular-Book",
              fontSize: theme.fontSize.body,
            }}
            allowFontScaling={false}
          >
            Privacy Policy
          </Text>
        </Pressable>

        <View style={dividerStyle} />
        <Version />
        <View style={dividerStyle} />
      </ScrollView>

      <ReminderOverlay visible={reminderVisible} setVisible={setReminderVisible} />
    </View>
  );
}
