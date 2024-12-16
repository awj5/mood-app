import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "utils/helpers";

export default function Name() {
  const colors = theme();
  const [text, setText] = useState("");
  const fontSize = Device.deviceType !== 1 ? 24 : 18;

  const setName = async () => {
    try {
      const name = text.substring(0, 30).trim();

      if (!name) {
        await AsyncStorage.removeItem("first-name"); // Name removed
      } else {
        await AsyncStorage.setItem("first-name", name); // Name added
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getName = async () => {
    try {
      const name = await AsyncStorage.getItem("first-name");
      if (name) setText(name);
    } catch (error) {
      console.log(error);
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
