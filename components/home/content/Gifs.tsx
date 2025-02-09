import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, View, Pressable } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as Linking from "expo-linking";
import Animated, { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import GifsData from "data/gifs.json";
import { CheckInType } from "data/database";
import Gif from "./gifs/Gif";
import { theme, pressedDefault, shuffleArray } from "utils/helpers";

export type GifType = {
  url: string;
  link: string;
  tags: number[];
};

type GifsProps = {
  checkIns: CheckInType[];
};

export default function Gifs(props: GifsProps) {
  const colors = theme();
  const opacity = useSharedValue(0);
  const [gifsList, setGifsList] = useState<GifType[]>([]);
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const images = {
    light: require("../../../assets/img/tenor.png"),
    dark: require("../../../assets/img/tenor-dark.png"),
  };

  useEffect(() => {
    const shuffled = shuffleArray(GifsData);
    setGifsList(shuffled.slice(0, 10));
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
          RELATABLE MEMES
        </Text>

        <Pressable
          onPress={() => Linking.openURL("https://tenor.com/")}
          style={({ pressed }) => [pressedDefault(pressed), styles.logo, { gap: spacing / 4 }]}
          hitSlop={16}
        >
          <Text
            style={[
              styles.logoText,
              {
                color: colors.primary === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                fontSize: Device.deviceType !== 1 ? 12 : 8,
              },
            ]}
            allowFontScaling={false}
          >
            POWERED BY
          </Text>

          <Image
            source={images[colors.primary === "white" ? "dark" : "light"]}
            style={{ width: Device.deviceType !== 1 ? 57 : 43, height: Device.deviceType !== 1 ? 16 : 12 }}
            contentFit="fill"
          />
        </Pressable>
      </View>

      <ScrollView horizontal>
        {gifsList.map((item, index) => (
          <Gif key={index} item={item} />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  logo: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
  },
  logoText: {
    fontFamily: "Circular-Book",
    marginTop: 2,
  },
});
