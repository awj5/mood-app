import { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { EmotionType } from "app/check-in";
import { theme } from "utils/helpers";

type EmojiProps = {
  emotion: EmotionType;
  showTags: boolean;
};

export default function Emoji(props: EmojiProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const size = Device.deviceType !== 1 ? 382 : 260; // Smaller on phones

  const emoji = {
    flushed: require("../../assets/img/emoji/flushed.svg"),
    angry: require("../../assets/img/emoji/angry.svg"),
    unamused: require("../../assets/img/emoji/unamused.svg"),
    weary: require("../../assets/img/emoji/weary.svg"),
    sleeping: require("../../assets/img/emoji/sleeping.svg"),
    relieved: require("../../assets/img/emoji/relieved.svg"),
    slightlySmiling: require("../../assets/img/emoji/slightly-smiling.svg"),
    bigEyes: require("../../assets/img/emoji/big-eyes.svg"),
    fearful: require("../../assets/img/emoji/fearful.svg"),
    crying: require("../../assets/img/emoji/crying.svg"),
    smilingEyes: require("../../assets/img/emoji/smiling-eyes.svg"),
    grinning: require("../../assets/img/emoji/grinning.svg"),
  };

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyles,
        { width: size, height: size, display: props.showTags ? "none" : "flex" },
      ]}
      pointerEvents="none"
    >
      <Ionicons
        name="caret-down-sharp"
        size={Device.deviceType !== 1 ? 32 : 24}
        color={colors.secondary}
        style={[
          styles.caret,
          {
            marginTop: Device.deviceType !== 1 ? -224 - 32 - 4 : -152 - 24 - 4,
          },
        ]}
      />

      <Image source={emoji[props.emotion.emoji as keyof typeof emoji]} style={styles.image} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
  },
  caret: {
    position: "absolute",
    top: "50%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
