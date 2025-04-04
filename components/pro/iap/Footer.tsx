import { StyleSheet } from "react-native";
import * as Device from "expo-device";
import ParsedText from "react-native-parsed-text";
import { theme } from "utils/helpers";

export default function Footer() {
  const colors = theme();

  return (
    <ParsedText
      parse={[
        {
          pattern: /terms/,
          style: styles.link,
          onPress: () => alert("Coming soon"),
        },
        {
          pattern: /privacy policy/,
          style: styles.link,
          onPress: () => alert("Coming soon"),
        },
      ]}
      style={[
        styles.container,
        {
          color: colors.primary === "white" ? "black" : "white",
          fontSize: Device.deviceType !== 1 ? 16 : 12,
        },
      ]}
    >
      You'll only be charged after your free trial ends. Cancel anytime before then and pay nothing. See our terms and
      privacy policy for all the fine print.
    </ParsedText>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
    fontFamily: "Circular-Medium",
  },
});
