import { Platform, StyleSheet, useColorScheme } from "react-native";
import * as WebBrowser from "expo-web-browser";
import ParsedText from "react-native-parsed-text";
import { getTheme } from "utils/helpers";

export default function Footer() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

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
      style={{
        color: theme.color.inverted,
        fontSize: theme.fontSize.xSmall,
        fontFamily: "Circular-Book",
        textAlign: "center",
      }}
    >
      You'll only be charged after your free trial ends. Cancel anytime. See our terms and privacy policy for all the
      fine print.
    </ParsedText>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
    fontFamily: "Circular-Medium",
  },
});
