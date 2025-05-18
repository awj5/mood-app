import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, useColorScheme } from "react-native";
import { Stack, useRouter } from "expo-router";
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
import { getStoredVal, getTheme } from "utils/helpers";

export default function Settings() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [reminderVisible, setReminderVisible] = useState(false);
  const [company, setCompany] = useState("");
  const [hasPro, setHasPro] = useState(false);
  const dividerStyle = { backgroundColor: theme.color.secondaryBg, marginVertical: theme.spacing };

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
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: theme.spacing,
          paddingBottom: insets.bottom + theme.spacing,
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

        {(!company || (company && hasPro)) && (
          <>
            <Pro hasPro={hasPro} />
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
  divider: {
    width: "100%",
    height: 1,
  },
});
