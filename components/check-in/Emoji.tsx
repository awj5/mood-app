import { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { MoodType } from "app/check-in";
import { theme } from "utils/helpers";

type EmojiProps = {
  mood: MoodType;
  showTags: boolean;
};

export default function Emoji(props: EmojiProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const size = Device.deviceType !== 1 ? 382 : 260; // Smaller on phones

  const emoji = {
    1: require("../../assets/img/emoji/big-eyes.svg"),
    2: require("../../assets/img/emoji/grinning.svg"),
    3: require("../../assets/img/emoji/slightly-smiling.svg"),
    4: require("../../assets/img/emoji/smiling-eyes.svg"),
    5: require("../../assets/img/emoji/relieved.svg"),
    6: require("../../assets/img/emoji/sleeping.svg"),
    7: require("../../assets/img/emoji/weary.svg"),
    8: require("../../assets/img/emoji/crying.svg"),
    9: require("../../assets/img/emoji/fearful.svg"),
    10: require("../../assets/img/emoji/unamused.svg"),
    11: require("../../assets/img/emoji/angry.svg"),
    12: require("../../assets/img/emoji/flushed.svg"),
  };

  useEffect(() => {
    opacity.value = withDelay(1000, withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) }));
  }, []);

  return (
    <Animated.View
      style={[styles.container, { opacity, width: size, height: size, display: props.showTags ? "none" : "flex" }]}
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

      <Image source={emoji[props.mood.id as keyof typeof emoji]} style={styles.image} />
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
