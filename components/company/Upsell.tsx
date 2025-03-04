import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import { Share, ChartSpline } from "lucide-react-native";
import Button from "components/Button";
import { theme } from "utils/helpers";

export default function Upsell() {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const share = () => {
    alert("Coming soon");
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing * 1.5,
          gap: spacing * 2,
          backgroundColor: colors.secondaryBg,
        },
      ]}
    >
      <View style={[styles.wrapper, { gap: spacing }]}>
        <ChartSpline
          color={colors.primary}
          size={Device.deviceType !== 1 ? 88 : 64}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 5.5 : 4}
        />

        <Text
          style={[
            styles.title,
            {
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 30 : 24,
            },
          ]}
          allowFontScaling={false}
        >
          Put MOOD.ai to Work
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: colors.primary,
              fontSize: Device.deviceType !== 1 ? 20 : 16,
            },
          ]}
          allowFontScaling={false}
        >
          Using anonymous mood check-ins, <Text style={{ fontFamily: "Circular-Bold" }}>MOOD.ai</Text> provides you and
          your company with real-time insights into overall workplace wellbeing trends. It's a game-changer for building
          a more supportive and psychologically safe work culture—all while ensuring maximum privacy.{"\n\n"}Think your
          company could be more transparent about its commitment to emotional wellbeing? Share{" "}
          <Text style={{ fontFamily: "Circular-Bold" }}>MOOD.ai</Text> with your employer today.
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Button func={share} icon={Share} fill>
          Share now
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    alignItems: "center",
    maxWidth: 672,
    width: "100%",
  },
  title: {
    fontFamily: "Circular-Black",
    textAlign: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
