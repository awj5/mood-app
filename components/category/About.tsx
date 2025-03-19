import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import guidelinesData from "data/guidelines.json";
import { theme } from "utils/helpers";

type AboutProps = {
  id: number;
  title: string;
};

export default function About(props: AboutProps) {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const invertedColor = colors.primary === "white" ? "black" : "white";
  const fontSize = Device.deviceType !== 1 ? 18 : 14;
  const description = guidelinesData[0].categories.filter((item) => item.id === props.id)[0].description;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.primary !== "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.4)",
          borderRadius: spacing,
          padding: spacing * 1.5,
          gap: spacing / 1.5,
        },
      ]}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          fontSize: fontSize,
          color: invertedColor,
        }}
        allowFontScaling={false}
      >
        {`WHAT'S ${props.title}?`}
      </Text>

      <Text
        style={[
          styles.text,
          {
            fontSize: fontSize,
            color: invertedColor,
          },
        ]}
      >
        {description}
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
