import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { theme } from "utils/helpers";

type BarProps = {
  stat: number;
};

export default function Bar(props: BarProps) {
  const colors = theme();
  const width = useSharedValue(0);
  const [label, setLabel] = useState("");
  const textPadding = Device.deviceType !== 1 ? 14 : 10;
  const fontSize = Device.deviceType !== 1 ? 16 : 12;

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const describeMoodScore = (score: number) => {
    let result = "";

    switch (true) {
      case score >= 85:
        result = "Very high";
        break;
      case score >= 65:
        result = "High";
        break;
      case score >= 55:
        result = "Moderately high";
        break;
      case score >= 45:
        result = "Average";
        break;
      case score >= 35:
        result = "Moderately low";
        break;
      case score >= 15:
        result = "Low";
        break;
      default:
        result = "Very low";
    }

    return result;
  };

  useEffect(() => {
    width.value = withTiming(props.stat, { duration: 300, easing: Easing.out(Easing.cubic) });
    setLabel(describeMoodScore(props.stat));
  }, [props.stat]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary === "white" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)",
          height: Device.deviceType !== 1 ? 36 : 28,
        },
      ]}
    >
      <Animated.View style={[styles.wrapper, animatedStyles, { backgroundColor: colors.primary }]}>
        <Text
          style={[
            styles.text,
            {
              color: colors.primary === "white" ? "black" : "white",
              fontSize: fontSize,
              paddingRight: textPadding,
              display: props.stat < 45 ? "none" : "flex", // Show if bar is greater than 45%
            },
          ]}
          allowFontScaling={false}
        >
          {label}
        </Text>
      </Animated.View>

      <Text
        style={{
          fontFamily: "Circular-Book",
          paddingLeft: textPadding,
          color: colors.primary,
          fontSize: fontSize,
          display: props.stat < 45 ? "flex" : "none", // Show if bar is less than 45%
        }}
        allowFontScaling={false}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  wrapper: {
    height: "100%",
    borderRadius: 999,
    justifyContent: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    alignSelf: "flex-end",
  },
});
