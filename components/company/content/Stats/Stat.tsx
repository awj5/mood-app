import { Text, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Device from "expo-device";
import { getTheme, pressedDefault } from "utils/helpers";

type StatProps = {
  text: string;
};

export default function Stat(props: StatProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

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
    Plum: require("../../../../assets/img/emoji/small/dark-magenta.png"),
    Maroon: require("../../../../assets/img/emoji/small/dark-rose.png"),
    Red: require("../../../../assets/img/emoji/small/red.png"),
    Orange: require("../../../../assets/img/emoji/small/orange.png"),
    Other: require("../../../../assets/img/emoji/small/white.png"),
  };

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [
        pressedDefault(pressed),
        { gap: theme.spacing.base / 4, flexDirection: "row", alignItems: "center" },
      ]}
      hitSlop={4}
      disabled={props.text === "Other"}
    >
      <Image
        source={emojis[props.text as keyof typeof emojis]}
        style={{ aspectRatio: "1/1", width: Device.deviceType === 1 ? theme.icon.small.size : theme.icon.base.size }}
      />

      <Text
        style={{
          fontSize: Device.deviceType === 1 ? theme.fontSize.xSmall : theme.fontSize.small,
          fontFamily: "Circular-Medium",
          color: theme.color.inverted,
        }}
        allowFontScaling={false}
      >
        {props.text}
      </Text>
    </Pressable>
  );
}
