import { View, Pressable, Text, useColorScheme } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { ShieldCheck } from "lucide-react-native";
import { pressedDefault, getTheme } from "utils/helpers";

export default function Note() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const textStyle = {
    fontFamily: "Circular-Book",
    color: theme.color.primary,
    fontSize: theme.fontSize.small,
  };

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
        color={theme.color.primary}
        size={theme.icon.base.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.base.stroke}
      />

      <Text style={textStyle} allowFontScaling={false}>
        All check-in data is <Text style={{ fontFamily: "Circular-Bold" }}>anonymous</Text>.
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/privacy/?iab=1")}
          style={({ pressed }) => pressedDefault(pressed)}
          hitSlop={8}
        >
          <Text
            style={[textStyle, { color: theme.color.primary, textDecorationLine: "underline" }]}
            allowFontScaling={false}
          >
            Learn more
          </Text>
        </Pressable>

        <Text style={textStyle} allowFontScaling={false}>
          .
        </Text>
      </View>
    </View>
  );
}
