import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as Device from "expo-device";
import { getLocales } from "expo-localization";
import axios from "axios";
import { CalendarDatesType } from "context/home-dates";
import { CompanyCheckInType } from "app/company";
import Loading from "components/Loading";
import Summary from "components/Summary";
import { getPromptData, PromptDataType } from "utils/data";
import { getStoredVal, removeAccess } from "utils/helpers";

type InsightsProps = {
  checkIns: CompanyCheckInType[];
  dates: CalendarDatesType;
  category?: number;
};

export default function Insights(props: InsightsProps) {
  const localization = getLocales();
  const latestQueryRef = useRef<symbol>();
  const [text, setText] = useState("");
  const [dates, setDates] = useState<CalendarDatesType>(props.dates);
  const [isLoading, setIsLoading] = useState(true);

  const requestAISummary = async (promptData: PromptDataType[], uuid: string, company: string) => {
    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production" ? "https://mood.ai/api/ai" : "http://localhost:3000/api/ai",
        {
          type: "summarize_company_check_ins",
          uuid: uuid,
          message: [
            {
              role: "user",
              content: `Please analyze these check-ins from employees at ${company}: ${JSON.stringify(promptData)}.`,
            },
          ],
          loc: localization[0].languageTag,
          ...(props.category !== undefined && { category: props.category }),
        }
      );

      return response.data.response;
    } catch (error) {
      console.log(error);
    }
  };

  const getInsightsData = async (ids: number[], uuid: string) => {
    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production" ? "https://mood.ai/api/insights" : "http://localhost:3000/api/insights",
        {
          uuid: uuid,
          ids: ids,
          ...(props.category !== undefined && { category: props.category }),
        }
      );

      return response.data[0];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) removeAccess(); // User doesn't exist
      console.log(error);
    }
  };

  const getInsights = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    setIsLoading(true);
    setText("");
    const promptData = getPromptData(props.checkIns);
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const name = await getStoredVal("company-name");

    if (uuid) {
      const savedResponse = await getInsightsData(promptData.ids, uuid);

      // Show saved response if exists or get response from API
      if (savedResponse && latestQueryRef.current === currentQuery) {
        setText(savedResponse.summary);
      } else if (latestQueryRef.current === currentQuery && name) {
        let aiResponse = await requestAISummary(promptData.data, uuid, name);

        if (aiResponse && latestQueryRef.current === currentQuery) {
          setText(aiResponse);

          // Save response to Supabase
          try {
            await axios.post(
              process.env.NODE_ENV === "production"
                ? "https://mood.ai/api/insights/save"
                : "http://localhost:3000/api/insights/save",
              {
                uuid: uuid,
                ids: promptData.ids,
                summary: aiResponse,
                ...(props.category !== undefined && { category: props.category }),
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    setDates(props.dates); // Update here to avoid new date showing first
    setIsLoading(false);
  };

  useEffect(() => {
    getInsights();
  }, [JSON.stringify(props.checkIns)]);

  return (
    <View style={{ flex: 1, minHeight: Device.deviceType !== 1 ? 192 : 208 }}>
      {isLoading ? (
        <View style={styles.loading}>
          <Loading text="Generating insights" />
        </View>
      ) : (
        <Summary
          text={text}
          getInsights={getInsights}
          dates={dates}
          checkIns={props.checkIns}
          category={props.category}
        />
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
