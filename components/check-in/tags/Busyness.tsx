import { useEffect } from "react";
import { useColorScheme, Text, Pressable, View } from "react-native";
import * as Device from "expo-device";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { getTheme, pressedDefault } from "utils/helpers";

type BusynessProps = {
  foreground: string;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
};

export default function Busyness(props: BusynessProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          borderColor: props.foreground,
          flexDirection: "row",
          borderWidth: theme.stroke,
          borderRadius: theme.spacing.base,
          height: Device.deviceType === 1 ? 36 : 48,
          overflow: "hidden",
          maxWidth: Device.deviceType === 1 ? 288 : 320,
        },
      ]}
    >
      <Button id={1} level={props.level} setLevel={props.setLevel} foreground={props.foreground}>
        Slow
      </Button>

      <View style={{ backgroundColor: props.foreground, width: theme.stroke, height: "100%" }} />

      <Button id={2} level={props.level} setLevel={props.setLevel} foreground={props.foreground}>
        Steady
      </Button>

      <View style={{ backgroundColor: props.foreground, width: theme.stroke, height: "100%" }} />

      <Button id={3} level={props.level} setLevel={props.setLevel} foreground={props.foreground}>
        Busy
      </Button>
    </Animated.View>
  );
}

type ButtonProps = {
  children: string;
  id: number;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  foreground: string;
};

function Button(props: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const selected = props.level === props.id;

  return (
    <Pressable
      onPress={() => props.setLevel(props.id)}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: selected ? props.foreground : "transparent",
        },
      ]}
    >
      <Text
        style={{
          fontFamily: "Circular-Medium",
          color: selected && props.foreground === "black" ? "white" : selected ? "black" : props.foreground,
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        {props.children}
      </Text>
    </Pressable>
  );
}
