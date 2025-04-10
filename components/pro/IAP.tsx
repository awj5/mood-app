import { useCallback, useContext, useRef, useState } from "react";
import { Platform, View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { useFocusEffect, useRouter } from "expo-router";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DimensionsContext, DimensionsContextType } from "context/dimensions";
import { HomeDatesContext, HomeDatesContextType } from "context/home-dates";
import Footer from "./iap/Footer";
import BigButton from "components/BigButton";
import Product from "./iap/Product";
import { theme, setStoredVal } from "utils/helpers";
import { getMonday } from "utils/dates";

type IAPProps = {
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function IAP(props: IAPProps) {
  const colors = theme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isMountedRef = useRef(true);
  const purchasesRef = useRef<typeof Purchases | null>(null);
  const { dimensions } = useContext<DimensionsContextType>(DimensionsContext);
  const { setHomeDates } = useContext<HomeDatesContextType>(HomeDatesContext);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selected, setSelected] = useState<PurchasesPackage | string | null>(null);
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
      purchasesRef.current = purchases;
      purchases.configure({ apiKey: APIKeys[Platform.OS as keyof typeof APIKeys] });
      const offerings = await purchases.getOfferings();
      setOffering(offerings.current);
      setSelected(offerings.current.availablePackages[0]); // Default selected
    } catch (error) {
      console.log(error);
    }
  };

  const purchase = async () => {
    if (!selected || Constants.appOwnership === "expo") return;
    props.setSubmitting(true);

    try {
      const result = await purchasesRef.current?.purchasePackage(selected as PurchasesPackage);
      const appUserID = result?.customerInfo.originalAppUserId; // Get unique ID from RC
      setStoredVal("pro-id", appUserID as string); // Store RC ID

      // Trigger dashboard refresh
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const monday = getMonday(today);
      setHomeDates({ weekStart: monday, rangeStart: undefined, rangeEnd: undefined });

      /* Alert.alert(
        "You've Gone Pro!",
        "Congratulations - your MOOD.ai Pro subscription is now active. Get ready for deeper, more powerful insights into how you feel each day."
      ); */

      if (isMountedRef.current) router.back(); // Close modal
    } catch (error: any) {
      if (!error.userCancelled && error?.message !== "The payment is pending. The payment is deferred.") {
        console.log(error);
        alert("An unexpected error has occurred.");
      }

      props.setSubmitting(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getOffering();
      return () => (isMountedRef.current = false);
    }, [])
  );

  return (
    <View style={{ padding: spacing, paddingBottom: spacing + insets.bottom, gap: spacing }}>
      <View
        style={[
          styles.wrapper,
          {
            gap: spacing,
            height: Device.deviceType !== 1 ? (dimensions.width > dimensions.height ? 144 : 160) : 112,
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
                selected={(selected as PurchasesPackage)?.product.identifier === item.product.identifier}
                setSelected={setSelected}
                package={item}
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
              price="$149.99"
              cycle="year"
              selected={selected === "com.moodplatforms.moodai.pro.annual"}
              setSelected={setSelected}
            />
          </>
        ) : (
          <ActivityIndicator color={colors.primary === "white" ? "black" : "white"} />
        )}
      </View>

      <View style={{ gap: spacing / 2, paddingHorizontal: spacing }}>
        <BigButton func={purchase} disabled={(Constants.appOwnership !== "expo" && !offering) || props.submitting}>
          Try Pro FREE for 1 week
        </BigButton>

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
