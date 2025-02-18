import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import * as Device from "expo-device";
import { LogOut } from "lucide-react-native";
import { theme, removeStoredVal, pressedDefault } from "utils/helpers";

type CompanyProps = {
  company: string;
  setCompany: React.Dispatch<React.SetStateAction<string>>;
};

export default function Company(props: CompanyProps) {
  const colors = theme();
  const fontSize = Device.deviceType !== 1 ? 20 : 16;

  const remove = async () => {
    removeStoredVal("uuid");
    removeStoredVal("company-name");
    props.setCompany(""); // Hide section
  };

  const confirm = () => {
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
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Medium",
          fontSize: fontSize,
        }}
        allowFontScaling={false}
      >
        Your Company
      </Text>

      <Pressable
        onPress={confirm}
        style={({ pressed }) => [pressedDefault(pressed), styles.button, { gap: Device.deviceType !== 1 ? 10 : 6 }]}
        hitSlop={16}
      >
        <LogOut
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />

        <Text
          style={{
            color: colors.primary,
            fontFamily: "Circular-Book",
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          {props.company}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
});
