import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { PurchasesOffering } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Footer from "./iap/Footer";
import Button from "components/Button";
import Product from "./iap/Product";

export default function IAP() {
  const insets = useSafeAreaInsets();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
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
    <View style={{ padding: spacing, paddingBottom: spacing + insets.bottom, gap: spacing }}>
      <View style={{ flexDirection: "row", gap: spacing, height: Device.deviceType !== 1 ? 128 : 96 }}>
        {Constants.appOwnership !== "expo" ? (
          <>
            {offering?.availablePackages.map((item) => (
              <Product
                key={item.product.identifier}
                title={item.product.title}
                price={item.product.price}
                cycle="month"
                selected
              />
            ))}
          </>
        ) : (
          Constants.appOwnership === "expo" && (
            <>
              <Product title="MONTHLY" price={14.99} cycle="month" selected />
              <Product title="ANNUAL" price={159.99} cycle="year" selected={false} />
            </>
          )
        )}
      </View>

      <View style={{ gap: spacing / 2 }}>
        <Button fill>Try it FREE for 1 week</Button>
        <Footer />
      </View>
    </View>
  );
}
