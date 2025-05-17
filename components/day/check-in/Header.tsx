import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";
import { Trash2 } from "lucide-react-native";
import MoodsData from "data/moods.json";
import { CheckInMoodType } from "types";
import { pressedDefault, theme } from "utils/helpers";

type HeaderProps = {
  id: number;
  mood: CheckInMoodType;
  date: Date;
  getCheckInData: () => Promise<void>;
};

export default function Header(props: HeaderProps) {
  const colors = theme();
  const router = useRouter();
  const db = useSQLiteContext();
  const time = props.date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const color = MoodsData.filter((mood) => mood.id === props.mood.color)[0];

  const emojis = {
    1: require("../../../assets/img/emoji/small/yellow.png"),
    2: require("../../../assets/img/emoji/small/chartreuse.png"),
    3: require("../../../assets/img/emoji/small/green.png"),
    4: require("../../../assets/img/emoji/small/spring-green.png"),
    5: require("../../../assets/img/emoji/small/cyan.png"),
    6: require("../../../assets/img/emoji/small/azure.png"),
    7: require("../../../assets/img/emoji/small/blue.png"),
    8: require("../../../assets/img/emoji/small/dark-violet.png"),
    9: require("../../../assets/img/emoji/small/dark-magenta.png"),
    10: require("../../../assets/img/emoji/small/dark-rose.png"),
    11: require("../../../assets/img/emoji/small/red.png"),
    12: require("../../../assets/img/emoji/small/orange.png"),
  };

  const confirmDelete = () => {
    Alert.alert("Delete Check-In", "Are you sure you want to delete this check-in? It cannot be recovered.", [
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
      props.getCheckInData();
    } catch (error) {
      console.log(error);
      alert("An unexpected error occurred.");
    }
  };

  const press = () => {
    router.push({
      pathname: "mood",
      params: {
        name: color.name,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingHorizontal: Device.deviceType !== 1 ? 24 : 16 }]}>
      <Pressable
        onPress={press}
        style={({ pressed }) => [pressedDefault(pressed), styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}
        hitSlop={8}
      >
        <Image
          source={emojis[props.mood.color as keyof typeof emojis]}
          style={{ aspectRatio: "1/1", width: Device.deviceType !== 1 ? 44 : 32 }}
        />

        <Text
          style={{ fontFamily: "Tiempos-Bold", color: colors.primary, fontSize: Device.deviceType !== 1 ? 24 : 18 }}
          allowFontScaling={false}
        >
          {time.toLowerCase()}
        </Text>
      </Pressable>

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
