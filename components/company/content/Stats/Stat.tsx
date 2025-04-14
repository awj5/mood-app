import { StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { theme, pressedDefault } from "utils/helpers";

type StatProps = {
  text: string;
  color: string;
};

export default function Stat(props: StatProps) {
  const colors = theme();
  const router = useRouter();
  const invertedColor = colors.primary === "white" ? "black" : "white";

  const press = () => {
    router.push({
      pathname: "mood",
      params: {
        name: props.text,
      },
    });
  };

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [pressedDefault(pressed), styles.container, { gap: Device.deviceType !== 1 ? 6 : 4 }]}
      hitSlop={2}
      disabled={props.text === "Other"}
    >
      <View
        style={[
          styles.dot,
          {
            width: Device.deviceType !== 1 ? 14 : 10,
            backgroundColor: props.color,
          },
        ]}
      />

      <Text
        style={{
          fontFamily: "Circular-Book",
          color: invertedColor,
          fontSize: Device.deviceType !== 1 ? 16 : 12,
        }}
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
  dot: {
    aspectRatio: "4/4",
    borderRadius: 999,
  },
});
