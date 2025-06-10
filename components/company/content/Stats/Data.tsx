import { Text, useColorScheme, View } from "react-native";
import { Activity } from "lucide-react-native";
import { getTheme } from "utils/helpers";

type DataProps = {
  number: string;
  text: string;
  userView?: boolean;
};

export default function Data(props: DataProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={{ gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" }}>
      {props.userView && (
        <Activity
          color="black"
          size={theme.icon.small.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.small.stroke}
        />
      )}

      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text
          style={{ fontSize: theme.fontSize.xSmall, fontFamily: "Circular-Bold", color: "black" }}
          allowFontScaling={false}
        >
          {props.number}
        </Text>

        <Text
          style={{ fontSize: theme.fontSize.xSmall, fontFamily: "Circular-Book", color: "black" }}
          allowFontScaling={false}
        >
          {` ${props.text}`}
        </Text>
      </View>
    </View>
  );
}
