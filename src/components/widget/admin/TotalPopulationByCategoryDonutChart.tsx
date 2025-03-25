import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { CHART_COLORS } from "@/constants/chartColors";
import {
  PRESET_DONUT_CHART_TOOLTIP,
  PRESET_DOUGHNUT_CHART,
} from "@/constants/presetProps";
import useLang from "@/context/useLang";
import { Circle, HStack, Icon, StackProps, Text } from "@chakra-ui/react";
import { IconHome2 } from "@tabler/icons-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const TotalPopulationByCategoryDonutChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = [{ count: 4 }, { count: 1 }, { count: 2 }];

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer borderless>
        <HStack>
          <Icon mb={"2px"}>
            <IconHome2 size={20} />
          </Icon>

          <ItemHeaderTitle>{l.facility}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer flex={1} pb={4}>
        {/* Chart */}
        <CContainer px={4} my={"auto"}>
          <ResponsiveContainer width={"100%"} height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="land_type.label"
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

        <HStack wrap={"wrap"} justify={"center"} gapX={5} mt={"auto"}>
          {data.map((item, i) => (
            <HStack key={i}>
              <Circle w={"8px"} h={"8px"} bg={CHART_COLORS[i]} />
              <Text>Jancok : {item.count}</Text>
            </HStack>
          ))}
        </HStack>
      </CContainer>
    </ItemContainer>
  );
};

export default TotalPopulationByCategoryDonutChart;
