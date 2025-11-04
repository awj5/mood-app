import { Text, useColorScheme, View } from "react-native";
import * as Device from "expo-device";
import { Hand } from "lucide-react-native";
import { StatsDataType } from "components/company/Content";
import { getTheme } from "utils/helpers";

type ParticipationProps = {
  role: string;
  statsData?: StatsDataType;
};

export default function Participation(props: ParticipationProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const score = Math.round(((props.statsData?.active ?? 0) / (props.statsData?.users ?? 0)) * 100);

  // Only show number for admins and managers
  const participation =
    props.role !== "user"
      ? `${score}%`
      : score >= 80
      ? "VERY HIGH"
      : score >= 60
      ? "HIGH"
      : score >= 40
      ? "MODERATE"
      : score >= 20
      ? "LIMITED"
      : "LOW";

  return (
    <View
      style={{
        gap: theme.spacing.base / 2,
        paddingHorizontal: theme.spacing.small,
        height: Device.deviceType === 1 ? 28 : 36,
        flexDirection: "row",
        backgroundColor: theme.color.opaqueBg,
        borderRadius: 999,
        alignSelf: "center",
      }}
    >
      {props.role !== "user" && <Metric data={String(props.statsData?.checkIns)} text="CHECK-INS" />}
      <Metric data={participation} text="PARTICIPATION" userView={props.role === "user"} />
      {props.role !== "user" && <Metric data={`${props.statsData?.participation}%`} text="WEEKLY" />}
    </View>
  );
}

type MetricProps = {
  data: string;
  text: string;
  userView?: boolean;
};

function Metric(props: MetricProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={{ gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" }}>
      {props.userView && (
        <Hand
          color={theme.color.inverted}
          size={theme.icon.small.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.small.stroke}
        />
      )}

      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text
          style={{ fontSize: theme.fontSize.xSmall, fontFamily: "Circular-Bold", color: theme.color.inverted }}
          allowFontScaling={false}
        >
          {props.data}
        </Text>

        <Text
          style={{
            fontSize: props.userView ? theme.fontSize.xSmall : theme.fontSize.xxSmall,
            fontFamily: "Circular-Book",
            color: theme.color.inverted,
          }}
          allowFontScaling={false}
        >
          {` ${props.text}`}
        </Text>
      </View>
    </View>
  );
}
