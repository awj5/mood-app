import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import axios from "axios";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { CheckInMoodType, CheckInType } from "data/database";
import Loading from "components/Loading";
import Summary from "./insights/Summary";
import { getStatement } from "utils/helpers";

type PromptDataType = {
  date: string;
  time: string;
  feelings: string[];
  statement: string;
};

type InsightsProps = {
  checkIns: CheckInType[];
};

export default function Insights(props: InsightsProps) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const callAIAPI = async (promptData: PromptDataType[]) => {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Your primary purpose is to analyze workplace mood check-ins shared with you. Each check-in includes the date and time, a list of feelings, and a statement reflecting the user's thoughts. Provide concise, insightful analyses, highlighting patterns, trends, or potential areas for improvement. Speak directly to the user in an empathetic and professional tone.",
            },
            {
              role: "user",
              content:
                "Analyze these check-ins and summarize the key trends, patterns, or observations in 200 characters or less: " +
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
  };

  const getInsights = async () => {
    setIsLoading(true);
    // !!!!!! Check cache first
    const promptData: PromptDataType[] = [];

    // Loop check-ins and create prompt objects
    for (let i = 0; i < props.checkIns.length; i++) {
      let checkIn = props.checkIns[i];
      let utc = new Date(`${checkIn.date}Z`);
      let local = new Date(utc);
      let mood: CheckInMoodType = JSON.parse(checkIn.mood);
      let tags: string[] = [];

      // Get tag names
      for (let i = 0; i < mood.tags.length; i++) {
        tags.push(tagsData.filter((tag) => tag.id === mood.tags[i])[0].name);
      }

      promptData.push({
        date: local.toDateString(),
        time: local.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
        feelings: tags,
        statement: getStatement(
          guidelinesData[0].competencies.filter((item) => item.id === mood.competency)[0].response,
          mood.statementResponse
        ),
      });
    }

    //const aiResponse = await callAIAPI(promptData);
    //setText(aiResponse ? aiResponse.choices[0].message.content : "");
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
    <View style={[styles.container, { height: Device.deviceType !== 1 ? 144 : 160 }]}>
      {isLoading ? (
        <View style={styles.loading}>
          <Loading text="Generating" />
        </View>
      ) : (
        <Summary text={text} getInsights={getInsights} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 672 + 32,
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
