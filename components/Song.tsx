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

  const images = {
    KeepYourHeadUp: require("../assets/img/music/keep-your-head-up.jpg"),
    WakeMeUp: require("../assets/img/music/wake-me-up.png"),
    Happy: require("../assets/img/music/happy.png"),
    DontBeSoHardOnYourself: require("../assets/img/music/dont-be-so-hard-on-yourself.png"),
    DontStopBelievin: require("../assets/img/music/dont-stop-believin.jpg"),
    HeroeswecouldbeftToveLo: require("../assets/img/music/heroes-we-could-be-ft-tove-lo.jpg"),
    Roar: require("../assets/img/music/roar.png"),
    ShakeItOff: require("../assets/img/music/shake-it-off.png"),
    BeOK: require("../assets/img/music/be-ok.png"),
    RainOnMe: require("../assets/img/music/rain-on-me.png"),
    BestDayOfMyLife: require("../assets/img/music/best-day-of-my-life.jpg"),
    CANTSTOPTHEFEELING: require("../assets/img/music/cant-stop-the-feeling.png"),
    GoodasHell: require("../assets/img/music/good-as-hell.jpg"),
    Brave: require("../assets/img/music/brave.png"),
    FightSong: require("../assets/img/music/fight-song.png"),
    FkinPerfect: require("../assets/img/music/fkin-perfect.png"),
    Say: require("../assets/img/music/say.png"),
    ShakeItOut: require("../assets/img/music/shake-it-out.png"),
    ILived: require("../assets/img/music/i-lived.png"),
    TheClimb: require("../assets/img/music/the-climb.png"),
    SomewhereOnlyWeKnow: require("../assets/img/music/somewhere-only-we-know.jpg"),
    burninggold: require("../assets/img/music/burning-gold.png"),
    OneStepAtaTime: require("../assets/img/music/one-step-at-a-time.jpg"),
    FlyfeatRihanna: require("../assets/img/music/fly-feat-rihanna.jpg"),
    Things: require("../assets/img/music/3-things.jpg"),
    IAmLight: require("../assets/img/music/i-am-light.jpg"),
    JusttheWayYouAre: require("../assets/img/music/just-the-way-you-are.jpg"),
    LivingintheMoment: require("../assets/img/music/living-in-the-moment.jpg"),
    WhatAWonderfulWorld: require("../assets/img/music/what-a-wonderful-world.jpg"),
    CountonMe: require("../assets/img/music/count-on-me.png"),
    MyWay: require("../assets/img/music/my-way.jpg"),
    OneCallAway: require("../assets/img/music/one-call-away.png"),
    AtTheRiver: require("../assets/img/music/at-the-river.jpg"),
    Golden: require("../assets/img/music/golden.jpg"),
    Easy: require("../assets/img/music/easy.jpg"),
    Feeling: require("../assets/img/music/feeling.jpg"),
    Beautiful: require("../assets/img/music/beautiful.png"),
    TrueColors: require("../assets/img/music/true-colors.jpg"),
    Try: require("../assets/img/music/try.jpg"),
    human: require("../assets/img/music/human.png"),
    Breathe2AM: require("../assets/img/music/breathe-2-am.png"),
    RiseUp: require("../assets/img/music/rise-up.jpg"),
    Angel: require("../assets/img/music/angel.png"),
    FixYou: require("../assets/img/music/fix-you.png"),
    Hands: require("../assets/img/music/hands.jpg"),
    WhoYouAre: require("../assets/img/music/who-you-are.png"),
    MadWorld: require("../assets/img/music/mad-world.jpg"),
    AndSoItGoes: require("../assets/img/music/and-so-it-goes.jpg"),
    WhatWasIMadeFor: require("../assets/img/music/what-was-i-made-for.png"),
    colorblind: require("../assets/img/music/colorblind.jpg"),
    Everglow: require("../assets/img/music/everglow.png"),
    Landslide: require("../assets/img/music/landslide.jpg"),
    SoI: require("../assets/img/music/so-i.png"),
    breathin: require("../assets/img/music/breathin.png"),
    Unwell: require("../assets/img/music/unwell.jpg"),
    Years: require("../assets/img/music/7-years.jpg"),
    Demons: require("../assets/img/music/demons.jpg"),
    Rise: require("../assets/img/music/rise.png"),
    Skyscraper: require("../assets/img/music/skyscraper.png"),
    BadDay: require("../assets/img/music/bad-day.jpg"),
    BoulevardofBrokenDreams: require("../assets/img/music/boulevard-of-broken-dreams.png"),
    DarkSide: require("../assets/img/music/dark-side.jpg"),
    EverybodyHurts: require("../assets/img/music/everybody-hurts.jpg"),
    KingofAnything: require("../assets/img/music/king-of-anything.png"),
    NoMoreDrama: require("../assets/img/music/no-more-drama.jpg"),
    ScarsToYourBeautiful: require("../assets/img/music/scars-to-your-beautiful.png"),
    StressedOut: require("../assets/img/music/stressed-out.png"),
    Unsteady: require("../assets/img/music/unsteady.jpg"),
    BehindBlueEyes: require("../assets/img/music/behind-blue-eyes.jpg"),
    BreatheMe: require("../assets/img/music/breathe-me.jpg"),
    IntheEnd: require("../assets/img/music/in-the-end.jpg"),
    OKAnxietyAnthem: require("../assets/img/music/ok-anxiety-anthem.png"),
    Numb: require("../assets/img/music/numb.jpg"),
    HallofFamefeatwilliam: require("../assets/img/music/hall-of-fame-feat-william.jpg"),
    NotAfraid: require("../assets/img/music/not-afraid.jpg"),
    Superheroes: require("../assets/img/music/superheroes.png"),
    TitaniumfeatSia: require("../assets/img/music/titanium-feat-sia.png"),
    Confident: require("../assets/img/music/confident.png"),
    EyeoftheTiger: require("../assets/img/music/eye-of-the-tiger.jpg"),
    Radioactive: require("../assets/img/music/radioactive.jpg"),
    Ride: require("../assets/img/music/ride.png"),
    MyShot: require("../assets/img/music/my-shot.jpg"),
    BreakingtheHabit: require("../assets/img/music/breaking-the-habit.jpg"),
    Survivor: require("../assets/img/music/survivor.jpg"),
    OneStepCloser: require("../assets/img/music/one-step-closer.jpg"),
    BREAKMYSOUL: require("../assets/img/music/break-my-soul.png"),
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
          source={
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
            ]
          }
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
