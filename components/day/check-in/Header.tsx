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
  getCheckInData: () => Promise<void>;
};

export default function Header(props: HeaderProps) {
  const colors = theme();
  const db = useSQLiteContext();
  const time = props.date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const emojisBlack = {
    1: require("../../../assets/img/emoji/small/black/yellow.svg"),
    2: require("../../../assets/img/emoji/small/black/chartreuse.svg"),
    3: require("../../../assets/img/emoji/small/black/green.svg"),
    4: require("../../../assets/img/emoji/small/black/spring-green.svg"),
    5: require("../../../assets/img/emoji/small/black/cyan.svg"),
    6: require("../../../assets/img/emoji/small/black/azure.svg"),
    7: require("../../../assets/img/emoji/small/black/blue.svg"),
    8: require("../../../assets/img/emoji/small/black/dark-violet.svg"),
    9: require("../../../assets/img/emoji/small/black/dark-magenta.svg"),
    10: require("../../../assets/img/emoji/small/black/dark-rose.svg"),
    11: require("../../../assets/img/emoji/small/black/red.svg"),
    12: require("../../../assets/img/emoji/small/black/orange.svg"),
  };

  const emojisWhite = {
    1: require("../../../assets/img/emoji/small/white/yellow.svg"),
    2: require("../../../assets/img/emoji/small/white/chartreuse.svg"),
    3: require("../../../assets/img/emoji/small/white/green.svg"),
    4: require("../../../assets/img/emoji/small/white/spring-green.svg"),
    5: require("../../../assets/img/emoji/small/white/cyan.svg"),
    6: require("../../../assets/img/emoji/small/white/azure.svg"),
    7: require("../../../assets/img/emoji/small/white/blue.svg"),
    8: require("../../../assets/img/emoji/small/white/dark-violet.svg"),
    9: require("../../../assets/img/emoji/small/white/dark-magenta.svg"),
    10: require("../../../assets/img/emoji/small/white/dark-rose.svg"),
    11: require("../../../assets/img/emoji/small/white/red.svg"),
    12: require("../../../assets/img/emoji/small/white/orange.svg"),
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
      props.getCheckInData();
    } catch (error) {
      console.log(error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: Device.deviceType !== 1 ? 24 : 16 }]}>
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 12 : 8 }]}>
        <Image
          source={
            colors.primary === "black"
              ? emojisBlack[props.mood.color as keyof typeof emojisBlack]
              : emojisWhite[props.mood.color as keyof typeof emojisWhite]
          }
          style={{ aspectRatio: "1/1", width: Device.deviceType !== 1 ? 44 : 32 }}
        />

        <Text
          style={{ fontFamily: "Circular-Medium", color: colors.primary, fontSize: Device.deviceType !== 1 ? 24 : 18 }}
          allowFontScaling={false}
        >
          {time.toLocaleLowerCase()}
        </Text>
      </View>

      <Pressable onPress={confirmDelete} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
        <Trash2
          color={colors.primary === "white" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"}
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
