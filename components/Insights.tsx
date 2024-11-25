import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import * as Device from "expo-device";
import axios from "axios";
import { Sparkles } from "lucide-react-native";
import { CheckInType } from "data/database";
import Loading from "./Loading";
import { theme } from "utils/helpers";

type InsightsProps = {
  checkIns?: CheckInType[];
  checkInData?: CheckInType;
  centered?: boolean;
};

export default function Insights(props: InsightsProps) {
  const colors = theme();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const gap = Device.deviceType !== 1 ? 6 : 4;

  const callAPI = async (prompt: string) => {
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
                "You are a helpful and empathetic assistant specializing in mental health in the workplace. You provide evidence-based advice, practical strategies, and emotional support tailored to improving well-being and productivity. Maintain a professional yet approachable tone and adapt your responses to the specific needs of the user.",
            },
            {
              role: "user",
              content: prompt,
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
      return null;
    }
  };

  const getInsights = () => {
    var insights = "";

    if (props.checkInData) {
      // If no note, check if AI summary saved locally
      insights = props.checkInData.note ? props.checkInData.note : "";
    } else {
      //const aiResponse = await callAPI("Say this is a test!");
      //console.log(aiResponse.choices[0].message.content);
      // !!!!!! Check cache and if online
      insights =
        "Lorem ipsum dolor sit amet, workplace well-being consectetur adipiscing elit. Morbi tempus felis non arcu gravida, id sollicitudin turpis viverra. Sed ut nibh at risus efficitur facilisis vitae sit amet massa. Nullam ultricies sapien nec purus viverra volutpat.";
    }

    setText(insights);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);

    const timeout = setTimeout(
      () => {
        getInsights();
      },
      props.checkIns ? 1000 : 0 // Add delay if calling API
    );

    return () => clearTimeout(timeout);
  }, [JSON.stringify(props.checkIns)]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={styles.loading}>
          <Loading text="Generating" />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            gap: gap,
            alignItems: props.centered ? "center" : "stretch",
          }}
        >
          <View style={[styles.title, { gap: gap }]}>
            <Sparkles
              color={colors.primary}
              size={Device.deviceType !== 1 ? 28 : 20}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
              style={{ display: props.checkInData?.note || (props.checkInData && !text) ? "none" : "flex" }}
            />

            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 18 : 14,
              }}
              allowFontScaling={false}
            >
              {props.checkInData?.note || (props.checkInData && !text) ? "NOTE" : "INSIGHTS"}
            </Text>
          </View>

          <ScrollView>
            <Text
              style={{
                fontFamily: "Circular-Book",
                color: text ? colors.primary : colors.primary === "white" ? "#999999" : "#666666",
                fontSize: Device.deviceType !== 1 ? 20 : 16,
                textAlign: props.centered ? "center" : "left",
              }}
              allowFontScaling={false}
            >
              {text ? text : "Not found"}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
