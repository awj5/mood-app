import { useEffect, useState } from "react";
import { View, Text, TextInput, useColorScheme } from "react-native";
import { getStoredVal, setStoredVal, removeStoredVal, getTheme } from "utils/helpers";

export default function Name() {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [text, setText] = useState("");

  const setName = async () => {
    const name = text.substring(0, 30).trim();

    if (!name) {
      removeStoredVal("first-name"); // Name removed
    } else {
      setStoredVal("first-name", name); // Name added
    }
  };

  useEffect(() => {
    (async () => {
      // Check if user has provided their name
      const name = await getStoredVal("first-name");
      if (name) setText(name);
    })();
  }, []);

  return (
    <View
      style={{
        gap: theme.spacing,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={{
          color: theme.color.primary,
          fontFamily: "Circular-Medium",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        Your Name
      </Text>

      <TextInput
        onChangeText={setText}
        value={text}
        placeholder="Enter first name"
        placeholderTextColor={theme.color.secondary}
        style={{
          color: theme.color.primary,
          fontSize: theme.fontSize.body,
          fontFamily: "Circular-Book",
          flex: 1,
          textAlign: "right",
        }}
        allowFontScaling={false}
        returnKeyType="done"
        onBlur={setName}
      />
    </View>
  );
}
