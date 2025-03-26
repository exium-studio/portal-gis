import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { CHART_COLORS } from "@/constants/chartColors";
import {
  PRESET_DONUT_CHART_TOOLTIP,
  PRESET_DOUGHNUT_CHART,
} from "@/constants/presetProps";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { Circle, HStack, Icon, StackProps, Text } from "@chakra-ui/react";
import { IconFriends } from "@tabler/icons-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PopulationCategoriesOptions from "../PopulationCategoriesOptions";
import { Interface__SelectOption } from "@/constants/interfaces";
import calculatePercentage from "@/utils/calculatePercentage";

const CurrentPopulationDonutChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const [category, setCategory] = useState<
    Interface__SelectOption[] | undefined
  >([
    {
      id: "religion",
      label: l.religion,
    },
  ]);
  const data = {
    religion: [
      { label: "Islam", total_population: 1231 },
      { label: "Katolik", total_population: 412 },
      { label: "Kristen", total_population: 221 },
      { label: "Hindu", total_population: 52 },
      { label: "Budha", total_population: 75 },
      { label: "Konghucu", total_population: 22 },
    ],
    education: [
      { label: "TK", total_population: 2342 },
      { label: "SD", total_population: 234 },
      { label: "SMP", total_population: 1419 },
      { label: "SMA", total_population: 2419 },
      { label: "SMK", total_population: 419 },
      { label: "D1", total_population: 19 },
      { label: "D2", total_population: 4 },
      { label: "D3", total_population: 23 },
      { label: "D4", total_population: 2 },
      { label: "S1", total_population: 1042 },
      { label: "S2", total_population: 72 },
      { label: "S3", total_population: 1 },
    ],
    married_status: [
      { label: "Kawin", total_population: 1342 },
      { label: "Kawin Belum Tercatat", total_population: 42 },
      { label: "Belum Kawin", total_population: 3634 },
    ],
    citizenship: [
      { label: "WNI", total_population: 4542 },
      { label: "WNA", total_population: 134 },
    ],
    gender: [
      { label: "Laki-laki", total_population: 2342 },
      { label: "Perempuan", total_population: 3419 },
    ],
  };
  const finalData = {
    religion: calculatePercentage(data.religion),
    education: calculatePercentage(data.education),
    married_status: calculatePercentage(data.married_status),
    citizenship: calculatePercentage(data.citizenship),
    gender: calculatePercentage(data.gender),
  };

  console.log("Current Population", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <Icon mb={"2px"}>
            <IconFriends size={20} />
          </Icon>

          <ItemHeaderTitle>{l.current_population}</ItemHeaderTitle>
        </HStack>

        <HStack>
          <Text color={"fg.subtle"}>{l.by}</Text>
          <PopulationCategoriesOptions
            category={category}
            setCategory={setCategory}
          />
        </HStack>
      </ItemHeaderContainer>

      <CContainer flex={1} pb={4} minH={ITEM_BODY_H}>
        {!category && (
          <CContainer p={4} m={"auto"}>
            <FeedbackNoData title="" description={l.please_select_category} />
          </CContainer>
        )}

        {category && (
          <>
            {finalData && (
              <>
                {/* Chart */}
                <CContainer px={4} my={"auto"}>
                  <ResponsiveContainer width={"100%"} height={300}>
                    <PieChart>
                      <Pie
                        data={
                          finalData[category[0].id as keyof typeof finalData]
                        }
                        dataKey="total_population"
                        nameKey="label"
                        {...PRESET_DOUGHNUT_CHART}
                      >
                        {finalData[
                          category[0].id as keyof typeof finalData
                        ].map((_, i) => {
                          return (
                            <Cell
                              key={`cell-${i}`}
                              fill={CHART_COLORS[i % CHART_COLORS.length]}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip {...PRESET_DONUT_CHART_TOOLTIP} />
                    </PieChart>
                  </ResponsiveContainer>
                </CContainer>

                <HStack wrap={"wrap"} justify={"center"} gapX={5} px={4} mt={4}>
                  {finalData[category[0].id as keyof typeof finalData].map(
                    (item, i) => (
                      <HStack key={i}>
                        <Circle
                          w={"8px"}
                          h={"8px"}
                          bg={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                        <HStack>
                          <Text>
                            {item.label} : {item.total_population}
                          </Text>
                          <Text color={"fg.subtle"}>{item.percentage}</Text>
                        </HStack>
                      </HStack>
                    )
                  )}
                </HStack>
              </>
            )}
          </>
        )}
      </CContainer>
    </ItemContainer>
  );
};

export default CurrentPopulationDonutChart;
