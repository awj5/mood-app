import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { useSQLiteContext } from "expo-sqlite";
import { getLocales } from "expo-localization";
import axios from "axios";
import { CheckInType, InsightType } from "data/database";
import { CalendarDatesType } from "context/home-dates";
import Loading from "components/Loading";
import Summary from "components/Summary";
import { getPromptData, PromptDataType } from "utils/helpers";

type InsightsProps = {
  checkIns: CheckInType[];
  dates: CalendarDatesType;
};

export default function Insights(props: InsightsProps) {
  const db = useSQLiteContext();
  //const localization = getLocales();
  const latestQueryRef = useRef<symbol>();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  //const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  /* const requestAISummary = async (promptData: PromptDataType[]) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Your primary purpose is to analyze workplace mood check-ins shared with you. Each check-in includes the date and time, a list of feelings, a statement reflecting the user's thoughts on their workplace, and an optional note providing more context. These check-ins come from multiple anonymous employees, so address the company directly, providing concise and insightful analyses that highlight patterns and trends in their emotional state over time. Avoid offering recommendations, asking follow-up questions, or suggesting areas for improvement. Use an empathetic and professional tone, ensuring your responses are clear, accessible, and relatable. Structure your responses in plain text (no markdown) for easy readability. Adhere to the IETF language tag:${localization[0].languageTag}`,
            },
            {
              role: "user",
              content:
                "Analyze these check-ins (formatted as JSON) and summarize the key trends, patterns, or observations in 200 characters or less: " +
                JSON.stringify(promptData),
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  }; */

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

    // Show saved response if exists or get respponse from API
    if (savedResponse && latestQueryRef.current === currentQuery) {
      setText(savedResponse.summary);
    } else if (latestQueryRef.current === currentQuery) {
      //const aiResponse = await requestAISummary(promptData.data);
      /* if (aiResponse && latestQueryRef.current === currentQuery) {
        setText(aiResponse.choices[0].message.content);

        // Save response
        try {
          await db.runAsync(`INSERT INTO insights (check_ins, summary) VALUES (?, ?)`, [
            promptData.ids.toString(),
            aiResponse.choices[0].message.content,
          ]);
        } catch (error) {
          console.log(error);
        }
      } */
    }

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
    <View style={[styles.container, { minHeight: Device.deviceType !== 1 ? 176 : 192 }]}>
      {isLoading ? (
        <View style={styles.loading}>
          <Loading text="Generating insights" />
        </View>
      ) : (
        <Summary text={text} getInsights={getInsights} dates={props.dates} checkIns={props.checkIns} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 672 + 32,
    paddingHorizontal: 16,
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
