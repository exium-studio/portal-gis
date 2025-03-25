import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { CHART_COLORS } from "@/constants/chartColors";
import { Interface__SelectOption } from "@/constants/interfaces";
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

const CurrentPopulationDonutChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const [category, setCategory] = useState<
    Interface__SelectOption[] | undefined
  >(undefined);
  const data = [
    { label: "Lapangan", count: 1 },
    { label: "Balai Desa", count: 1 },
    { label: "Gor", count: 1 },
    { label: "Mic", count: 8 },
    { label: "Speaker", count: 2 },
  ];

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <Icon mb={"2px"}>
            <IconFriends size={20} />
          </Icon>

          <ItemHeaderTitle>{l.current_population}</ItemHeaderTitle>
        </HStack>

        <PopulationCategoriesOptions
          category={category}
          setCategory={setCategory}
        />
      </ItemHeaderContainer>

      <CContainer flex={1} pb={4} minH={ITEM_BODY_H}>
        {/* Chart */}
        <CContainer px={4} my={"auto"}>
          <ResponsiveContainer width={"100%"} height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                {...PRESET_DOUGHNUT_CHART}
              >
                {data.map((_, i) => {
                  return <Cell key={`cell-${i}`} fill={CHART_COLORS[i]} />;
                })}
              </Pie>
              <Tooltip {...PRESET_DONUT_CHART_TOOLTIP} />
            </PieChart>
          </ResponsiveContainer>
        </CContainer>

        <HStack wrap={"wrap"} justify={"center"} gapX={5} px={4} mt={4}>
          {data.map((item, i) => (
            <HStack key={i}>
              <Circle w={"8px"} h={"8px"} bg={CHART_COLORS[i]} />
              <Text>
                {item.label} : {item.count}
              </Text>
            </HStack>
          ))}
        </HStack>
      </CContainer>
    </ItemContainer>
  );
};

export default CurrentPopulationDonutChart;
