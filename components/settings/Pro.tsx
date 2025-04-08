import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, Platform, Linking } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import * as Application from "expo-application";
import { Sparkles } from "lucide-react-native";
import { theme, pressedDefault, getStoredVal } from "utils/helpers";

export default function Pro() {
  const colors = theme();
  const router = useRouter();
  const fontSize = Device.deviceType !== 1 ? 20 : 16;
  const [pro, setPro] = useState(false);

  const press = () => {
    if (pro) {
      // Has pro
      if (Platform.OS === "ios") {
        Linking.openURL("https://apps.apple.com/account/subscriptions").catch(() => {
          alert("Unable to open account subscriptions.");
        });
      } else {
        const packageName = Application.applicationId;

        Linking.openURL(`https://play.google.com/store/account/subscriptions?package=${packageName}`).catch(() => {
          alert("Unable to open account subscriptions.");
        });
      }
    } else {
      router.push("pro"); // Upsell
    }
  };

  const getPro = async () => {
    const proID = await getStoredVal("pro-id");
    if (proID) setPro(true);
  };

  useEffect(() => {
    getPro();
  }, []);

  return (
    <View style={[styles.container, { gap: Device.deviceType !== 1 ? 24 : 16 }]}>
      <View style={[styles.title, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
        <Sparkles
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />

        <Text
          style={{
            color: colors.primary,
            fontFamily: "Circular-Medium",
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          MOOD.ai Pro
        </Text>
      </View>

      <Pressable onPress={press} style={({ pressed }) => pressedDefault(pressed)} hitSlop={16}>
        <Text
          style={{
            color: colors.link,
            fontFamily: "Circular-Book",
            fontSize: fontSize,
          }}
          allowFontScaling={false}
        >
          {pro ? "Manage" : "Learn more"}
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
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
});
