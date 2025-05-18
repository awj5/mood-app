import { Text, Pressable, useColorScheme, Linking } from "react-native";
import { Mail } from "lucide-react-native";
import { pressedDefault, getTheme } from "utils/helpers";

export default function Support() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <Pressable
      onPress={() => {
        const email = "support@mood.ai";
        const subject = "Support Request";
        const body = "Hi MOOD.ai team,\n\nI need help with...";

        const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        Linking.openURL(emailUrl).catch((err) => console.error("Failed to open email URL:", err));
      }}
      style={({ pressed }) => [
        pressedDefault(pressed),
        { gap: theme.spacing / 3, flexDirection: "row", alignItems: "center" },
      ]}
      hitSlop={theme.spacing}
    >
      <Mail
        color={theme.color.link}
        size={theme.icon.base.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.base.stroke}
      />

      <Text
        style={{
          fontFamily: "Circular-Book",
          fontSize: theme.fontSize.body,
          color: theme.color.link,
        }}
        allowFontScaling={false}
      >
        Support
      </Text>
    </Pressable>
  );
}
