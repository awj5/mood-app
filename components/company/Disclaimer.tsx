import { View, Text, Pressable, useColorScheme } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { ChartSpline, ShieldCheck } from "lucide-react-native";
import Button from "components/Button";
import { pressedDefault, setStoredVal, getTheme } from "utils/helpers";

type DisclaimerProps = {
  company: string;
  setHasAccess: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Disclaimer(props: DisclaimerProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const press = () => {
    setStoredVal("send-check-ins", "true");
    props.setHasAccess(true);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          gap: theme.spacing.base,
          maxWidth: 768,
          alignItems: "center",
          paddingHorizontal: theme.spacing.small * 2,
          width: "100%",
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
          {props.company} Insights
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
          To view real-time insights into workplace wellbeing trends at{" "}
          <Text style={{ fontFamily: "Circular-Bold" }}>{props.company}</Text>, you must first agree to anonymously
          share your check-ins. This does not include any information shared in your private chats with{" "}
          <Text style={{ fontFamily: "Circular-Bold" }}>MOOD</Text>.
        </Text>

        <View
          style={{
            backgroundColor: theme.color.secondaryBg,
            borderRadius: theme.spacing.base,
            padding: theme.spacing.small * 2,
            gap: theme.spacing.base / 2,
            width: "100%",
            maxWidth: 512,
            alignItems: "center",
          }}
        >
          <View style={{ gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" }}>
            <ShieldCheck
              color={theme.color.primary}
              size={theme.icon.base.size}
              absoluteStrokeWidth
              strokeWidth={theme.icon.base.stroke}
            />

            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: theme.color.primary,
                fontSize: theme.fontSize.small,
              }}
              allowFontScaling={false}
            >
              PRIVACY PROTECTED
            </Text>
          </View>

          <Text
            style={{
              color: theme.color.primary,
              fontSize: theme.fontSize.body,
              fontFamily: "Circular-Book",
              textAlign: "center",
            }}
            allowFontScaling={false}
          >
            Neither <Text style={{ fontFamily: "Circular-Bold" }}>{props.company}</Text> or{" "}
            <Text style={{ fontFamily: "Circular-Black" }}>MOOD</Text>.ai can identify an individual user's check-in.
          </Text>

          <Pressable
            onPress={() => WebBrowser.openBrowserAsync("https://articles.mood.ai/privacy/?iab=1")}
            style={({ pressed }) => pressedDefault(pressed)}
            hitSlop={8}
          >
            <Text
              style={{
                color: theme.color.link,
                fontSize: theme.fontSize.small,
                fontFamily: "Circular-Book",
                textAlign: "center",
              }}
              allowFontScaling={false}
            >
              Learn about our privacy commitment
            </Text>
          </Pressable>
        </View>

        <View
          style={{ width: "100%", maxWidth: 512, paddingHorizontal: theme.spacing.base, marginTop: theme.spacing.base }}
        >
          <Button func={press} fill large>
            Agree and continue
          </Button>
        </View>
      </View>
    </View>
  );
}
