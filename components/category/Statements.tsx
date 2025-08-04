import { useEffect, useState } from "react";
import { View, useColorScheme, Text } from "react-native";
import competenciesData from "data/competencies.json";
import Statement from "./statements/Statement";
import { CompanyCheckInType } from "types";
import { getTheme } from "utils/helpers";

type StatementDataType = {
  id: number;
  text: string;
  average: number;
  count: number;
};

type StatementsProps = {
  checkIns: CompanyCheckInType[];
};

export default function Statements(props: StatementsProps) {
  const colorScheme = useColorScheme();
  const theme = getTheme(colorScheme);
  const [statements, setStatements] = useState<StatementDataType[]>([]);

  useEffect(() => {
    const statementsData: Record<number, { id: number; text: string; responses: number[] }> = {};

    // Loop check-ins and get statement responses
    for (const checkIn of props.checkIns) {
      const id = checkIn.value.competency;
      const response = checkIn.value.statementResponse;
      const data = competenciesData[0].competencies.filter((item) => item.id === id)[0];

      if (!statementsData[id]) {
        statementsData[id] = { id: id, text: data.posStatement, responses: [response] }; // Create record
      } else {
        statementsData[id].responses.push(response); // Add response
      }
    }

    const averaged: StatementDataType[] = Object.values(statementsData).map(({ id, text, responses }) => {
      const average = responses.reduce((sum, val) => sum + val, 0) / responses.length;
      return { id, text, average, count: responses.length };
    });

    setStatements(averaged.sort((a, b) => b.count - a.count)); // Order by most responses
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.color.opaqueBg,
        borderRadius: theme.spacing.base,
        padding: theme.spacing.base,
        gap: theme.spacing.base,
      }}
    >
      <Text
        style={{
          fontFamily: "Circular-Bold",
          color: theme.color.primary,
          fontSize: theme.fontSize.xSmall,
        }}
        allowFontScaling={false}
      >
        STATEMENT RESPONSES
      </Text>

      <View>
        {statements.map((item, index) => (
          <View key={item.id}>
            <Statement text={item.text} average={item.average} count={item.count} />

            {index + 1 !== statements.length && (
              <View
                style={{
                  backgroundColor: theme.color.primary,
                  marginVertical: theme.spacing.small,
                  width: "100%",
                  height: 1,
                  opacity: 0.1,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
