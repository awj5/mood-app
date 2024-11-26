import { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Device from "expo-device";
import axios from "axios";
import { Sparkles } from "lucide-react-native";
import { CheckInType } from "data/database";
import Loading from "components/Loading";
import { theme } from "utils/helpers";

type InsightsProps = {
  checkIns: CheckInType[];
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
    //const aiResponse = await callAPI("Say this is a test!");
    //console.log(aiResponse.choices[0].message.content);
    // !!!!!! Check cache and if online before calling API
    // 255 chars
    setText(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec suscipit nulla. Aenean vel velit ac augue fringilla dignissim. Nullam in felis vitae urna dictum pulvinar. Sed convallis, lorem non efficitur euismod, libero risus tincidunt justo, ut finibus neque purus eget nunc."
    );
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
        <View
          style={{
            gap: gap,
            alignItems: "center",
          }}
        >
          <View style={[styles.title, { gap: gap }]}>
            <Sparkles
              color={colors.primary}
              size={Device.deviceType !== 1 ? 28 : 20}
              absoluteStrokeWidth
              strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
            />

            <Text
              style={{
                fontFamily: "Circular-Bold",
                color: colors.primary,
                fontSize: Device.deviceType !== 1 ? 18 : 14,
              }}
              allowFontScaling={false}
            >
              INSIGHTS
            </Text>
          </View>

          <Text
            style={[
              styles.text,
              {
                color: text ? colors.primary : colors.primary === "white" ? "#999999" : "#666666",
                fontSize: Device.deviceType !== 1 ? 20 : 16,
              },
            ]}
            allowFontScaling={false}
          >
            {text.slice(0, 300)}
          </Text>
        </View>
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
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
