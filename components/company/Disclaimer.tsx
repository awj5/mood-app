import { useContext, useState } from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import axios from "axios";
import { ChartSpline, ShieldCheck } from "lucide-react-native";
import { FocusedCategoryContext, FocusedCategoryContextType } from "context/focused-category";
import Button from "components/Button";
import { CheckInMoodType, CheckInType } from "types";
import { pressedDefault, setStoredVal, getTheme, getStoredVal } from "utils/helpers";
import { convertToISO } from "utils/dates";

type DisclaimerProps = {
  company: string;
  setHasAccess: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Disclaimer(props: DisclaimerProps) {
  const db = useSQLiteContext();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { focusedCategory } = useContext<FocusedCategoryContextType>(FocusedCategoryContext);
  const [submitting, setSubmitting] = useState(false);
  const isSimulator = Device.isDevice === false;

  const postCheckIn = async (checkIn: CheckInMoodType) => {
    const uuid = await getStoredVal("uuid");
    const deviceUUID = await getStoredVal("device-uuid"); // Unique device UUID

    if (uuid) {
      const today = new Date();

      // Save to Supabase
      try {
        await axios.post(
          !isSimulator ? "https://www.moodcheck.co/api/check-in" : "http://localhost:3000/api/check-in",
          {
            uuid: uuid,
            deviceID: deviceUUID,
            value: checkIn,
            date: convertToISO(today),
          }
        );

        await db.runAsync("INSERT INTO check_in_record DEFAULT VALUES;"); // Record check-in locally (users can only send 1 check-in per day to company insights)
        if (focusedCategory) setStoredVal("focused-statement", String(checkIn.competency));
      } catch (error) {
        console.error("Failed to save check-in:", error);
      }
    }
  };

  const press = async () => {
    setSubmitting(true);

    // Send latest check-in to DB
    try {
      const row: CheckInType | null = await db.getFirstAsync("SELECT * FROM check_ins ORDER BY id DESC"); // Get latest

      if (row) {
        try {
          await postCheckIn(JSON.parse(row.mood)); // Send
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Will fire even if send to DB fails
      setStoredVal("send-check-ins", "true");
      props.setHasAccess(true);
    }
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
          <View style={{ gap: theme.spacing.base / 4, flexDirection: "row", alignItems: "center" }}>
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
          <Button func={press} fill large disabled={submitting}>
            Agree and continue
          </Button>
        </View>
      </View>
    </View>
  );
}
