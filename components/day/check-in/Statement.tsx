import { useEffect, useState } from "react";
import { Text, useColorScheme } from "react-native";
import tagsData from "data/tags.json";
import { CheckInMoodType } from "types";
import { getMostCommon, getTheme } from "utils/helpers";
import { getStatement } from "utils/data";

type StatementProps = {
  mood: CheckInMoodType;
};

export default function Statement(props: StatementProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [statement, setStatement] = useState("");

  useEffect(() => {
    const tagTypes = [];

    // Loop selected tags and get type (pos/neg)
    for (const tag of props.mood.tags) {
      const type = tagsData.filter((item) => item.id === tag)[0].type;
      tagTypes.push(type);
    }

    //const primaryTagType = getMostCommon(tagTypes); // Determine if pos or neg statement should be shown
    //const response = primaryTagType === "neg" ? 1 - props.mood.statementResponse : props.mood.statementResponse;
    //setStatement(getStatement(props.mood.competency, response, primaryTagType, props.mood.company));
    setStatement(getStatement(props.mood.competency, props.mood.statementResponse, "pos", props.mood.company));
  }, []);

  return (
    <Text
      style={{
        fontFamily: "Circular-Book",
        color: theme.color.primary,
        fontSize: theme.fontSize.body,
        paddingHorizontal: theme.spacing.base,
      }}
      allowFontScaling={false}
    >
      {statement}
    </Text>
  );
}
