import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { getLocales } from "expo-localization";
import axios from "axios";
import MoodsData from "data/moods.json";
import { CheckInMoodType, CheckInType, InsightType } from "data/database";
import { CalendarDatesType } from "context/home-dates";
import Loading from "components/Loading";
import Summary from "components/Summary";
import { getPromptData, PromptDataType } from "utils/data";
import { getStoredVal, removeStoredVal } from "utils/helpers";

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

  const requestAISummary = async (promptData: PromptDataType[], uuid: string) => {
    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production" ? "https://mood.ai/api/ai" : "http://localhost:3000/api/ai",
        {
          type: "summarize_check_ins",
          uuid: uuid,
          message: [
            {
              role: "user",
              content: `Please analyze these check-ins: ${JSON.stringify(promptData)}.`,
            },
          ],
          loc: localization[0].languageTag,
        }
      );

      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // User doesn't exist so remove stored UUID and company-name
        removeStoredVal("uuid");
        removeStoredVal("company-name");
        removeStoredVal("send-check-ins");
      }

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
    const promptData = getPromptData(props.checkIns);
    const savedResponse = await getInsightsData(promptData.ids);
    const uuid = await getStoredVal("uuid"); // Check if customer employee

    // Show saved response if exists or get response from API
    if (savedResponse && latestQueryRef.current === currentQuery) {
      setText(savedResponse.summary);
    } else if (latestQueryRef.current === currentQuery && uuid) {
      let aiResponse = await requestAISummary(promptData.data, uuid);

      if (aiResponse && latestQueryRef.current === currentQuery) {
        // Get mood scores
        const satisfaction = [];
        const energy = [];

        // Loop check-ins and get mood satisfaction and energy scores
        for (let i = 0; i < props.checkIns.length; i++) {
          let mood: CheckInMoodType = JSON.parse(props.checkIns[i].mood);
          satisfaction.push(MoodsData.filter((item) => item.id === mood.color)[0].satisfaction);
          energy.push(MoodsData.filter((item) => item.id === mood.color)[0].energy);
        }

        // Calculate averages
        const avgSatisfaction = Math.floor(satisfaction.reduce((sum, num) => sum + num, 0) / satisfaction.length);
        const avgEnergy = Math.floor(energy.reduce((sum, num) => sum + num, 0) / energy.length);

        aiResponse =
          aiResponse +
          ` Overall, you've felt ${describeMoodScore(
            avgSatisfaction
          )} in satisfaction (${avgSatisfaction}%) and ${describeMoodScore(avgEnergy)} in energy (${avgEnergy}%).`;

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
    <View style={{ flex: 1, minHeight: Device.deviceType !== 1 ? 160 : 176 }}>
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
