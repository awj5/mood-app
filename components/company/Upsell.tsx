import { StyleSheet, View, Text, Share } from "react-native";
import * as Device from "expo-device";
import { ShareIcon, ChartSpline } from "lucide-react-native";
import Button from "components/Button";
import { theme } from "utils/helpers";

export default function Upsell() {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const share = async () => {
    try {
      await Share.share({
        message: "Ready to turn emotion into action? https://www.mood.ai",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing * 1.5,
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
          style={{
            fontFamily: "Circular-Black",
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 36 : 30,
          }}
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
          your company with <Text style={{ fontFamily: "Circular-Bold" }}>real-time insights</Text> into overall
          workplace wellbeing trends. It's a game-changer for building a more supportive and psychologically safe work
          culture—<Text style={{ fontFamily: "Circular-Bold" }}>all while ensuring maximum privacy</Text>.{"\n\n"}Think
          your company could be more transparent about its commitment to emotional wellbeing?
        </Text>

        <View style={{ width: "100%", paddingHorizontal: spacing, paddingTop: spacing }}>
          <Button func={share} icon={ShareIcon} fill large>
            Share now
          </Button>
        </View>
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
    maxWidth: 768 - 72,
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
