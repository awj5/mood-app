import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Text, ActivityIndicator } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Network from "expo-network";
import { HeaderBackButton } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import HeaderTitle from "components/HeaderTitle";
import Item from "components/List/Item";
import { getStoredVal, removeAccess, theme } from "utils/helpers";

export type ListItemType = {
  id: number;
  name: string;
};

export default function List() {
  const params = useLocalSearchParams<{ title: string }>();
  const colors = theme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [items, setItems] = useState<ListItemType[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const spacing = Device.deviceType !== 1 ? 24 : 16;
  const dividerStyle = { backgroundColor: colors.secondaryBg, marginVertical: spacing };

  const getItemsData = async (uuid: string) => {
    try {
      const response = await axios.post(
        process.env.NODE_ENV === "production"
          ? `https://mood.ai/api/${params.title.toLowerCase()}`
          : `http://localhost:3000/api/${params.title.toLowerCase()}`,
        {
          uuid: uuid,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // User doesn't exist
        removeAccess();
        alert("Access denied.");
      }

      console.log(error);
    }
  };

  const getItems = async () => {
    const uuid = await getStoredVal("uuid"); // Check if customer employee
    const network = await Network.getNetworkStateAsync();

    if (uuid && network.isInternetReachable) {
      const itemsData = await getItemsData(uuid);
      setItems(itemsData);
    } else if (!network.isInternetReachable) {
      setIsOffline(true);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.dismissAll()}
              label="Back"
              labelStyle={{ fontFamily: "Circular-Book", fontSize: Device.deviceType !== 1 ? 20 : 16 }}
              tintColor={colors.primary}
              allowFontScaling={false}
              style={{ marginLeft: -8 }}
            />
          ),
        }}
      />

      <HeaderTitle text={params.title} />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing,
          paddingTop: spacing * 1.5,
          paddingBottom: insets.bottom + spacing,
          flex: 1,
        }}
      >
        {items?.length ? (
          <>
            {items.map((item, index) => (
              <View key={index}>
                <Item data={item} />
                <View style={[styles.divider, dividerStyle]} />
              </View>
            ))}
          </>
        ) : isOffline ? (
          <View style={styles.wrapper}>
            <Text
              style={[
                styles.text,
                {
                  color: colors.primary,
                  fontSize: Device.deviceType !== 1 ? 20 : 16,
                },
              ]}
            >
              {"You must be online to display\ncompany locations."}
            </Text>
          </View>
        ) : (
          <View style={styles.wrapper}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: "100%",
    height: 1,
  },
  text: {
    opacity: 0.5,
    fontFamily: "Circular-Book",
    textAlign: "center",
  },
});
