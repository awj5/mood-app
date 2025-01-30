import { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { theme } from "utils/helpers";

type GaugeProps = {
  value: number;
};

export default function Gauge(props: GaugeProps) {
  const colors = theme();
  const rotation = useSharedValue(0);
  const fontSize = Device.deviceType !== 1 ? 16 : 12;

  const images = {
    metre: require("../../../../assets/img/metre.png"),
    metreDark: require("../../../../assets/img/metre-dark.png"),
    hand: require("../../../../assets/img/hand.svg"),
    handDark: require("../../../../assets/img/hand-dark.svg"),
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
        overflow: "hidden",
        gap: Device.deviceType !== 1 ? 6 : 4,
      }}
    >
      <Image source={images[colors.primary === "white" ? "metreDark" : "metre"]} style={styles.image} />

      <Animated.View style={[styles.wrapper, animatedStyles]}>
        <Image
          source={images[colors.primary === "white" ? "handDark" : "hand"]}
          style={[styles.hand, { height: Device.deviceType !== 1 ? 84 : 48, width: Device.deviceType !== 1 ? 14 : 8 }]}
        />
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
    borderRadius: 999,
  },
  range: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
