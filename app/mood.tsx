import { Pressable, Text, View, ScrollView, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MoodsData from "data/moods.json";
import TextBlock from "components/mood/TextBlock";
import { pressedDefault } from "utils/helpers";

export default function Mood() {
  const params = useLocalSearchParams<{ name: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const data = MoodsData.filter((mood) => mood.name === params.name)[0];
  const foreground = data.id >= 6 && data.id <= 11 ? "white" : "black";
  const spacing = Device.deviceType !== 1 ? 24 : 16;

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
            backgroundColor: data.color,
          },
          headerStyle: {
            backgroundColor: data.color,
          },
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text
                style={{
                  fontFamily: "Circular-Book",
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
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

      <View style={{ alignItems: "center", gap: spacing / 2, padding: spacing }}>
        <Image
          source={emojis[data.id as keyof typeof emojis]}
          style={{ aspectRatio: "1/1", width: Device.deviceType !== 1 ? 64 : 48 }}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            fontSize: Device.deviceType !== 1 ? 48 : 36,
            color: foreground,
          }}
          allowFontScaling={false}
        >
          {data.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing, paddingBottom: spacing + insets.bottom, gap: spacing }}>
        <Text
          style={[
            styles.description,
            {
              color: foreground,
              fontSize: Device.deviceType !== 1 ? 20 : 16,
              paddingBottom: spacing,
            },
          ]}
        >
          {data.description}
        </Text>

        <TextBlock title="SCIENCE" text={data.science} background={foreground} color={data.color} />
        <TextBlock title="STRATEGIES" text={data.strategies} background={foreground} color={data.color} />
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
