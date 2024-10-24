import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import * as Device from "expo-device";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { theme } from "utils/helpers";

type IconProps = {
  thinking: boolean;
};

export default function Icon(props: IconProps) {
  const colors = theme();
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  useEffect(() => {
    rotation.value = props.thinking ? withRepeat(withTiming(1, { duration: 700, easing: Easing.linear }), -1) : 0;
  }, [props.thinking]);

  return (
    <View style={{ width: Device.deviceType !== 1 ? 52 : 40, height: Device.deviceType !== 1 ? 52 : 40 }}>
      <Animated.View style={animatedStyles}>
        <Image source={require("../../assets/img/wheel.png")} style={styles.image} />
      </Animated.View>

      {Device.deviceType !== 1 ? (
        <Svg width="52" height="52" viewBox="0 0 52 52" fill={colors.primary} style={styles.eyes}>
          <Path d="M22.75 19.5C22.75 21.2949 21.2949 22.75 19.5 22.75C17.7051 22.75 16.25 21.2949 16.25 19.5C16.25 17.7051 17.7051 16.25 19.5 16.25C21.2949 16.25 22.75 17.7051 22.75 19.5Z" />
          <Path d="M35.75 19.5C35.75 21.2949 34.2949 22.75 32.5 22.75C30.7051 22.75 29.25 21.2949 29.25 19.5C29.25 17.7051 30.7051 16.25 32.5 16.25C34.2949 16.25 35.75 17.7051 35.75 19.5Z" />
        </Svg>
      ) : (
        <Svg width="40" height="40" viewBox="0 0 40 40" fill={colors.primary} style={styles.eyes}>
          <Path d="M17.5 15C17.5 16.3807 16.3807 17.5 15 17.5C13.6193 17.5 12.5 16.3807 12.5 15C12.5 13.6193 13.6193 12.5 15 12.5C16.3807 12.5 17.5 13.6193 17.5 15Z" />
          <Path d="M27.5 15C27.5 16.3807 26.3807 17.5 25 17.5C23.6193 17.5 22.5 16.3807 22.5 15C22.5 13.6193 23.6193 12.5 25 12.5C26.3807 12.5 27.5 13.6193 27.5 15Z" />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  eyes: {
    position: "absolute",
  },
});
