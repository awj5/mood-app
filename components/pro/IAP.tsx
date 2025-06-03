import { useEffect, useState } from "react";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import * as Device from "expo-device";
import Purchases, { PurchasesOffering, PurchasesPackage } from "react-native-purchases";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Product from "./iap/Product";
import Purchase from "./iap/Purchase";
import { getTheme } from "utils/helpers";

type IAPProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function IAP(props: IAPProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [selected, setSelected] = useState<PurchasesPackage | string | null>();
  const testProducts = false; // Used for testing UI in dev mode

  useEffect(() => {
    (async () => {
      try {
        const offerings = await Purchases.getOfferings();
        setOffering(offerings.current);
        setSelected(offerings.current?.availablePackages[0]); // Default
      } catch (error) {
        console.error(error);
      }

      props.setLoading(false);
    })();
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base / 2,
        paddingBottom:
          insets.bottom && Device.deviceType === 1
            ? insets.bottom + theme.spacing.base
            : insets.bottom
            ? insets.bottom
            : theme.spacing.base,
        gap: Device.deviceType === 1 ? theme.spacing.base : theme.spacing.small,
      }}
    >
      <View
        style={{
          gap: theme.spacing.base,
          height: Device.deviceType === 1 ? 112 : 96,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {offering ? (
          <>
            {offering?.availablePackages.map((item) => (
              <Product
                key={item.product.identifier}
                id={item.product.identifier}
                title={item.packageType.replace("ANNUAL", "YEARLY")}
                price={
                  item.packageType === "MONTHLY" ? item.product.pricePerMonthString : item.product.pricePerYearString
                }
                cycle={item.packageType === "MONTHLY" ? "month" : "year"}
                selected={(selected as PurchasesPackage)?.product.identifier === item.product.identifier}
                setSelected={setSelected}
              />
            ))}
          </>
        ) : testProducts ? (
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
              id="com.moodplatforms.moodai.pro.yearly"
              title="YEARLY"
              price="$149.99"
              cycle="year"
              selected={selected === "com.moodplatforms.moodai.pro.yearly"}
              setSelected={setSelected}
            />
          </>
        ) : (
          <ActivityIndicator color={theme.color.inverted} size="large" />
        )}
      </View>

      <Purchase loading={props.loading} setLoading={props.setLoading} selected={selected} />
    </View>
  );
}
