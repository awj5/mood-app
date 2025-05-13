import { StyleSheet, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { pressedDefault } from "utils/helpers";

type StatProps = {
  text: string;
};

export default function Stat(props: StatProps) {
  const router = useRouter();

  const press = () => {
    router.push({
      pathname: "mood",
      params: {
        name: props.text,
      },
    });
  };

  const emojis = {
    Yellow: require("../../../../assets/img/emoji/small/yellow.png"),
    Lime: require("../../../../assets/img/emoji/small/chartreuse.png"),
    Green: require("../../../../assets/img/emoji/small/green.png"),
    Mint: require("../../../../assets/img/emoji/small/spring-green.png"),
    Cyan: require("../../../../assets/img/emoji/small/cyan.png"),
    Azure: require("../../../../assets/img/emoji/small/azure.png"),
    Blue: require("../../../../assets/img/emoji/small/blue.png"),
    Violet: require("../../../../assets/img/emoji/small/dark-violet.png"),
    DarkMagenta: require("../../../../assets/img/emoji/small/dark-magenta.png"),
    Burgundy: require("../../../../assets/img/emoji/small/dark-rose.png"),
    Red: require("../../../../assets/img/emoji/small/red.png"),
    Orange: require("../../../../assets/img/emoji/small/orange.png"),
    Other: require("../../../../assets/img/emoji/small/white.png"),
  };

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [pressedDefault(pressed), styles.container, { gap: Device.deviceType !== 1 ? 8 : 4 }]}
      hitSlop={4}
      disabled={props.text === "Other"}
    >
      <Image
        source={emojis[props.text as keyof typeof emojis]}
        style={{ aspectRatio: "1/1", width: Device.deviceType !== 1 ? 24 : 16 }}
      />

      <Text
        style={[
          styles.text,
          {
            fontSize: Device.deviceType !== 1 ? 18 : 12,
          },
        ]}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    color: "white",
  },
});
