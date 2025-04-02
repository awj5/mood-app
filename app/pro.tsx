import { Pressable, Text, View, Platform, ScrollView, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderBackButton, useHeaderHeight } from "@react-navigation/elements";
import { Sparkles } from "lucide-react-native";
import IAP from "components/pro/IAP";
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
          headerRight:
            Platform.OS === "ios"
              ? () => (
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
                )
              : () => null,
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
          gap: spacing,
        }}
      >
        <View style={{ alignItems: "center", gap: spacing / 2 }}>
          <Sparkles
            color={foreground}
            size={Device.deviceType !== 1 ? 88 : 64}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 5.5 : 4}
          />

          <Text
            style={{
              fontFamily: "Circular-Bold",
              fontSize: Device.deviceType !== 1 ? 48 : 36,
              color: foreground,
            }}
            allowFontScaling={false}
          >
            MOOD.ai Pro
          </Text>
        </View>

        <Text>
          Mood check-in dolor sit amet, anonymous feedback adipiscing elit. Real-time insights eiusmod tempor incididunt
          ut labore et psychological safety. Excepteur sint occaecat cupidatat non disclosure agreements. Sentiment
          analysis proident, sunt in culpa qui officia deserunt mollit anim id est dashboard data. Mood check-in dolor
          sit amet, anonymous feedback adipiscing elit. Real-time insights eiusmod tempor incididunt ut labore et
          psychological safety. Excepteur sint occaecat cupidatat non disclosure agreements. Sentiment analysis
          proident, sunt in culpa qui officia deserunt mollit anim id est dashboard data. Mood check-in dolor sit amet,
          anonymous feedback adipiscing elit. Real-time insights eiusmod tempor incididunt ut labore et psychological
          safety. Excepteur sint occaecat cupidatat non disclosure agreements. Sentiment analysis proident, sunt in
          culpa qui officia deserunt mollit anim id est dashboard data. Mood check-in dolor sit amet, anonymous feedback
          adipiscing elit. Real-time insights eiusmod tempor incididunt ut labore et psychological safety. Excepteur
          sint occaecat cupidatat non disclosure agreements. Sentiment analysis proident, sunt in culpa qui officia
          deserunt mollit anim id est dashboard data. Mood check-in dolor sit amet, anonymous feedback adipiscing elit.
          Real-time insights eiusmod tempor incididunt ut labore et psychological safety. Excepteur sint occaecat
          cupidatat non disclosure agreements. Sentiment analysis proident, sunt in culpa qui officia deserunt mollit
          anim id est dashboard data. Mood check-in dolor sit amet, anonymous feedback adipiscing elit. Real-time
          insights eiusmod tempor incididunt ut labore et psychological safety. Excepteur sint occaecat cupidatat non
          disclosure agreements. Sentiment analysis proident, sunt in culpa qui officia deserunt mollit anim id est
          dashboard data. Mood check-in dolor sit amet, anonymous feedback adipiscing elit. Real-time insights eiusmod
          tempor incididunt ut labore et psychological safety. Excepteur sint occaecat cupidatat non disclosure
          agreements. Sentiment analysis proident, sunt in culpa qui officia deserunt mollit anim id est dashboard data.
          Mood check-in dolor sit amet, anonymous feedback adipiscing elit. Real-time insights eiusmod tempor incididunt
          ut labore et psychological safety. Excepteur sint occaecat cupidatat non disclosure agreements. Sentiment
          analysis proident, sunt in culpa qui officia deserunt mollit anim id est dashboard data. Mood check-in dolor
          sit amet, anonymous feedback adipiscing elit. Real-time insights eiusmod tempor incididunt ut labore et
          psychological safety. Excepteur sint occaecat cupidatat non disclosure agreements. Sentiment analysis
          proident, sunt in culpa qui officia deserunt mollit anim id est dashboard data. Mood check-in dolor sit amet,
          anonymous feedback adipiscing elit. Real-time insights eiusmod tempor incididunt ut labore et psychological
          safety. Excepteur sint occaecat cupidatat non disclosure agreements. Sentiment analysis proident, sunt in
          culpa qui officia deserunt mollit anim id est dashboard data.
        </Text>
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
});
