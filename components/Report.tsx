import { useState } from "react";
import { StyleSheet, Text, Pressable, Alert } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import Constants from "expo-constants";
import axios from "axios";
import { Flag } from "lucide-react-native";
import { CheckInType } from "database";
import { CompanyCheckInType } from "app/company";
import { theme, pressedDefault, getStoredVal } from "utils/helpers";
import { generateHash, getPromptData } from "utils/data";

type ReportProps = {
  text: string;
  visible: boolean;
  checkIns?: CheckInType[] | CompanyCheckInType[];
  func?: () => void;
  category?: number;
  opaque?: boolean;
};

export default function Report(props: ReportProps) {
  const colors = theme();
  const db = useSQLiteContext();
  const [reported, setReported] = useState(false);

  const deleteInsightsData = async (ids: number[], hash: string) => {
    const uuid = await getStoredVal("uuid");

    if (!hash) {
      try {
        // Delete insight
        const query = `
        DELETE FROM insights WHERE check_ins = ?
      `;

        await db.runAsync(query, [ids.toString()]);
        if (props.func) props.func(); // Regenerate insights
      } catch (error) {
        console.log(error);
      }
    } else if (uuid) {
      try {
        await axios.post(
          Constants.appOwnership !== "expo"
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
        console.log(error);
      }
    }
  };

  const confirm = () => {
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
      const promptData = getPromptData(props.checkIns);
      const hash = "value" in props.checkIns[0] ? await generateHash(promptData.ids) : "";
      deleteInsightsData(promptData.ids, hash); // Determine if company check-ins
    } else {
      setReported(true);
    }

    const name = await getStoredVal("first-name"); // Redact user's name

    // Send email to team
    try {
      await axios.post(
        Constants.appOwnership !== "expo"
          ? "https://mood-web-zeta.vercel.app/api/report"
          : "http://localhost:3000/api/report",
        {
          text: name ? props.text.replace(new RegExp(name, "gi"), "[USER]") : props.text,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={confirm}
      style={({ pressed }) => [
        pressedDefault(pressed),
        styles.container,
        { gap: Device.deviceType !== 1 ? 6 : 4, display: props.visible ? "flex" : "none" },
      ]}
      hitSlop={8}
      disabled={reported}
    >
      <Flag
        color={props.opaque ? colors.opaque : colors.secondary}
        size={Device.deviceType !== 1 ? 16 : 12}
        absoluteStrokeWidth
        strokeWidth={Device.deviceType !== 1 ? 1.5 : 1}
      />

      <Text
        style={{
          fontFamily: "Circular-Book",
          color: props.opaque ? colors.opaque : colors.secondary,
          fontSize: Device.deviceType !== 1 ? 16 : 12,
        }}
        allowFontScaling={false}
      >
        {reported ? "Received!" : "Report"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
});
