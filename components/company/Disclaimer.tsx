import { StyleSheet, View, Text, Pressable } from "react-native";
import * as Device from "expo-device";
import * as WebBrowser from "expo-web-browser";
import { ChartSpline, ShieldCheck } from "lucide-react-native";
import Button from "components/Button";
import { theme, pressedDefault, setStoredVal } from "utils/helpers";

type DisclaimerProps = {
  company: string;
  setHasAccess: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Disclaimer(props: DisclaimerProps) {
  const colors = theme();
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const fontSize = Device.deviceType !== 1 ? 20 : 16;
  const fontSizeSmall = Device.deviceType !== 1 ? 18 : 14;

  const agree = () => {
    setStoredVal("send-check-ins", "true");
    props.setHasAccess(true);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing * 1.5,
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
          {props.company} Insights
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
          To view real-time insights into workplace wellbeing trends at{" "}
          <Text style={{ fontFamily: "Circular-Bold" }}>{props.company}</Text>, you must first agree to anonymously
          share your check-ins. This does not include any information shared in your private chats with{" "}
          <Text style={{ fontFamily: "Circular-Bold" }}>MOOD</Text>.
        </Text>

        <View
          style={[
            styles.privacy,
            {
              backgroundColor: colors.secondaryBg,
              padding: spacing,
              borderRadius: spacing,
              gap: spacing,
            },
          ]}
        >
          <View style={[styles.heading, { gap: spacing / 4 }]}>
            <ShieldCheck
              color={colors.primary}
              size={Device.deviceType !== 1 ? 28 : 20}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
            />

            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: colors.primary,
                fontSize: fontSizeSmall,
              }}
              allowFontScaling={false}
            >
              PRIVACY PROTECTED
            </Text>
          </View>

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
            Neither <Text style={{ fontFamily: "Circular-Bold" }}>{props.company}</Text> nor{" "}
            <Text style={{ fontFamily: "Circular-Bold" }}>MOOD.ai</Text> are able to identify an individual user's
            check-in.
          </Text>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/privacy")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={16}
          >
            <Text
              style={[
                styles.text,
                {
                  color: colors.link,
                  fontSize: fontSizeSmall,
                },
              ]}
              allowFontScaling={false}
            >
              Learn more about our{"\n"}commitment to your privacy
            </Text>
          </Pressable>
        </View>

        <View style={{ width: "100%", paddingHorizontal: spacing, paddingTop: spacing }}>
          <Button func={agree} fill large>
            Agree and continue
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
  privacy: {
    width: "100%",
    alignItems: "center",
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
  },
});
