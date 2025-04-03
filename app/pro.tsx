import { Pressable, Text, View, Platform, ScrollView, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { Sparkles } from "lucide-react-native";
import IAP from "components/pro/IAP";
import Features from "components/pro/Features";
import { theme, pressedDefault } from "utils/helpers";

export default function Pro() {
  const colors = theme();
  const router = useRouter();
  const headerHeight = useHeaderHeight();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const foreground = colors.primary === "white" ? "black" : "white";

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
            <Pressable onPress={() => null} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
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
        <View style={{ gap: Device.deviceType !== 1 ? 8 : 4 }}>
          <View style={[styles.heading, { gap: spacing / 2 }]}>
            <Sparkles
              color={foreground}
              size={Device.deviceType !== 1 ? 48 : 40}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 3.5 : 3}
            />

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
          </View>

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
  heading: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
