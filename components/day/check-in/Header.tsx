import { View, Text, Pressable, Alert, useColorScheme } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";
import { Trash2 } from "lucide-react-native";
import MoodsData from "data/moods.json";
import { CheckInMoodType } from "types";
import { getTheme, pressedDefault } from "utils/helpers";

type HeaderProps = {
  id: number;
  mood: CheckInMoodType;
  date: Date;
  getCheckIns: () => Promise<void>;
};

export default function Header(props: HeaderProps) {
  const router = useRouter();
  const db = useSQLiteContext();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const utc = new Date(`${props.date}Z`);
  const local = new Date(utc);
  const time = local.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
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

  const confirm = () => {
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
      props.getCheckIns(); // Reload day
    } catch (error) {
      console.error(error);
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
    <View
      style={{
        paddingHorizontal: theme.spacing.base,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        onPress={press}
        style={({ pressed }) => [
          pressedDefault(pressed),
          { gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" },
        ]}
        hitSlop={8}
      >
        <Image
          source={emojis[props.mood.color as keyof typeof emojis]}
          style={{ aspectRatio: "1/1", width: Device.deviceType === 1 ? 32 : 44 }}
        />

        <Text
          style={{
            fontFamily: "Circular-Bold",
            color: theme.color.primary,
            fontSize: theme.fontSize.large,
          }}
          allowFontScaling={false}
        >
          {time}
        </Text>
      </Pressable>

      <Pressable onPress={confirm} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
        <Trash2
          color={theme.color.primary}
          size={theme.icon.base.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.base.stroke}
        />
      </Pressable>
    </View>
  );
}
