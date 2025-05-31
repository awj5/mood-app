import { Pressable, Text, View, ScrollView, StyleSheet, Platform, useColorScheme } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBackButton } from "@react-navigation/elements";
import MoodsData from "data/moods.json";
import TextBlock from "components/mood/TextBlock";
import Song from "components/Song";
import Gifs from "components/Gifs";
import Quote from "components/Quote";
import { getTheme, pressedDefault } from "utils/helpers";

export default function Mood() {
  const params = useLocalSearchParams<{ name: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const mood = MoodsData.filter((item) => item.name === params.name)[0];
  const foreground = mood.id >= 6 && mood.id <= 11 ? "white" : "black";

  const emojis = {
    1: require("../assets/img/emoji/small/black/yellow.svg"),
    2: require("../assets/img/emoji/small/black/chartreuse.svg"),
    3: require("../assets/img/emoji/small/black/green.svg"),
    4: require("../assets/img/emoji/small/black/spring-green.svg"),
    5: require("../assets/img/emoji/small/black/cyan.svg"),
    6: require("../assets/img/emoji/small/white/azure.svg"),
    7: require("../assets/img/emoji/small/white/blue.svg"),
    8: require("../assets/img/emoji/small/white/dark-violet.svg"),
    9: require("../assets/img/emoji/small/white/dark-magenta.svg"),
    10: require("../assets/img/emoji/small/white/dark-rose.svg"),
    11: require("../assets/img/emoji/small/white/red.svg"),
    12: require("../assets/img/emoji/small/black/orange.svg"),
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: "",
          contentStyle: {
            backgroundColor: mood.color,
          },
          headerStyle: {
            backgroundColor: mood.color,
          },
          headerLeft:
            Platform.OS === "android"
              ? () => (
                  <HeaderBackButton
                    onPress={() => router.back()}
                    label="Back"
                    labelStyle={{ fontFamily: "Circular-Book", fontSize: theme.fontSize.body }}
                    tintColor={foreground}
                    allowFontScaling={false}
                    style={{ marginLeft: -8 }}
                  />
                )
              : () => (
                  <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => pressedDefault(pressed)}
                    hitSlop={16}
                  >
                    <Text
                      style={{
                        fontFamily: "Circular-Book",
                        fontSize: theme.fontSize.body,
                        color: foreground,
                      }}
                      allowFontScaling={false}
                    >
                      Close
                    </Text>
                  </Pressable>
                ),
        }}
      />

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.base,
          paddingBottom: theme.spacing.base + insets.bottom,
          gap: theme.spacing.base,
        }}
      >
        <View style={{ alignItems: "center", gap: theme.spacing.base / 2 }}>
          <Image
            source={emojis[mood.id as keyof typeof emojis]}
            style={{ aspectRatio: "1/1", width: Device.deviceType === 1 ? 64 : 88 }}
          />

          <Text
            style={{
              fontFamily: "Circular-Black",
              fontSize: theme.fontSize.xxxLarge,
              color: foreground,
            }}
            allowFontScaling={false}
          >
            {mood.name}
          </Text>
        </View>

        <Text
          style={[
            styles.description,
            {
              color: foreground,
              fontSize: Device.deviceType !== 1 ? 20 : 16,
              paddingBottom: theme.spacing.base,
            },
          ]}
        >
          {mood.summary}
        </Text>

        <TextBlock
          title={`${mood.name.toUpperCase()} SCIENCE`}
          text={mood.science}
          background={foreground}
          color={mood.color}
        />

        <TextBlock
          title={`${mood.name.toUpperCase()} STRATEGIES`}
          text={mood.strategies}
          background={foreground}
          color={mood.color}
        />

        <Song mood={mood.id} />
        <Gifs tags={mood.tags} />
        <Quote tags={mood.tags} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
