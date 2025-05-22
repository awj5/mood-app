import { View, Text, Pressable, Alert, useColorScheme } from "react-native";
import { LogOut } from "lucide-react-native";
import { pressedDefault, removeAccess, getTheme } from "utils/helpers";

type CompanyProps = {
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
};

export default function Company(props: CompanyProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);

  const remove = async () => {
    removeAccess();
    props.setCompany(""); // Hide section
  };

  const press = () => {
    Alert.alert(
      "Remove Company",
      `By tapping 'Remove,' you will lose access to ${props.company}'s insights and MOOD.ai Pro features. Are you sure you want to remove ${props.company}?`,
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Remove", onPress: remove, style: "destructive" },
      ]
    );
  };

  return (
    <View style={{ gap: theme.spacing.base, flexDirection: "row", justifyContent: "space-between" }}>
      <Text
        style={{
          color: theme.color.primary,
          fontFamily: "Circular-Medium",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        Your Company
      </Text>

      <Pressable
        onPress={press}
        style={({ pressed }) => [
          pressedDefault(pressed),
          { gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" },
        ]}
        hitSlop={16}
      >
        <LogOut
          color={theme.color.primary}
          size={theme.icon.base.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.base.stroke}
        />

        <Text
          style={{
            color: theme.color.primary,
            fontFamily: "Circular-Book",
            fontSize: theme.fontSize.body,
          }}
          allowFontScaling={false}
        >
          {props.company}
        </Text>
      </Pressable>
    </View>
  );
}
