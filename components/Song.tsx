import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import SongsData from "data/songs.json";
import { CheckInMoodType, CheckInType } from "data/database";
import { CalendarDatesType } from "types";
import { theme, pressedDefault, getMostCommon } from "utils/helpers";

export type SongType = {
  title: string;
  artist: string;
  appleMusicLink: string;
  spotifyLink: string;
  lyrics: string;
  moods: number[];
};

type SongProps = {
  checkIns?: CheckInType[];
  mood?: number;
  dates?: CalendarDatesType;
};

export default function Song(props: SongProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [song, setSong] = useState<SongType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;
  const url = "https://res.cloudinary.com/dzuz9bul0/image/upload/";

  useEffect(() => {
    let color;

    if (props.checkIns && props.dates?.rangeStart) {
      // Get most common mood color
      const colors = [];

      for (let i = 0; i < props.checkIns.length; i++) {
        let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);
        colors.push(mood.color);
      }

      color = getMostCommon(colors);
    } else if (props.checkIns) {
      color = JSON.parse(props.checkIns[props.checkIns.length - 1].mood).color; // Latest check-in mood color
    } else {
      color = props.mood;
    }

    const songs = color ? SongsData.filter((item) => item.moods.includes(color)) : undefined; // Songs with check-in mood

    if (songs && songs.length) {
      const random = songs[Math.floor(Math.random() * songs.length)]; // Random song
      setSong(random);
    }

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

      <View style={{ flexDirection: "row", gap: Device.deviceType !== 1 ? 20 : 12 }}>
        <Image
          source={{
            uri: `${url}${song?.title
              .replace(/ /g, "-")
              .replace(/\./g, "")
              .replace(/\'/g, "")
              .replace(/\(/g, "")
              .replace(/\)/g, "")
              .replace(/\*/g, "")
              .replace(/\?/g, "")
              .replace(/\!/g, "")
              .toLowerCase()}.jpg`,
          }}
          style={{
            width: Device.deviceType !== 1 ? 192 : 128,
            aspectRatio: "1/1",
            borderRadius: spacing / 2,
            backgroundColor: colors.opaqueBg,
          }}
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
