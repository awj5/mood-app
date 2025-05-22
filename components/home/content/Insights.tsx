import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { getLocales } from "expo-localization";
import Constants from "expo-constants";
import axios from "axios";
import MoodsData from "data/moods.json";
import Loading from "components/Loading";
import Summary from "components/Summary";
import { CalendarDatesType, CheckInType, CheckInMoodType, PromptCheckInType } from "types";
import { getPromptCheckIns } from "utils/data";
import { getStoredVal, removeAccess } from "utils/helpers";

export type InsightType = {
  id: number;
  date: Date;
  check_ins: string;
  summary: string;
};

type InsightsProps = {
  checkIns: CheckInType[];
  dates: CalendarDatesType;
};

export default function Insights(props: InsightsProps) {
  const db = useSQLiteContext();
  const localization = getLocales();
  const latestQueryRef = useRef<symbol>();
  const [text, setText] = useState("");
  const [dates, setDates] = useState<CalendarDatesType>(props.dates);
  const [isLoading, setIsLoading] = useState(true);

  const describeMoodScore = (score: number) => {
    let result = "";

    switch (true) {
      case score >= 85:
        result = "very high";
        break;
      case score >= 65:
        result = "high";
        break;
      case score >= 55:
        result = "moderately high";
        break;
      case score >= 45:
        result = "average";
        break;
      case score >= 35:
        result = "moderately low";
        break;
      case score >= 15:
        result = "low";
        break;
      default:
        result = "very low";
    }

    return result;
  };

  const requestAISummary = async (promptData: PromptCheckInType[], uuid?: string | null, proID?: string | null) => {
    try {
      const response = await axios.post(
        Constants.appOwnership !== "expo" ? "https://mood-web-zeta.vercel.app/api/ai" : "http://localhost:3000/api/ai",
        {
          type: "summarize_check_ins",
          message: [
            {
              role: "user",
              content: `Please analyze these check-ins: ${JSON.stringify(promptData)}.`,
            },
          ],
          loc: localization[0].languageTag,
          ...(uuid !== undefined && uuid != null && { uuid: uuid }),
          ...(proID !== undefined && proID != null && { proid: proID }),
        }
      );

      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) removeAccess(); // User doesn't exist
      console.log(error);
    }
  };

  const getInsightsData = async (ids: number[]) => {
    try {
      const row: InsightType | null = await db.getFirstAsync(
        `SELECT * FROM insights WHERE check_ins = ?`,
        ids.toString()
      );

      return row;
    } catch (error) {
      console.log(error);
    }
  };

  const getInsights = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    setIsLoading(true);
    setText("");
    const promptData = getPromptCheckIns(props.checkIns);
    const savedResponse = await getInsightsData(promptData.ids);
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const proID = await getStoredVal("pro-id"); // Check if pro subscriber

    // Show saved response if exists or get response from API
    if (savedResponse && latestQueryRef.current === currentQuery) {
      setText(savedResponse.summary);
    } else if (
      (latestQueryRef.current === currentQuery && uuid) ||
      (latestQueryRef.current === currentQuery && proID)
    ) {
      let aiResponse = await requestAISummary(promptData.data, uuid, proID);

      if (aiResponse && latestQueryRef.current === currentQuery) {
        // Get mood scores
        const stress = [];
        const energy = [];

        // Loop check-ins and get mood satisfaction and energy scores
        for (let i = 0; i < props.checkIns.length; i++) {
          let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);
          stress.push(MoodsData.filter((item) => item.id === mood.color)[0].stress);
          energy.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
        }

        // Calculate averages
        const avgStress = Math.floor(stress.reduce((sum, num) => sum + num, 0) / stress.length);
        const avgEnergy = Math.floor(energy.reduce((sum, num) => sum + num, 0) / energy.length);

        aiResponse =
          aiResponse +
          ` Overall, you've felt ${describeMoodScore(avgStress)} in stress (${avgStress}%) and ${describeMoodScore(
            avgEnergy
          )} in energy (${avgEnergy}%).`;

        setText(aiResponse);

        // Save response
        try {
          await db.runAsync(`INSERT INTO insights (check_ins, summary) VALUES (?, ?)`, [
            promptData.ids.toString(),
            aiResponse,
          ]);
        } catch (error) {
          console.log(error);
        }
      }
    }

    setDates(props.dates); // Update here to avoid new date showing first
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      getInsights();
    }, 1000); // Delay to avoid unnecessary calls when the calendar is swiped quickly

    return () => clearTimeout(timeout);
  }, [JSON.stringify(props.checkIns)]);

  return (
    <View style={{ width: "100%", minHeight: Device.deviceType !== 1 ? 192 : 208 }}>
      {isLoading ? (
        <View style={styles.loading}>
          <Loading text="Generating insights" />
        </View>
      ) : (
        <Summary text={text} getInsights={getInsights} dates={dates} checkIns={props.checkIns} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
