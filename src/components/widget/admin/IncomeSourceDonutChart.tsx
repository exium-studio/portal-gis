import CContainer from "@/components/ui-custom/CContainer";
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
import formatNumber from "@/utils/formatNumber";
import { Circle, HStack, Icon, StackProps, Text } from "@chakra-ui/react";
import { IconArrowDown } from "@tabler/icons-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const calculatePercentage = (items: any[]): any[] => {
  const total = items.reduce((sum, item) => sum + item.total_income, 0);
  return items.map((item) => ({
    ...item,
    percentage: ((item.total_income / total) * 100).toFixed(2) + "%",
  }));
};

const IncomeSourceDonutChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = [
    { label: "Dana Desa", total_income: 150000000 },
    { label: "Alokasi Dana Desa", total_income: 120000000 },
    { label: "Pendapatan Asli Desa", total_income: 50000000 },
    { label: "Bantuan Keuangan Provinsi", total_income: 75000000 },
    { label: "Bantuan Keuangan Kabupaten/Kota", total_income: 60000000 },
    { label: "Hasil Kerjasama Desa", total_income: 30000000 },
    { label: "Lainnya", total_income: 25000000 },
  ];
  const finalData = calculatePercentage(data);

  console.log("Current Population", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <Icon mb={"2px"}>
            <IconArrowDown size={20} />
          </Icon>

          <ItemHeaderTitle>{l.income_source}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer flex={1} pb={4} minH={ITEM_BODY_H}>
        {/* Chart */}
        <CContainer px={4} my={"auto"}>
          <ResponsiveContainer width={"100%"} height={300}>
            <PieChart>
              <Pie
                data={finalData}
                dataKey="total_income"
                nameKey="label"
                {...PRESET_DOUGHNUT_CHART}
              >
                {finalData.map((_, i) => {
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

        <HStack
          wrap={"wrap"}
          justify={"center"}
          gapX={5}
          px={4}
          mt={4}
          maxH={"200px"}
          className="scrollY"
        >
          {finalData.map((item, i) => (
            <HStack key={i}>
              <Circle
                w={"8px"}
                h={"8px"}
                bg={CHART_COLORS[i % CHART_COLORS.length]}
              />
              <HStack>
                <Text>
                  {item.label} : {formatNumber(item.total_income)}
                </Text>
                <Text color={"fg.subtle"}>{item.percentage}</Text>
              </HStack>
            </HStack>
          ))}
        </HStack>
      </CContainer>
    </ItemContainer>
  );
};

export default IncomeSourceDonutChart;
