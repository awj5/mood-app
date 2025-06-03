import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import MoodsData from "data/moods.json";
import Loading from "components/Loading";
import Summary from "components/Summary";
import { CalendarDatesType, CheckInType, CheckInMoodType } from "types";
import { getPromptCheckIns, requestAIResponse } from "utils/data";
import { getStoredVal } from "utils/helpers";

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

  const getInsightsData = async (ids: number[]) => {
    try {
      const row: InsightType | null = await db.getFirstAsync(
        `SELECT * FROM insights WHERE check_ins = ?`,
        ids.toString()
      );

      return row;
    } catch (error) {
      console.error(error);
    }
  };

  const getInsights = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    setIsLoading(true);
    setText("");
    const promptData = getPromptCheckIns(props.checkIns); // Format for AI
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
      let aiResponse = await requestAIResponse(
        "summarize_check_ins",
        [
          {
            role: "user",
            content: `Please analyze these check-ins: ${JSON.stringify(promptData)}.`,
          },
        ],
        uuid,
        proID
      );

      if (aiResponse && latestQueryRef.current === currentQuery) {
        // Get mood scores
        const stress = [];
        const energy = [];

        // Loop check-ins and get mood satisfaction and energy scores
        for (const checkIn of props.checkIns) {
          const mood: CheckInMoodType = JSON.parse(checkIn.mood);
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
          console.error(error);
        }
      }
    }

    setDates(props.dates); // Update here to avoid new date showing before text set
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(() => {
      getInsights();
    }, 500); // Delay to avoid unnecessary calls when the calendar is swiped quickly

    return () => clearTimeout(timeout);
  }, [JSON.stringify(props.checkIns)]);

  return (
    <View style={{ minHeight: Device.deviceType === 1 ? 208 : 192 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Loading text="Generating insights" />
        </View>
      ) : (
        <Summary text={text} getInsights={getInsights} dates={dates} checkIns={props.checkIns} />
      )}
    </View>
  );
}
