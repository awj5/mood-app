import { View, Text, useColorScheme, Linking } from "react-native";
import { ChartSpline, Info } from "lucide-react-native";
import Button from "components/Button";
import { getTheme } from "utils/helpers";

export default function Upsell() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View
      style={{
        backgroundColor: theme.color.secondaryBg,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          gap: theme.spacing.base,
          maxWidth: 768,
          width: "100%",
          paddingHorizontal: theme.spacing.small * 2,
          alignItems: "center",
        }}
      >
        <ChartSpline
          color={theme.color.primary}
          size={theme.icon.xxxLarge.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.xxxLarge.stroke}
        />

        <Text
          style={{
            fontFamily: "Circular-Black",
            color: theme.color.primary,
            fontSize: theme.fontSize.xxLarge,
          }}
          allowFontScaling={false}
        >
          Put MOOD.ai to Work
        </Text>

        <Text
          style={{
            color: theme.color.primary,
            fontSize: theme.fontSize.body,
            fontFamily: "Circular-Book",
            textAlign: "center",
          }}
          allowFontScaling={false}
        >
          Using anonymous mood check-ins, <Text style={{ fontFamily: "Circular-Black" }}>MOOD</Text>.ai gives you and
          your company <Text style={{ fontFamily: "Circular-Bold" }}>real-time insights</Text> into workplace wellbeing
          trends.{"\n\n"}Could your company be more transparent about emotional wellbeing?
        </Text>

        <View
          style={{ width: "100%", maxWidth: 512, paddingHorizontal: theme.spacing.base, marginTop: theme.spacing.base }}
        >
          <Button func={() => Linking.openURL("https://mood.ai")} gradient fill large icon={Info}>
            Learn more
          </Button>
        </View>
      </View>
    </View>
  );
}
