import { useContext, useState } from "react";
import { Pressable, Text, View, Platform, ScrollView, StyleSheet, Alert } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import IAP from "components/pro/IAP";
import Features from "components/pro/Features";
import { theme, pressedDefault, setStoredVal } from "utils/helpers";
import { getMonday } from "utils/dates";

export default function Pro() {
  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const { setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [submitting, setSubmitting] = useState(false);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const foreground = colors.primary === "white" ? "black" : "white";

  const APIKeys = {
    ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY!,
    android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY!,
  };

  const restore = async () => {
    if (Constants.appOwnership === "expo") return;
    setSubmitting(true);

    try {
      const purchasesModule = require("react-native-purchases");
      const purchases = purchasesModule.default;
      purchases.configure({ apiKey: APIKeys[Platform.OS as keyof typeof APIKeys] });
      const restore = await purchases.restorePurchases();
      const isPro = restore.activeSubscriptions.length > 0;

      if (isPro) {
        const appUserID = await purchases.getAppUserID(); // Get unique ID from RC
        setStoredVal("pro-id", appUserID as string); // Store RC ID

        // Trigger dashboard refresh
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const monday = getMonday(today);
        setHomeDates({ weekStart: monday, rangeStart: undefined, rangeEnd: undefined });

        Alert.alert("Success!", "MOOD.ai Pro has been restored.", [
          {
            text: "OK",
            onPress: () => {
              router.back(); // Close modal
            },
          },
        ]);
      } else {
        Alert.alert("No Active Subscription", "We couldn't find an active MOOD.ai Pro subscription.");
      }
    } catch (error) {
      console.log(error);
      alert("An unexpected error has occurred.");
    }

    setSubmitting(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTransparent: true,
          headerLeft:
            Platform.OS === "android"
              ? () => (
                  <HeaderBackButton
                    onPress={() => router.back()}
                    label="Back"
                    labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
                    tintColor={foreground}
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
                        color: foreground,
                      }}
                      allowFontScaling={false}
                    >
                      Close
                    </Text>
                  </Pressable>
                ),
          headerRight: () => (
            <Pressable
              onPress={restore}
              style={({ pressed }) => pressedDefault(pressed)}
              hitSlop={16}
              disabled={submitting}
            >
              <Text
                style={{
                  fontFamily: "Circular-Book",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                  color: foreground,
                }}
                allowFontScaling={false}
              >
                Restore
              </Text>
            </Pressable>
          ),
        }}
      />

      <LinearGradient
        colors={colors.primary === "white" ? ["#FF8000", "#00FF00", "#0080FF"] : ["#0000FF", "#990099", "#FF0000"]}
        style={styles.gradient}
      />

      <ScrollView
        style={{ marginTop: headerHeight, flex: 1 }}
        contentContainerStyle={{
          padding: spacing,
          gap: spacing * 2,
        }}
      >
        <View style={{ gap: spacing / 2, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Circular-Bold",
              fontSize: Device.deviceType !== 1 ? 48 : 36,
              color: foreground,
            }}
            allowFontScaling={false}
          >
            Work Like a Pro
          </Text>

          <Text
            style={[
              styles.description,
              {
                color: foreground,
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              },
            ]}
            allowFontScaling={false}
          >
            {"Supercharge your emotional intelligence and\nunlock your best self at work."}
          </Text>
        </View>

        <Features />
      </ScrollView>

      <IAP />
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  description: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
