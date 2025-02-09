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
  const iconSize = Device.deviceType !== 1 ? 32 : 24;

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

        <View style={[styles.links, { gap: spacing * 1.5 }]}>
          <Pressable
            onPress={() => Linking.openURL("https://music.apple.com/album/creep/1097862062?i=1097862231")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={12}
          >
            <FontAwesome6 name="itunes-note" size={iconSize} color={colors.primary} />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("https://open.spotify.com/track/70LcF31zb1H0PyJoS1Sx1r?si=52f1ba49f3bd4f95")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={12}
          >
            <FontAwesome6 name="spotify" size={iconSize} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: spacing }}>
        <Image source={images["Creep"]} style={{ width: Device.deviceType !== 1 ? 192 : 128, aspectRatio: "1/1" }} />

        <View style={{ flex: 1, gap: spacing }}>
          <View>
            <Text
              style={{
                fontFamily: "Circular-Black",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 24 : 18,
              }}
              allowFontScaling={false}
            >
              Creep
            </Text>

            <Text
              style={{
                fontFamily: "Circular-Book",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              }}
              allowFontScaling={false}
            >
              Radiohead
            </Text>
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Circular-Medium",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 14 : 11,
                opacity: 0.5,
              }}
              allowFontScaling={false}
            >
              DEFINING LYRICS
            </Text>

            <Text
              style={{
                fontFamily: "Circular-BookItalic",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 18 : 14,
              }}
              allowFontScaling={false}
            >
              {"“But I'm a creep, I'm a weirdo\nWhat the hell am I doin' here?\nI don't belong here”"}
            </Text>
          </View>
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
  logoText: {
    fontFamily: "Circular-Book",
    marginTop: 2,
  },
});
