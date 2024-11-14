import { useEffect } from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { MoodType } from "app/check-in";
import { theme } from "utils/helpers";

type EmojiProps = {
  showTags: boolean;
  mood: SharedValue<MoodType>;
};

export default function Emoji(props: EmojiProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const top = useSharedValue<DimensionValue>(0);
  const size = Device.deviceType !== 1 ? 448 : 304; // Smaller on phones

  useAnimatedReaction(
    () => props.mood.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && opacity.value === 1) top.value = `${-100 - 100 * (currentValue.id - 1)}%`;
    }
  );

  const animatedStyles = useAnimatedStyle(() => ({
    top: top.value,
  }));

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

      <View style={styles.imageWrapper}>
        <Animated.View style={[styles.image, animatedStyles]}>
          <Image source={require("../../assets/img/emoji/white.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/yellow.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/chartreuse.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/green.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/spring-green.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/cyan.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/azure.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/blue.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/dark-violet.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/dark-magenta.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/dark-rose.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/red.svg")} style={styles.image} />
          <Image source={require("../../assets/img/emoji/orange.svg")} style={styles.image} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    opacity: 0,
  },
  caret: {
    position: "absolute",
    top: "50%",
  },
  imageWrapper: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
