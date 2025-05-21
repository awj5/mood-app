import { Platform, StyleSheet } from "react-native";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
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
          onPress: () =>
            Platform.OS === "ios"
              ? WebBrowser.openBrowserAsync("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")
              : WebBrowser.openBrowserAsync("https://articles.mood.ai/terms"),
        },
        {
          pattern: /privacy policy/,
          style: styles.link,
          onPress: () => WebBrowser.openBrowserAsync("https://articles.mood.ai/privacy-policy/"),
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
