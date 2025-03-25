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
import formatNumber from "@/utils/formatNumber";
import { Circle, HStack, StackProps, Text } from "@chakra-ui/react";
import { IconArrowsUpDown } from "@tabler/icons-react";
import {
  Tooltip as ChartTooltip,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const FundMutationLineChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l, lang } = useLang();

  // States, Refs
  const data = [
    {
      expense: 10751173,
      income: 13453102,
    },
    {
      expense: 11334632,
      income: 14941915,
    },
    {
      expense: 9330103,
      income: 13471852,
    },
    {
      expense: 13340012,
      income: 16773920,
    },
    {
      expense: 12199410,
      income: 17338526,
    },
    {
      expense: 12110341,
      income: 18019161,
    },
    {
      expense: 16800661,
      income: 19679081,
    },
    {
      expense: 14323459,
      income: 19680479,
    },
    {
      expense: 16634639,
      income: 21179891,
    },
    {
      expense: 17582756,
      income: 21632541,
    },
    {
      expense: 18154105,
      income: 20006748,
    },
    {
      expense: 21361102,
      income: 22008639,
    },
  ];
  const finalData = data.map((item: any, i: number) => ({
    ...item,
    month: MONTHS[lang][i].slice(0, 3),
  }));
  const legend = [
    {
      label: l.income,
      total: 321000000,
      color: "#22c55e",
    },
    {
      label: l.expense,
      total: 211000000,
      color: "#ef4444",
    },
  ];

  console.log("Income Expenses", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer borderless>
        <HStack>
          <IconArrowsUpDown size={20} />

          <ItemHeaderTitle>{l.fund_mutation}</ItemHeaderTitle>
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
              dataKey="income"
              stroke={"#22c55e"}
              name="2024"
              {...PRESET_LINE_CHART}
            />
            <Line
              dataKey="expense"
              stroke={"#ef4444"}
              name="2025"
              {...PRESET_LINE_CHART}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <HStack wrap={"wrap"} justify={"center"} gapX={5} pl={4} mt={4}>
          {legend.map((item, i) => (
            <HStack key={i}>
              <Circle w={"8px"} h={"8px"} bg={item.color} />
              <Text>
                {item.label} (Total : Rp {formatNumber(item.total)})
              </Text>
            </HStack>
          ))}
        </HStack>
      </CContainer>
    </ItemContainer>
  );
};

export default FundMutationLineChart;
