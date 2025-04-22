import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { theme } from "utils/helpers";

type GaugeProps = {
  value: number;
};

export default function Gauge(props: GaugeProps) {
  const colors = theme();
  const rotation = useSharedValue(0);
  const fontSize = Device.deviceType !== 1 ? 18 : 14;

  const images = {
    light: require("../../../../assets/img/metre.png"),
    dark: require("../../../../assets/img/metre-dark.png"),
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    rotation.value = withTiming(props.value, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, [props.value]);

  return (
    <View
      style={{
        width: Device.deviceType !== 1 ? 224 : 128,
        gap: Device.deviceType !== 1 ? 6 : 4,
      }}
    >
      <Image source={images[colors.primary === "white" ? "dark" : "light"]} style={styles.image} />

      <Animated.View style={[styles.wrapper, animatedStyles]}>
        {Device.deviceType !== 1 ? (
          <Svg
            width="14"
            height="84"
            viewBox="0 0 14 84"
            fill={colors.primary === "white" ? "black" : "white"}
            style={styles.hand}
          >
            <Path d="M14 77C14 80.866 10.866 84 7 84C3.13401 84 0 80.866 0 77L3.5 3.5C3.5 1.567 5.067 0 7 0C8.933 0 10.5 1.567 10.5 3.5L14 77Z" />
          </Svg>
        ) : (
          <Svg
            width="8"
            height="48"
            viewBox="0 0 8 48"
            fill={colors.primary === "white" ? "black" : "white"}
            style={styles.hand}
          >
            <Path d="M8 44C8 46.2091 6.20914 48 4 48C1.79086 48 0 46.2091 0 44L2 2C2 0.89543 2.89543 0 4 0C5.10457 0 6 0.89543 6 2L8 44Z" />
          </Svg>
        )}
      </Animated.View>

      <View style={styles.range}>
        <Text
          style={{
            fontFamily: "Circular-Medium",
            color: colors.primary,
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          Low
        </Text>

        <Text
          style={{
            fontFamily: "Circular-Medium",
            color: colors.primary,
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          High
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: "2/1",
  },
  wrapper: {
    width: "100%",
    aspectRatio: "1/1",
    position: "absolute",
    alignItems: "center",
  },
  hand: {
    position: "absolute",
    bottom: "50%",
  },
  range: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
