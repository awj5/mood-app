import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import Icon from "./response/Icon";
import { theme } from "utils/helpers";

type ResponseProps = {
  text: string;
  latest: boolean;
};

export default function Response(props: ResponseProps) {
  const colors = theme();
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [generating, setGenerating] = useState(false);

  const words = props.text
    .replace(/\n\n/g, " \n\n") // Handle double linebreaks
    .replace(/(?<!\n)\n(?!\n)/g, " \n") // Handle single linebreaks (exclude doubles)
    .split(" ");

  useEffect(() => {
    // Type out word by word
    const timer = setTimeout(() => {
      if (props.latest && index < words.length) {
        setDisplayedText((prev) => prev + words[index] + " ");
        setGenerating(true);
        setIndex(index + 1);
      } else {
        setDisplayedText(props.text);
        setGenerating(false); // Finished
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <View
      style={{
        flexDirection: "row",
        padding: Device.deviceType !== 1 ? 24 : 16,
        gap: Device.deviceType !== 1 ? 16 : 12,
      }}
    >
      <Icon generating={generating} />

      <Text
        style={[
          styles.text,
          {
            color: colors.primary,
            fontSize: Device.deviceType !== 1 ? 20 : 16,
          },
        ]}
      >
        {displayedText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
    fontFamily: "Circular-Book",
    maxWidth: 512,
  },
});
