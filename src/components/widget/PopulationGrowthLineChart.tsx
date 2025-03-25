import CartesianGrid from "@/components/ui-custom/CartesianGrid";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { MONTHS } from "@/constants/months";
import {
  PRESET_LINE_CHART,
  PRESET_LINE_CHART_TOOLTIP,
} from "@/constants/presetProps";
import useLang from "@/context/useLang";
import formatCount from "@/utils/formatCount";
import { Circle, HStack, StackProps, Text } from "@chakra-ui/react";
import { IconTrendingUp } from "@tabler/icons-react";
import {
  Tooltip as ChartTooltip,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const PopulationGrowthLineChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l, lang } = useLang();

  // States, Refs
  const data = [
    {
      population: 10751173,
    },
    {
      population: 11334632,
    },
    {
      population: 9330103,
    },
    {
      population: 13340012,
    },
    {
      population: 12199410,
    },
    {
      population: 12110341,
    },
    {
      population: 16800661,
    },
    {
      population: 14323459,
    },
    {
      population: 16634639,
    },
    {
      population: 17582756,
    },
    {
      population: 18154105,
    },
    {
      population: 21361102,
    },
  ];
  const finalData = data.map((item: any, i: number) => ({
    ...item,
    month: MONTHS[lang][i].slice(0, 3),
  }));
  const legend = [
    {
      label: l.population,
      total: 321000000,
      color: "#22c55e",
    },
  ];

  console.log("Population Growth", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer borderless>
        <HStack>
          <IconTrendingUp size={20} />

          <ItemHeaderTitle>{l.population_growth}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pr={4} pb={4} ml={-2}>
        <ResponsiveContainer width={"100%"} height={400}>
          <ComposedChart data={finalData}>
            <CartesianGrid />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCount} />
            <ChartTooltip {...PRESET_LINE_CHART_TOOLTIP} />
            <Line
              dataKey="population"
              stroke={"#22c55e"}
              name={l.population}
              {...PRESET_LINE_CHART}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <HStack wrap={"wrap"} justify={"center"} gapX={5} pl={4} mt={4}>
          {legend.map((item, i) => (
            <HStack key={i}>
              <Circle w={"8px"} h={"8px"} bg={item.color} />
              <Text>{item.label}</Text>
            </HStack>
          ))}
        </HStack>
      </CContainer>
    </ItemContainer>
  );
};

export default PopulationGrowthLineChart;
