import { useEffect } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

type SongProps = {
  checkIns: CheckInType[];
};

export default function Song(props: SongProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 18 : 14;
  const iconSize = Device.deviceType !== 1 ? 28 : 20;

  const images = {
    Creep: require("../../../assets/img/music/creep.jpg"),
  };

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, [JSON.stringify(props.checkIns)]);

  return (
    <Animated.View
      style={{
        width: "100%",
        backgroundColor: colors.primary === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
        borderRadius: spacing,
        padding: spacing,
        opacity,
        gap: spacing,
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 16 : 12,
          }}
          allowFontScaling={false}
        >
          MOOD MUSIC
        </Text>

        <View style={[styles.links, { gap: spacing }]}>
          <Pressable
            onPress={() => Linking.openURL("https://music.youtube.com/watch?v=XFkzRNyygfk&feature=shared")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={8}
          >
            <FontAwesome6 name="youtube" size={iconSize} color={colors.primary} />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("https://music.apple.com/album/creep/1679849414?i=1679849415")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={8}
          >
            <FontAwesome6 name="itunes-note" size={iconSize} color={colors.primary} />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("https://open.spotify.com/track/62J6RO53R6vNhOB6QXajFV?si=ecec2d7bcc8949bc")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={8}
          >
            <FontAwesome6 name="spotify" size={iconSize} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: spacing }}>
        <Image source={images["Creep"]} style={{ width: Device.deviceType !== 1 ? 160 : 120, aspectRatio: "1/1" }} />

        <View style={[styles.text, { gap: spacing / 2 }]}>
          <View>
            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 24 : 18,
              }}
              allowFontScaling={false}
            >
              Creep
            </Text>

            <Text
              style={{
                fontFamily: "Circular-Medium",
                color: colors.primary,
                fontSize: fontSize,
              }}
              allowFontScaling={false}
            >
              Radiohead
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Circular-BookItalic",
              color: colors.primary,
              fontSize: fontSize,
              lineHeight: Device.deviceType !== 1 ? 25 : 17,
              opacity: 0.5,
            }}
            allowFontScaling={false}
          >
            {"“But I'm a creep, I'm a weirdo\nWhat the hell am I doin' here?\nI don't belong here”"}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  links: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
  },
  text: {
    flex: 1,
    justifyContent: "space-between",
  },
});
