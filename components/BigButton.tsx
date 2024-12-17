import { useEffect } from "react";
import { StyleSheet, Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { pressedDefault, theme } from "utils/helpers";

type BigButtonProps = {
  children: string;
  route: string;
  shadow?: boolean;
  bounce?: boolean;
  icon?: React.ElementType;
};

export default function BigButton(props: BigButtonProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const colors = theme();
  const Icon = props.icon;

  const press = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(props.route);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (props.bounce) {
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
      scale.value = withTiming(1, { duration: 0 }); // Stop bounce animation
    }
  }, [props.bounce]);

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Pressable
        onPress={press}
        style={({ pressed }) => [
          pressedDefault(pressed),
          styles.button,
          props.shadow && styles.shadow,
          {
            backgroundColor: colors.primary,
            height: Device.deviceType !== 1 ? 96 : 72,
            gap: Device.deviceType !== 1 ? 12 : 8,
          },
        ]}
        hitSlop={8}
      >
        {Icon && (
          <Icon
            color={colors.primary === "white" ? "black" : "white"}
            size={Device.deviceType !== 1 ? 32 : 24}
            absoluteStrokeWidth
            strokeWidth={Device.deviceType !== 1 ? 2.5 : 2}
          />
        )}

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary === "white" ? "black" : "white",
            fontSize: Device.deviceType !== 1 ? 24 : 18,
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
  container: {
    transform: [{ scale: 1 }],
    alignItems: "center",
    width: "100%",
  },
  button: {
    borderRadius: 999,
    width: "100%",
    maxWidth: 448,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  shadow: {
    shadowColor: "black",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
