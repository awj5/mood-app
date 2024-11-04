import { useState } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme, pressedDefault } from "utils/helpers";

export default function DateFilters() {
  const colors = theme();
  const router = useRouter();
  const [date, setDate] = useState(new Date(1598051730000));

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Date Range",
          headerLargeTitle: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text style={[styles.headerText, { fontSize: Device.deviceType !== 1 ? 24 : 18, color: colors.primary }]}>
                Done
              </Text>
            </Pressable>
          ),
        }}
      />

      <DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: "Circular-Book",
  },
});
