import { useEffect } from "react";
import { DimensionValue, StyleSheet, useColorScheme, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MoodType } from "app/check-in";
import { getTheme } from "utils/helpers";

type EmojiProps = {
  showTags: boolean;
  mood: SharedValue<MoodType>;
  wheelSize: number;
};

export default function Emoji(props: EmojiProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const top = useSharedValue<DimensionValue>(0);

  useAnimatedReaction(
    () => props.mood.value,
    (currentVal, previousVal) => {
      if (currentVal !== previousVal && opacity.value === 1) top.value = `${-100 - 100 * (currentVal.id - 1)}%`;
    }
  );

  const animatedStylesContainer = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedStylesImage = useAnimatedStyle(() => ({
    top: top.value,
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500, easing: Easing.in(Easing.cubic) });
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        animatedStylesContainer,
        {
          width: props.wheelSize,
          height: props.wheelSize,
          display: props.showTags ? "none" : "flex",
          position: "absolute",
          alignItems: "center",
        },
      ]}
      pointerEvents="none"
    >
      <Ionicons
        name="caret-down-sharp"
        size={theme.icon.large.size}
        color={theme.color.secondaryBg}
        style={{
          marginTop: 0 - props.wheelSize / 2 - theme.spacing.small * 2,
          position: "absolute",
          top: "50%",
        }}
      />

      <View style={{ overflow: "hidden", width: "100%", height: "100%" }}>
        <Animated.View style={[styles.image, animatedStylesImage]}>
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
  image: {
    width: "100%",
    height: "100%",
  },
});
