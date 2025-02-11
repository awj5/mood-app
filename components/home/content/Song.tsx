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
    Praying: require("../../../assets/img/music/praying.jpg"),
    JusttheWayYouAre: require("../../../assets/img/music/just-the-way-you-are.jpg"),
    StandbyYou: require("../../../assets/img/music/stand-by-you.jpg"),
    SomewhereIBelong: require("../../../assets/img/music/somewhere-i-belong.jpg"),
  };

  useEffect(() => {
    const random = SongsData[Math.floor(Math.random() * SongsData.length)]; // Random song
    setSong(random);
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

        <View style={[styles.links, { gap: spacing * 1.5, margin: Device.deviceType !== 1 ? -2.5 : -2 }]}>
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
          style={{ width: Device.deviceType !== 1 ? 192 : 128, aspectRatio: "1/1", borderRadius: spacing / 2 }}
        />

        <View style={{ flex: 1, gap: spacing }}>
          <View>
            <Text
              style={{
                fontFamily: "Circular-Bold",
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

          <Text
            style={{
              fontFamily: "Tiempos-RegularItalic",
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 18 : 14,
              lineHeight: Device.deviceType !== 1 ? 24 : 18,
            }}
            allowFontScaling={false}
          >
            {`“${song?.lyrics}”`}
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
  logoText: {
    fontFamily: "Circular-Book",
    marginTop: 2,
  },
});
