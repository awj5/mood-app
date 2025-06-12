import { useContext } from "react";
import { Text, Pressable, View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { CompanyFiltersContext, CompanyFiltersContextType, CompanyFiltersType } from "context/company-filters";
import { pressedDefault, getTheme } from "utils/helpers";

type LinkProps = {
  title: string;
};

export default function Link(props: LinkProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const { companyFilters } = useContext<CompanyFiltersContextType>(CompanyFiltersContext);
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
      style={({ pressed }) => [
        pressedDefault(pressed),
        { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
      ]}
      hitSlop={16}
    >
      <Text
        style={{
          color: theme.color.primary,
          fontFamily: "Circular-Medium",
          fontSize: theme.fontSize.body,
        }}
        allowFontScaling={false}
      >
        {props.title}
      </Text>

      <View style={{ gap: theme.spacing.small / 2, flexDirection: "row", alignItems: "center" }}>
        {count ? (
          <Text
            style={{
              color: theme.color.primary,
              fontFamily: "Circular-Book",
              fontSize: theme.fontSize.body,
            }}
            allowFontScaling={false}
          >
            {count}
          </Text>
        ) : null}

        <ChevronRight
          color={theme.color.secondary}
          size={theme.icon.base.size}
          absoluteStrokeWidth
          strokeWidth={theme.icon.base.stroke}
        />
      </View>
    </Pressable>
  );
}
