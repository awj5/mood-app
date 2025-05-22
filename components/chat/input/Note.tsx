import { View, Pressable, Text, useColorScheme } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { ShieldCheck } from "lucide-react-native";
import { pressedDefault, getTheme } from "utils/helpers";

export default function Note() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View
      style={{
        gap: theme.spacing.base / 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ShieldCheck
        color={theme.color.secondary}
        size={theme.icon.base.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.base.stroke}
      />

      <Text
        style={{ fontFamily: "Circular-Book", color: theme.color.secondary, fontSize: theme.fontSize.small }}
        allowFontScaling={false}
      >
        Your conversations are <Text style={{ fontFamily: "Circular-Bold" }}>private</Text>.
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/privacy")}
          style={({ pressed }) => pressedDefault(pressed)}
          hitSlop={8}
        >
          <Text
            style={{
              color: theme.color.link,
              fontFamily: "Circular-Book",
              fontSize: theme.fontSize.small,
            }}
            allowFontScaling={false}
          >
            Learn more
          </Text>
        </Pressable>

        <Text
          style={{ fontFamily: "Circular-Book", color: theme.color.secondary, fontSize: theme.fontSize.small }}
          allowFontScaling={false}
        >
          .
        </Text>
      </View>
    </View>
  );
}
