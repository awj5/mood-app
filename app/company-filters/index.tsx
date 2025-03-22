import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import HeaderTitle from "components/HeaderTitle";
import Link from "components/company-filters/Link";
import { theme, pressedDefault } from "utils/helpers";

export default function CompanyFilters() {
  const localization = getLocales();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const dividerStyle = { backgroundColor: colors.secondaryBg, marginVertical: spacing };

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
        text="Filters"
        description={`Refine company insights by selecting a location or a specific team within your ${
          localization[0].languageTag === "en-US" ? "organization" : "organisation"
        }.`}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing,
          paddingTop: spacing * 1.5,
          paddingBottom: insets.bottom + spacing,
        }}
      >
        <Link title="Locations" />
        <View style={[styles.divider, dividerStyle]} />
        <Link title="Teams" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    width: "100%",
    height: 1,
  },
});
