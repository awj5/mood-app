import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { BookText } from "lucide-react-native";
import { CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

type ArticleProps = {
  checkIns: CheckInType[];
};

export default function Article(props: ArticleProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View style={{ flex: 1, opacity, gap: Device.deviceType !== 1 ? 12 : 8 }}>
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
        <BookText
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 18 : 14,
          }}
          allowFontScaling={false}
        >
          ARTICLE
        </Text>
      </View>

      <Pressable
        onPress={() => alert("Coming soon")}
        style={({ pressed }) => [
          pressedDefault(pressed),
          {
            aspectRatio: Device.deviceType !== 1 ? "2/1" : "4/4",
            backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
            borderRadius: spacing,
            padding: spacing,
            gap: spacing,
          },
        ]}
        hitSlop={8}
      >
        <Text
          style={{
            fontFamily: "Circular-Book",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          }}
          allowFontScaling={false}
        ></Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
