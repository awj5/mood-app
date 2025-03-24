import { useContext } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { CompanyFiltersContext, CompanyFiltersContextType, CompanyFiltersType } from "context/company-filters";
import { theme, pressedDefault } from "utils/helpers";

type LinkProps = {
  title: string;
};

export default function Link(props: LinkProps) {
  const colors = theme();
  const router = useRouter();
  const { companyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
  const fontSize = Device.deviceType !== 1 ? 20 : 16;
  const count = companyFilters[props.title.toLowerCase() as keyof CompanyFiltersType].length;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "company-filters/list",
          params: {
            title: props.title,
          },
        })
      }
      style={({ pressed }) => [pressedDefault(pressed), styles.container]}
      hitSlop={16}
    >
      <Text
        style={{
          color: colors.primary,
          fontFamily: "Circular-Medium",
          fontSize: fontSize,
        }}
        allowFontScaling={false}
      >
        {props.title}
      </Text>

      <View style={[styles.count, { gap: Device.deviceType !== 1 ? 10 : 6 }]}>
        {count ? (
          <Text
            style={{
              color: colors.primary,
              fontFamily: "Circular-Book",
              fontSize: fontSize,
            }}
            allowFontScaling={false}
          >
            {count}
          </Text>
        ) : (
          <></>
        )}

        <ChevronRight
          color={colors.primary}
          size={Device.deviceType !== 1 ? 28 : 20}
          absoluteStrokeWidth
          strokeWidth={Device.deviceType !== 1 ? 2 : 1.5}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  count: {
    flexDirection: "row",
    alignItems: "center",
  },
});
