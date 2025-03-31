import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import SongsData from "data/songs.json";
import { CheckInMoodType, CheckInType } from "data/database";
import { theme, pressedDefault } from "utils/helpers";

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
};

export default function Song(props: SongProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [song, setSong] = useState<SongType>();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const iconSize = Device.deviceType !== 1 ? 32 : 24;
  const url = "https://hvwvyufuezybxttghqiy.supabase.co/storage/v1/object/public/content/music/";

  const images = {
    KeepYourHeadUp: "keep-your-head-up.jpg",
    WakeMeUp: "wake-me-up.png",
    Happy: "happy.png",
    DontBeSoHardOnYourself: "dont-be-so-hard-on-yourself.png",
    DontStopBelievin: "dont-stop-believin.jpg",
    HeroeswecouldbeftToveLo: "heroes-we-could-be-ft-tove-lo.jpg",
    Roar: "roar.png",
    ShakeItOff: "shake-it-off.png",
    BeOK: "be-ok.png",
    RainOnMe: "rain-on-me.png",
    BestDayOfMyLife: "best-day-of-my-life.jpg",
    CANTSTOPTHEFEELING: "cant-stop-the-feeling.png",
    GoodasHell: "good-as-hell.jpg",
    Brave: "brave.png",
    FightSong: "fight-song.png",
    FkinPerfect: "fkin-perfect.png",
    Say: "say.png",
    ShakeItOut: "shake-it-out.png",
    ILived: "i-lived.png",
    TheClimb: "the-climb.png",
    SomewhereOnlyWeKnow: "somewhere-only-we-know.jpg",
    burninggold: "burning-gold.png",
    OneStepAtaTime: "one-step-at-a-time.jpg",
    FlyfeatRihanna: "fly-feat-rihanna.jpg",
    Things: "3-things.jpg",
    IAmLight: "i-am-light.jpg",
    JusttheWayYouAre: "just-the-way-you-are.jpg",
    LivingintheMoment: "living-in-the-moment.jpg",
    WhatAWonderfulWorld: "what-a-wonderful-world.jpg",
    CountonMe: "count-on-me.png",
    MyWay: "my-way.jpg",
    OneCallAway: "one-call-away.png",
    AtTheRiver: "at-the-river.jpg",
    Golden: "golden.jpg",
    Easy: "easy.jpg",
    Feeling: "feeling.jpg",
    Beautiful: "beautiful.png",
    TrueColors: "true-colors.jpg",
    Try: "try.jpg",
    human: "human.png",
    Breathe2AM: "breathe-2-am.png",
    RiseUp: "rise-up.jpg",
    Angel: "angel.png",
    FixYou: "fix-you.png",
    Hands: "hands.jpg",
    WhoYouAre: "who-you-are.png",
    MadWorld: "mad-world.jpg",
    AndSoItGoes: "and-so-it-goes.jpg",
    WhatWasIMadeFor: "what-was-i-made-for.png",
    colorblind: "colorblind.jpg",
    Everglow: "everglow.png",
    Landslide: "landslide.jpg",
    SoI: "so-i.png",
    breathin: "breathin.png",
    Unwell: "unwell.jpg",
    Years: "7-years.jpg",
    Demons: "demons.jpg",
    Rise: "rise.png",
    Skyscraper: "skyscraper.png",
    BadDay: "bad-day.jpg",
    BoulevardofBrokenDreams: "boulevard-of-broken-dreams.png",
    DarkSide: "dark-side.jpg",
    EverybodyHurts: "everybody-hurts.jpg",
    KingofAnything: "king-of-anything.png",
    NoMoreDrama: "no-more-drama.jpg",
    ScarsToYourBeautiful: "scars-to-your-beautiful.png",
    StressedOut: "stressed-out.png",
    Unsteady: "unsteady.jpg",
    BehindBlueEyes: "behind-blue-eyes.jpg",
    BreatheMe: "breathe-me.jpg",
    IntheEnd: "in-the-end.jpg",
    OKAnxietyAnthem: "ok-anxiety-anthem.png",
    Numb: "numb.jpg",
    HallofFamefeatwilliam: "hall-of-fame-feat-william.jpg",
    NotAfraid: "not-afraid.jpg",
    Superheroes: "superheroes.png",
    TitaniumfeatSia: "titanium-feat-sia.png",
    Confident: "confident.png",
    EyeoftheTiger: "eye-of-the-tiger.jpg",
    Radioactive: "radioactive.jpg",
    Ride: "ride.png",
    MyShot: "my-shot.jpg",
    BreakingtheHabit: "breaking-the-habit.jpg",
    Survivor: "survivor.jpg",
    OneStepCloser: "one-step-closer.jpg",
    BREAKMYSOUL: "break-my-soul.png",
  };

  useEffect(() => {
    const mood: CheckInMoodType = props.checkIns
      ? JSON.parse(props.checkIns[props.checkIns.length - 1].mood) // Latest check-in
      : undefined;

    const color = mood ? mood.color : props.mood;
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

      <View style={{ flexDirection: "row", gap: spacing }}>
        <Image
          source={{
            uri:
              url +
              images[
                song?.title
                  .replace(/ /g, "")
                  .replace(/\./g, "")
                  .replace(/\'/g, "")
                  .replace(/\(/g, "")
                  .replace(/\)/g, "")
                  .replace(/\*/g, "")
                  .replace(/3/g, "")
                  .replace(/7/g, "")
                  .replace(/\?/g, "")
                  .replace(/\!/g, "") as keyof typeof images
              ],
          }}
          style={{
            width: Device.deviceType !== 1 ? 192 : 128,
            aspectRatio: "1/1",
            borderRadius: spacing / 2,
            backgroundColor: colors.secondaryBg,
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
