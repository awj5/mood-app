import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";

type TextBlockProps = {
  title: string;
  text: string;
  background: string;
  color: string;
};

export default function TextBlock(props: TextBlockProps) {
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 18 : 14;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: props.background,
          borderRadius: spacing,
          padding: spacing * 1.5,
          gap: spacing / 2,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          fontSize: fontSize,
          color: props.color,
        }}
        allowFontScaling={false}
      >
        {props.title}
      </Text>

      <Text
        style={[
          styles.text,
          {
            fontSize: fontSize,
            color: props.color,
          },
        ]}
      >
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
