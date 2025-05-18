import { View, Text, Pressable, Platform, Linking, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import * as Application from "expo-application";
import { Sparkles } from "lucide-react-native";
import { pressedDefault, getTheme } from "utils/helpers";

type ProProps = {
  hasPro: boolean;
};

export default function Pro(props: ProProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const press = () => {
    if (props.hasPro) {
      // Has pro
      if (Platform.OS === "ios") {
        Linking.openURL("https://apps.apple.com/account/subscriptions").catch(() =>
          console.error("Unable to open account subscriptions.")
        );
      } else {
        const packageName = Application.applicationId;

        Linking.openURL(`https://play.google.com/store/account/subscriptions?package=${packageName}`).catch(() =>
          console.error("Unable to open account subscriptions.")
        );
      }
    } else {
      router.push("pro"); // Show paywall
    }
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ gap: theme.spacing / 3, flexDirection: "row", alignItems: "center" }}>
        <Sparkles
          color={theme.color.primary}
          size={theme.icon.base.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.base.stroke}
        />

        <Text
          style={{
            color: theme.color.primary,
            fontFamily: "Circular-Medium",
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          MOOD.ai Pro
        </Text>
      </View>

      <Pressable onPress={press} style={({ pressed }) => pressedDefault(pressed)} hitSlop={theme.spacing}>
        <Text
          style={{
            color: theme.color.link,
            fontFamily: "Circular-Book",
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          {props.hasPro ? "Manage" : "Learn more"}
        </Text>
      </Pressable>
    </View>
  );
}
