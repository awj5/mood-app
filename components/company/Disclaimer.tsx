import { StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import { ChartSpline } from "lucide-react-native";
import Button from "components/Button";
import { theme, pressedDefault } from "utils/helpers";

type DisclaimerProps = {
  company: string;
};

export default function Disclaimer(props: DisclaimerProps) {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  const agree = () => {
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
          {props.company} Insights
        </Text>

        <Text
          style={[
            styles.text,
            {
              color: colors.primary,
              fontSize: fontSize,
            },
          ]}
          allowFontScaling={false}
        >
          To view real-time insights into workplace wellbeing trends at{" "}
          <Text style={{ fontFamily: "Circular-Bold" }}>{props.company}</Text>, you must first agree to anonymously
          share your check-ins. This does not include any information shared in your private chats with{" "}
          <Text style={{ fontFamily: "Circular-Bold" }}>MOOD</Text>.{"\n\n"}
          <Text style={{ fontFamily: "Circular-Bold" }}>
            Neither {props.company} nor MOOD.ai are able to identify an individual user's check-in.
          </Text>
        </Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Button func={agree} fill>
          Agree and continue
        </Button>
      </View>

      <Pressable onPress={() => alert("Coming soon")} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
        <Text
          style={[
            styles.text,
            {
              color: colors.secondary,
              fontSize: fontSize,
              textDecorationLine: "underline",
            },
          ]}
          allowFontScaling={false}
        >
          Learn more about our{"\n"}commitment to your privacy
        </Text>
      </Pressable>
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
    maxWidth: 512,
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
