import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";
import { Trash2 } from "lucide-react-native";
import { CheckInMoodType } from "data/database";
import { pressedDefault, theme } from "utils/helpers";

type HeaderProps = {
  id: number;
  mood: CheckInMoodType;
  date: Date;
  getData: () => Promise<void>;
};

export default function Header(props: HeaderProps) {
  const colors = theme();
  const db = useSQLiteContext();
  const time = props.date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const emojis = {
    1: require("../../../assets/img/emoji/small/yellow.svg"),
    2: require("../../../assets/img/emoji/small/chartreuse.svg"),
    3: require("../../../assets/img/emoji/small/green.svg"),
    4: require("../../../assets/img/emoji/small/spring-green.svg"),
    5: require("../../../assets/img/emoji/small/cyan.svg"),
    6: require("../../../assets/img/emoji/small/azure.svg"),
    7: require("../../../assets/img/emoji/small/blue.svg"),
    8: require("../../../assets/img/emoji/small/dark-violet.svg"),
    9: require("../../../assets/img/emoji/small/dark-magenta.svg"),
    10: require("../../../assets/img/emoji/small/dark-rose.svg"),
    11: require("../../../assets/img/emoji/small/red.svg"),
    12: require("../../../assets/img/emoji/small/orange.svg"),
  };

  const confirmDelete = () => {
    Alert.alert("Delete check-in", "Are you sure you want to delete this check-in? It cannot be recovered.", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Delete", onPress: remove, style: "destructive" },
    ]);
  };

  const remove = async () => {
    try {
      // Delete check-in
      const query = `
        DELETE FROM check_ins WHERE id = ?
      `;

      await db.runAsync(query, [props.id]);
      props.getData();
    } catch (error) {
      console.log(error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: Device.deviceType !== 1 ? 24 : 16 }]}>
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
        <Image
          source={emojis[props.mood.color as keyof typeof emojis]}
          style={{ aspectRatio: "1/1", width: Device.deviceType !== 1 ? 44 : 32 }}
        />

        <Text
          style={{ fontFamily: "Circular-Book", color: colors.primary, fontSize: Device.deviceType !== 1 ? 24 : 18 }}
          allowFontScaling={false}
        >
          {time}
        </Text>
      </View>

      <Pressable onPress={confirmDelete} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
        <Trash2
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
