import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import * as Device from "expo-device";
import { theme, getStoredVal, setStoredVal, removeStoredVal } from "utils/helpers";

export default function Name() {
  const colors = theme();
  const [text, setText] = useState("");
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  const getName = async () => {
    const name = await getStoredVal("first-name");
    if (name) setText(name);
  };

  const setName = async () => {
    const name = text.substring(0, 30).trim();

    if (!name) {
      removeStoredVal("first-name"); // Name removed
    } else {
      setStoredVal("first-name", name); // Name added
    }
  };

  useEffect(() => {
    getName();
  }, []);

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Medium",
          fontSize: fontSize,
        }}
        allowFontScaling={false}
      >
        Your Name
      </Text>

      <TextInput
        onChangeText={setText}
        value={text}
        placeholder="Enter first name"
        placeholderTextColor={colors.secondary}
        style={[
          styles.input,
          {
            color: colors.primary,
            fontSize: fontSize,
          },
        ]}
        allowFontScaling={false}
        returnKeyType="done"
        onBlur={setName}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    fontFamily: "Circular-Book",
    flex: 1,
    textAlign: "right",
  },
});
