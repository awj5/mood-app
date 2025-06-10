import { useState } from "react";
import { Pressable, Text, View, Platform, ScrollView, useColorScheme } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import IAP from "components/pro/IAP";
import Features from "components/pro/Features";
import Restore from "components/pro/Restore";
import { pressedDefault, getTheme } from "utils/helpers";

export default function Pro() {
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [loading, setLoading] = useState(true);

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
                    labelStyle={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body }}
                    tintColor={theme.color.inverted}
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
                        fontSize: theme.fontSize.body,
                        color: theme.color.inverted,
                      }}
                      allowFontScaling={false}
                    >
                      Close
                    </Text>
                  </Pressable>
                ),
          headerRight: () => <Restore loading={loading} setLoading={setLoading} />,
        }}
      />

      <LinearGradient
        colors={theme.color.gradient as [string, string, ...string[]]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />

      <ScrollView
        style={{ marginTop: Platform.OS === "android" ? 106 : headerHeight }}
        contentContainerStyle={{
          padding: theme.spacing.base,
          paddingTop: Device.deviceType === 1 ? theme.spacing.base : 0,
          gap: Device.deviceType === 1 ? theme.spacing.base * 2 : theme.spacing.base,
        }}
      >
        <View style={{ gap: theme.spacing.small / 2, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: "Circular-Black",
              fontSize: theme.fontSize.xxxLarge,
              color: theme.color.inverted,
            }}
            allowFontScaling={false}
          >
            Work Like a Pro
          </Text>

          <Text
            style={{
              color: theme.color.inverted,
              fontSize: theme.fontSize.body,
              fontFamily: "Circular-Book",
              textAlign: "center",
            }}
            allowFontScaling={false}
          >
            Boost emotional intelligence and unlock your best self at work with{" "}
            <Text style={{ fontFamily: "Circular-Bold" }}>MOOD.ai Pro</Text>.
          </Text>
        </View>

        <Features />
      </ScrollView>

      <IAP loading={loading} setLoading={setLoading} />
    </View>
  );
}
