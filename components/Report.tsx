import { useState } from "react";
import { Text, Pressable, Alert, useColorScheme } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import axios from "axios";
import { Flag } from "lucide-react-native";
import { CheckInType, CompanyCheckInType } from "types";
import { pressedDefault, getStoredVal, getTheme } from "utils/helpers";
import { generateHash, getPromptCheckIns } from "utils/data";

type ReportProps = {
  text: string;
  visible: boolean;
  checkIns?: CheckInType[] | CompanyCheckInType[];
  func?: () => void;
  category?: number;
  opaque?: boolean;
};

export default function Report(props: ReportProps) {
  const db = useSQLiteContext();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [reported, setReported] = useState(false);

  const deleteInsightsData = async (ids: number[], hash: string) => {
    const uuid = await getStoredVal("uuid");

    if (!hash) {
      // User check-ins
      try {
        // Delete insight
        const query = `
        DELETE FROM insights WHERE check_ins = ?
      `;

        await db.runAsync(query, [ids.toString()]);
        if (props.func) props.func(); // Regenerate insights
      } catch (error) {
        console.error(error);
      }
    } else if (uuid) {
      // Company check-ins
      try {
        await axios.post(
          !__DEV__
            ? "https://mood-web-zeta.vercel.app/api/insights/delete"
            : "http://localhost:3000/api/insights/delete",
          {
            uuid: uuid,
            hash: hash,
            ...(props.category !== undefined && { category: props.category }),
          }
        );

        if (props.func) props.func(); // Regenerate insights
      } catch (error) {
        console.error(error);
      }
    }
  };

  const press = () => {
    Alert.alert(
      "Report Bad Response",
      "By tapping 'Send,' this response will be anonymously submitted to our team for review. Thank you for your feedback!",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Send", onPress: send },
      ]
    );
  };

  const send = async () => {
    // Remove saved summary
    if (props.checkIns) {
      const promptCheckIns = getPromptCheckIns(props.checkIns);
      const hash = "value" in props.checkIns[0] ? await generateHash(promptCheckIns.ids) : ""; // Generate hash if check-ins are from company
      deleteInsightsData(promptCheckIns.ids, hash);
    } else {
      setReported(true);
    }

    const name = await getStoredVal("first-name");

    // Send email to team
    try {
      await axios.post(!__DEV__ ? "https://mood-web-zeta.vercel.app/api/report" : "http://localhost:3000/api/report", {
        text: name ? props.text.replace(new RegExp(name, "gi"), "[USER]") : props.text, // Redact user's name
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable
      onPress={press}
      style={({ pressed }) => [
        pressedDefault(pressed),
        {
          gap: theme.spacing.base / 4,
          display: props.visible ? "flex" : "none",
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
        },
      ]}
      hitSlop={8}
      disabled={reported}
    >
      <Flag
        color={props.opaque ? theme.color.opaque : theme.color.secondary}
        size={theme.icon.xSmall.size}
        absoluteStrokeWidth
        strokeWidth={theme.icon.xSmall.stroke}
      />

      <Text
        style={{
          fontFamily: "Circular-Book",
          color: props.opaque ? theme.color.opaque : theme.color.secondary,
          fontSize: theme.fontSize.xSmall,
        }}
        allowFontScaling={false}
      >
        {reported ? "Received!" : "Report"}
      </Text>
    </Pressable>
  );
}
