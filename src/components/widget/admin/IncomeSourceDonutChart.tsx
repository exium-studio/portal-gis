import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import TruncatedText from "@/components/ui-custom/TruncatedText";
import { CHART_COLORS } from "@/constants/colors";
import {
  PRESET_DONUT_CHART_TOOLTIP,
  PRESET_DOUGHNUT_CHART,
} from "@/constants/presetProps";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import calculatePercentage from "@/utils/calculatePercentage";
import formatNumber from "@/utils/formatNumber";
import {
  Circle,
  HStack,
  Icon,
  Separator,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { IconArrowDown } from "@tabler/icons-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const IncomeSourceDonutChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = [
    { label: "Dana Desa", amount: 150000000 },
    { label: "Alokasi Dana Desa", amount: 120000000 },
    { label: "Pendapatan Asli Desa", amount: 50000000 },
    { label: "Bantuan Keuangan Provinsi", amount: 75000000 },
    { label: "Bantuan Keuangan Kabupaten/Kota", amount: 60000000 },
    { label: "Hasil Kerjasama Desa", amount: 30000000 },
    { label: "Lainnya", amount: 25000000 },
  ];
  const finalData = calculatePercentage(data, { valueKey: "amount" });

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
                dataKey="amount"
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

        <CContainer gap={4} px={5} mt={4} maxH={"200px"} className="scrollY">
          {finalData.map((item, i) => (
            <HStack key={i} align={"start"}>
              <Circle
                mt={"6px"}
                w={"8px"}
                h={"8px"}
                bg={CHART_COLORS[i % CHART_COLORS.length]}
              />
              <TruncatedText
                tooltipContent={item.label}
                textProps={{ maxW: "150px" }}
              >
                {item.label}
              </TruncatedText>
              <Separator flex={1} my={"auto"} />
              <HStack ml={"auto"}>
                <Text color={"fg.subtle"}>{item.percentage}</Text>
                <Text>{formatNumber(item.amount)}</Text>
              </HStack>
            </HStack>
          ))}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default IncomeSourceDonutChart;
