import { View, StyleSheet } from "react-native";
import * as Device from "expo-device";
import { CheckInMoodType, CheckInType } from "data/database";
import Header from "./check-in/Header";

type CheckInProps = {
  data: CheckInType;
  itemHeight: number;
  getData: () => Promise<void>;
};

export default function CheckIn(props: CheckInProps) {
  const mood: CheckInMoodType = JSON.parse(props.data.mood);
  const utc = new Date(`${props.data.date}Z`);
  const local = new Date(utc);

  return (
    <View style={{ paddingVertical: Device.deviceType !== 1 ? 24 : 16, height: props.itemHeight }}>
      <Header id={props.data.id} mood={mood} date={local} getData={props.getData} />
    </View>
  );
}

const styles = StyleSheet.create({});
