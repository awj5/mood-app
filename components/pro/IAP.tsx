import { useContext, useEffect, useState } from "react";
import { Platform, View, ActivityIndicator, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { PurchasesOffering } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import Footer from "./iap/Footer";
import Button from "components/Button";
import Product from "./iap/Product";
import { theme } from "utils/helpers";

export default function IAP() {
  const colors = theme();
  const insets = useSafeAreaInsets();
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selected, setSelected] = useState("");
  const spacing = Device.deviceType !== 1 ? 24 : 16;

  const APIKeys = {
    ios: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY!,
    android: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY!,
  };

  const getOffering = async () => {
    if (Constants.appOwnership === "expo") {
      // Is Expo Go
      setSelected("com.moodplatforms.moodai.pro.monthly");
      return;
    }

    try {
      const purchasesModule = require("react-native-purchases");
      const purchases = purchasesModule.default;
      purchases.configure({ apiKey: APIKeys[Platform.OS as keyof typeof APIKeys] });
      const offerings = await purchases.getOfferings();
      setOffering(offerings.current);
      setSelected(offerings.current.availablePackages[0].product.identifier);
    } catch (error) {
      console.warn("RevenueCat not available or failed:", error);
    }
  };

  useEffect(() => {
    getOffering();
  }, []);

  return (
    <View style={{ padding: spacing, paddingBottom: spacing + insets.bottom, gap: spacing }}>
      <View
        style={[
          styles.wrapper,
          {
            gap: spacing,
            height: Device.deviceType !== 1 ? (dimensions.width > dimensions.height ? 128 : 160) : 112,
          },
        ]}
      >
        {offering ? (
          <>
            {offering?.availablePackages.map((item) => (
              <Product
                key={item.product.identifier}
                id={item.product.identifier}
                title={item.packageType}
                price={
                  item.packageType === "MONTHLY" ? item.product.pricePerMonthString : item.product.pricePerYearString
                }
                cycle={item.packageType === "MONTHLY" ? "month" : "year"}
                selected={selected === item.product.identifier}
                setSelected={setSelected}
              />
            ))}
          </>
        ) : Constants.appOwnership === "expo" ? (
          <>
            <Product
              id="com.moodplatforms.moodai.pro.monthly"
              title="MONTHLY"
              price="$14.99"
              cycle="month"
              selected={selected === "com.moodplatforms.moodai.pro.monthly"}
              setSelected={setSelected}
            />

            <Product
              id="com.moodplatforms.moodai.pro.annual"
              title="ANNUAL"
              price="$159.99"
              cycle="year"
              selected={selected === "com.moodplatforms.moodai.pro.annual"}
              setSelected={setSelected}
            />
          </>
        ) : (
          <ActivityIndicator color={colors.primary === "white" ? "black" : "white"} />
        )}
      </View>

      <View style={{ gap: spacing / 2 }}>
        <Button fill disabled={Constants.appOwnership !== "expo" && !offering}>
          Try it FREE for 1 week
        </Button>

        <Footer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
