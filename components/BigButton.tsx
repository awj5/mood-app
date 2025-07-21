import { useEffect } from "react";
import { StyleSheet, Pressable, Text, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { getTheme, pressedDefault } from "utils/helpers";

type BigButtonProps = {
  children: string;
  route?: string;
  func?: () => void;
  shadow?: boolean;
  bounce?: boolean;
  icon?: React.ElementType;
  disabled?: boolean;
};

export default function BigButton(props: BigButtonProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const Icon = props.icon;

  const press = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (props.func) {
      props.func();
    } else if (props.route) {
      router.push(props.route);
    }
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (!reduceMotion && props.bounce) {
      // Start bounce animation
      scale.value = withRepeat(
        withSequence(
          withDelay(
            2000,
            withTiming(1.1, {
              duration: 200,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          withTiming(1, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1
      );
    } else {
      // Stop bounce animation
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) });
    }
  }, [props.bounce]);

  return (
    <Animated.View style={animatedStyles}>
      <Pressable
        onPress={press}
        style={({ pressed }) => [
          pressedDefault(pressed),
          props.shadow && styles.shadow,
          {
            backgroundColor: theme.color.primary,
            height: Device.deviceType === 1 ? 72 : 96,
            gap: theme.spacing.small / 2,
            borderRadius: 999,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          },
          props.disabled && { opacity: 0.25 },
        ]}
        hitSlop={8}
        disabled={props.disabled}
      >
        {Icon && (
          <Icon
            color={theme.color.inverted}
            size={theme.icon.large.size}
            absoluteStrokeWidth
            strokeWidth={theme.icon.large.stroke}
          />
        )}

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: theme.color.inverted,
            fontSize: theme.fontSize.large,
          }}
          allowFontScaling={false}
        >
          {props.children}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
