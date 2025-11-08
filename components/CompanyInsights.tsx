import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import * as Device from "expo-device";
import axios from "axios";
import Loading from "components/Loading";
import Summary from "components/Summary";
import { CalendarDatesType, CompanyCheckInType } from "types";
import { generateHash, getPromptCheckIns, requestAIResponse } from "utils/data";
import { getStoredVal, removeAccess } from "utils/helpers";

type CompanyInsightsProps = {
  checkIns: CompanyCheckInType[];
  dates: CalendarDatesType;
  category?: number;
};

export default function CompanyInsights(props: CompanyInsightsProps) {
  const latestQueryRef = useRef<symbol>(null);
  const [text, setText] = useState("");
  const [dates, setDates] = useState<CalendarDatesType>(props.dates);
  const [isLoading, setIsLoading] = useState(true);
  const isSimulator = Device.isDevice === false;

  const getStoredInsights = async (hash: string, uuid: string) => {
    try {
      const response = await axios.post(
        !isSimulator ? "https://www.moodcheck.co/api/insights" : "http://localhost:3000/api/insights",
        {
          uuid: uuid,
          hash: hash,
          ...(props.category && { category: props.category }),
        }
      );

      return response.data[0];
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) removeAccess(); // User doesn't exist
      console.error(error);
    }
  };

  const getInsights = async () => {
    const currentQuery = Symbol("currentQuery");
    latestQueryRef.current = currentQuery;
    setIsLoading(true);
    setText("");
    const promptData = getPromptCheckIns(props.checkIns); // Format for AI
    const hash = await generateHash(promptData.ids);
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const company = await getStoredVal("company-name");

    if (uuid) {
      const savedResponse = await getStoredInsights(hash, uuid);

      // Show saved response if exists or get response from API
      if (savedResponse && latestQueryRef.current === currentQuery) {
        setText(savedResponse.summary);
      } else if (latestQueryRef.current === currentQuery) {
        const aiResponse = await requestAIResponse(
          "summarize_company_check_ins",
          [
            {
              role: "user",
              content: `Please analyze these check-ins from employees at ${company}: ${JSON.stringify(
                promptData.data
              )}.`,
            },
          ],
          uuid,
          null,
          props.category
        );

        if (aiResponse && latestQueryRef.current === currentQuery) {
          setText(aiResponse);

          // Save response to Supabase
          try {
            await axios.post(
              !isSimulator ? "https://www.moodcheck.co/api/insights/save" : "http://localhost:3000/api/insights/save",
              {
                uuid: uuid,
                hash: hash,
                summary: aiResponse,
                ...(props.category && { category: props.category }),
              }
            );
          } catch (error) {
            console.error(error);
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
    <View style={{ minHeight: Device.deviceType === 1 ? 208 : 192 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
