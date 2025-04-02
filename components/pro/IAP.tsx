import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { PurchasesOffering } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BigButton from "components/BigButton";

export default function IAP() {
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const insets = useSafeAreaInsets();
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const APIKeys = {
    ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY!,
    android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY!,
  };

  const getOffering = async () => {
    if (Constants.appOwnership === "expo") return; // Is Expo Go

    try {
      const purchasesModule = require("react-native-purchases");
      const purchases = purchasesModule.default;
      purchases.configure({ apiKey: APIKeys[Platform.OS as keyof typeof APIKeys] });
      const offerings = await purchases.getOfferings();
      setOffering(offerings.current);
    } catch (error) {
      console.warn("RevenueCat not available or failed:", error);
    }
  };

  useEffect(() => {
    getOffering();
  }, []);

  return (
    <View style={{ padding: spacing, paddingBottom: spacing + insets.bottom }}>
      {Constants.appOwnership !== "expo" ? (
        <>
          {offering?.availablePackages.map((item) => {
            return <BigButton key={item.product.identifier}>{item.product.title}</BigButton>;
          })}
        </>
      ) : (
        <BigButton>Try free for 1 week</BigButton>
      )}
    </View>
  );
}
