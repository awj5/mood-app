import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import SongsData from "data/songs.json";
import { CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

export type SongType = {
  title: string;
  artist: string;
  appleMusicLink: string;
  spotifyLink: string;
  lyrics: string;
  tags: number[];
};

type SongProps = {
  checkIns: CheckInType[];
};

export default function Song(props: SongProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [song, setSong] = useState<SongType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;

  const images = {
    WhatAboutUs: require("../../../assets/img/music/what-about-us.jpg"),
  };

  useEffect(() => {
    setSong(SongsData[0]);
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
            onPress={() => Linking.openURL(song?.appleMusicLink ?? "https://music.apple.com")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={12}
          >
            <FontAwesome6 name="itunes-note" size={iconSize} color={colors.primary} />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL(song?.spotifyLink ?? "https://open.spotify.com")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={12}
          >
            <FontAwesome6 name="spotify" size={iconSize} color={colors.primary} />
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: spacing }}>
        <Image
          source={images[song?.title.replace(/ /g, "").replace(/\./g, "") as keyof typeof images]}
          style={{ width: Device.deviceType !== 1 ? 192 : 128, aspectRatio: "1/1" }}
        />

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
              {song?.title}
            </Text>

            <Text
              style={{
                fontFamily: "Circular-Book",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              }}
              allowFontScaling={false}
            >
              {song?.artist}
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
              {`“${song?.lyrics}”`}
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
