import { useState } from "react";
import { Pressable, StyleSheet, SafeAreaView, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import * as Device from "expo-device";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "components/Button";
import { theme, pressedDefault } from "utils/helpers";

export default function DateFilters() {
  const colors = theme();
  const router = useRouter();
  //const [date, setDate] = useState(new Date(1598051730000));

  /*const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };*/

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Date Filters",
          headerLargeTitle: true,
          headerRight: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
              <Text style={[styles.headerText, { fontSize: Device.deviceType !== 1 ? 20 : 16, color: colors.primary }]}>
                Done
              </Text>
            </Pressable>
          ),
        }}
      />

      <View style={[{ padding: Device.deviceType !== 1 ? 24 : 16, gap: Device.deviceType !== 1 ? 24 : 16 }]}>
        <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
          <Button text="This week"></Button>
          <Button text="Last week"></Button>
        </View>

        <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
          <Button text="This month"></Button>
          <Button text="Last month"></Button>
        </View>

        <View style={[styles.row, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
          <Button text="Past 6 months"></Button>
          <Button text="Past year"></Button>
        </View>

        {/*<DateTimePicker testID="dateTimePicker" value={date} mode="date" is24Hour={true} onChange={onChange} />*/}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerText: {
    fontFamily: "Circular-Book",
  },
  row: {
    flexDirection: "row",
  },
});
