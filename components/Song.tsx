import { useEffect, useState } from "react";
import { Text, View, Pressable, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import SongsData from "data/songs.json";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { pressedDefault, getMostCommon, getTheme, slugify } from "utils/helpers";

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
  dates?: CalendarDatesType;
  mood?: number;
};

export default function Song(props: SongProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const opacity = useSharedValue(0);
  const [song, setSong] = useState<SongType>();
  const assetsURL = "https://res.cloudinary.com/dzuz9bul0/image/upload/";

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    let color = props.mood
      ? props.mood
      : props.checkIns && !props.dates?.rangeStart
      ? JSON.parse(props.checkIns[props.checkIns.length - 1].mood).color
      : 0;

    if (props.checkIns && props.dates?.rangeStart) {
      // Get most common mood color in check-ins
      const colors = [];

      for (const checkIn of props.checkIns) {
        let mood: CheckInMoodType = JSON.parse(checkIn.mood);
        colors.push(mood.color);
      }

      color = getMostCommon(colors);
    }

    const songs = SongsData.filter((item) => item.moods.includes(color)); // Songs with check-in mood

    if (songs.length) {
      const random = songs[Math.floor(Math.random() * songs.length)]; // Random song
      setSong(random);
    }

    opacity.value = withTiming(1, { duration: 300, easing: Easing.in(Easing.cubic) });
  }, []);

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          backgroundColor: theme.color.opaqueBg,
          borderRadius: theme.spacing.base,
          padding: theme.spacing.base,
          gap: theme.spacing.base,
        },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: theme.color.primary,
            fontSize: theme.fontSize.xSmall,
          }}
          allowFontScaling={false}
        >
          MOOD MUSIC
        </Text>

        <View style={{ flexDirection: "row", gap: theme.spacing.small * 2 }}>
          <Pressable
            onPress={() => Linking.openURL(song?.appleMusicLink ?? "https://music.apple.com")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={12}
          >
            <FontAwesome6 name="itunes-note" size={theme.icon.large.size} color={theme.color.primary} />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL(song?.spotifyLink ?? "https://open.spotify.com")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={12}
          >
            <FontAwesome6 name="spotify" size={theme.icon.large.size} color={theme.color.primary} />
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: theme.spacing.small }}>
        {song?.title && (
          <Image
            source={{
              uri: `${assetsURL}${slugify(song.title)}`,
            }}
            style={{
              width: Device.deviceType === 1 ? 128 : 192,
              aspectRatio: "1/1",
              borderRadius: theme.spacing.base / 2,
              backgroundColor: theme.color.opaqueBg,
            }}
          />
        )}

        <View style={{ flex: 1, gap: theme.spacing.base }}>
          <View>
            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: theme.color.primary,
                fontSize: theme.fontSize.large,
              }}
              allowFontScaling={false}
            >
              {song?.title}
            </Text>

            <Text
              style={{
                fontFamily: "Circular-Book",
                color: theme.color.primary,
                fontSize: theme.fontSize.body,
              }}
              allowFontScaling={false}
            >
              {song?.artist}
            </Text>
          </View>

          <Text
            style={{
              fontFamily: "Tiempos-RegularItalic",
              color: theme.color.primary,
              fontSize: theme.fontSize.small,
              lineHeight: theme.fontSize.large,
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
