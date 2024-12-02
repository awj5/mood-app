import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import * as Device from "expo-device";
import Icon from "./response/Icon";
import { theme } from "utils/helpers";

type ResponseProps = {
  text: string;
  generating: boolean;
  setGenerating: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Response(props: ResponseProps) {
  const colors = theme();
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  const words = props.text
    .replace(/\n\n/g, " \n\n") // Handle double linebreaks
    .replace(/(?<!\n)\n(?!\n)/g, " \n") // Handle single linebreaks (exclude doubles)
    .split(" ");

  useEffect(() => {
    if (props.text) {
      // Type out word by word
      const timer = setTimeout(() => {
        if (index < words.length) {
          setDisplayedText((prev) => prev + words[index] + " ");
          setIndex(index + 1);
        } else {
          props.setGenerating(false); // Finished
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [index, props.text]);

  return (
    <View
      style={[
        styles.container,
        {
          padding: Device.deviceType !== 1 ? 24 : 16,
          gap: Device.deviceType !== 1 ? 16 : 12,
        },
      ]}
    >
      <Icon generating={props.generating} />

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
  container: {
    flexDirection: "row",
    minHeight: 128,
  },
  text: {
    flexShrink: 1,
    fontFamily: "Circular-Book",
    maxWidth: 512,
  },
});
