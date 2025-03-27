import CartesianGrid from "@/components/ui-custom/CartesianGrid";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { CHART_COLORS } from "@/constants/colors";
import { Interface__SelectOption } from "@/constants/interfaces";
import { MONTHS } from "@/constants/months";
import {
  PRESET_LINE_CHART,
  PRESET_LINE_CHART_TOOLTIP,
} from "@/constants/presetProps";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import formatCount from "@/utils/formatCount";
import userNow from "@/utils/userNow";
import { Circle, HStack, StackProps, Text } from "@chakra-ui/react";
import { IconTrendingUp } from "@tabler/icons-react";
import { useState } from "react";
import {
  Tooltip as ChartTooltip,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import FeedbackNoData from "../ui-custom/FeedbackNoData";
import NumberInput from "../ui-custom/NumberInput";
import { useColorModeValue } from "../ui/color-mode";
import PopulationCategoriesOptions from "./PopulationCategoriesOptions";

const PopulationGrowthLineChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l, lang } = useLang();

  // States, Refs
  const [year, setYear] = useState<number | null | undefined>(
    userNow().getFullYear()
  );
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
      {
        total_population: 6000,
        Islam: 4200,
        Kristen: 800,
        Katolik: 200,
        Hindu: 500,
        Buddha: 300,
        Konghucu: 100,
      },
      {
        total_population: 5500,
        Islam: 3800,
        Kristen: 900,
        Katolik: 300,
        Hindu: 300,
        Buddha: 200,
        Konghucu: 100,
      },
      {
        total_population: 5800,
        Islam: 4000,
        Kristen: 800,
        Katolik: 300,
        Hindu: 400,
        Buddha: 300,
        Konghucu: 100,
      },
      {
        total_population: 6200,
        Islam: 4500,
        Kristen: 700,
        Katolik: 200,
        Hindu: 500,
        Buddha: 300,
        Konghucu: 100,
      },
      {
        total_population: 5900,
        Islam: 4200,
        Kristen: 900,
        Katolik: 200,
        Hindu: 400,
        Buddha: 200,
        Konghucu: 100,
      },
      {
        total_population: 6100,
        Islam: 4300,
        Kristen: 800,
        Katolik: 200,
        Hindu: 500,
        Buddha: 300,
        Konghucu: 100,
      },
      {
        total_population: 6300,
        Islam: 4600,
        Kristen: 600,
        Katolik: 200,
        Hindu: 600,
        Buddha: 300,
        Konghucu: 100,
      },
      {
        total_population: 5700,
        Islam: 3900,
        Kristen: 900,
        Katolik: 300,
        Hindu: 400,
        Buddha: 200,
        Konghucu: 100,
      },
      {
        total_population: 6000,
        Islam: 4100,
        Kristen: 800,
        Katolik: 200,
        Hindu: 500,
        Buddha: 300,
        Konghucu: 100,
      },
      {
        total_population: 6200,
        Islam: 4400,
        Kristen: 700,
        Katolik: 200,
        Hindu: 600,
        Buddha: 300,
        Konghucu: 100,
      },
      {
        total_population: 5900,
        Islam: 4000,
        Kristen: 900,
        Katolik: 200,
        Hindu: 600,
        Buddha: 200,
        Konghucu: 100,
      },
      {
        total_population: 6100,
        Islam: 4200,
        Kristen: 800,
        Katolik: 200,
        Hindu: 500,
        Buddha: 400,
        Konghucu: 100,
      },
    ],
    education: [
      {
        total_population: 6000,
        TK: 1757,
        SD: 176,
        SMP: 1065,
        SMA: 1815,
        SMK: 314,
        D1: 14,
        D2: 3,
        D3: 17,
        D4: 2,
        S1: 782,
        S2: 54,
        S3: 1,
      },
      {
        total_population: 5500,
        TK: 1611,
        SD: 161,
        SMP: 976,
        SMA: 1664,
        SMK: 288,
        D1: 13,
        D2: 3,
        D3: 16,
        D4: 1,
        S1: 717,
        S2: 50,
        S3: 1,
      },
      {
        total_population: 5800,
        TK: 1699,
        SD: 170,
        SMP: 1029,
        SMA: 1755,
        SMK: 304,
        D1: 14,
        D2: 3,
        D3: 17,
        D4: 1,
        S1: 756,
        S2: 52,
        S3: 1,
      },
      {
        total_population: 6200,
        TK: 1816,
        SD: 181,
        SMP: 1100,
        SMA: 1876,
        SMK: 325,
        D1: 15,
        D2: 3,
        D3: 18,
        D4: 2,
        S1: 808,
        S2: 56,
        S3: 1,
      },
      {
        total_population: 5900,
        TK: 1728,
        SD: 172,
        SMP: 1047,
        SMA: 1788,
        SMK: 309,
        D1: 14,
        D2: 3,
        D3: 17,
        D4: 2,
        S1: 770,
        S2: 53,
        S3: 1,
      },
      {
        total_population: 6100,
        TK: 1786,
        SD: 178,
        SMP: 1084,
        SMA: 1851,
        SMK: 320,
        D1: 14,
        D2: 3,
        D3: 18,
        D4: 2,
        S1: 796,
        S2: 55,
        S3: 1,
      },
      {
        total_population: 6300,
        TK: 1845,
        SD: 184,
        SMP: 1121,
        SMA: 1914,
        SMK: 331,
        D1: 15,
        D2: 3,
        D3: 19,
        D4: 2,
        S1: 822,
        S2: 57,
        S3: 1,
      },
      {
        total_population: 5700,
        TK: 1670,
        SD: 167,
        SMP: 1013,
        SMA: 1727,
        SMK: 299,
        D1: 14,
        D2: 3,
        D3: 16,
        D4: 2,
        S1: 743,
        S2: 51,
        S3: 1,
      },
      {
        total_population: 6000,
        TK: 1757,
        SD: 176,
        SMP: 1065,
        SMA: 1815,
        SMK: 314,
        D1: 14,
        D2: 3,
        D3: 17,
        D4: 2,
        S1: 782,
        S2: 54,
        S3: 1,
      },
      {
        total_population: 6200,
        TK: 1816,
        SD: 181,
        SMP: 1100,
        SMA: 1876,
        SMK: 325,
        D1: 15,
        D2: 3,
        D3: 18,
        D4: 2,
        S1: 808,
        S2: 56,
        S3: 1,
      },
      {
        total_population: 5900,
        TK: 1728,
        SD: 172,
        SMP: 1047,
        SMA: 1788,
        SMK: 309,
        D1: 14,
        D2: 3,
        D3: 17,
        D4: 2,
        S1: 770,
        S2: 53,
        S3: 1,
      },
      {
        total_population: 6100,
        TK: 1786,
        SD: 178,
        SMP: 1084,
        SMA: 1851,
        SMK: 320,
        D1: 14,
        D2: 3,
        D3: 18,
        D4: 2,
        S1: 796,
        S2: 55,
        S3: 1,
      },
    ],
    married_status: [
      {
        total_population: 6000,
        Kawin: 3500,
        "Kawin Belum Tercatat": 500,
        "Belum Kawin": 2000,
      },
      {
        total_population: 5500,
        Kawin: 3200,
        "Kawin Belum Tercatat": 400,
        "Belum Kawin": 1900,
      },
      {
        total_population: 5800,
        Kawin: 3400,
        "Kawin Belum Tercatat": 450,
        "Belum Kawin": 1950,
      },
      {
        total_population: 6200,
        Kawin: 3700,
        "Kawin Belum Tercatat": 550,
        "Belum Kawin": 1950,
      },
      {
        total_population: 5900,
        Kawin: 3300,
        "Kawin Belum Tercatat": 500,
        "Belum Kawin": 2100,
      },
      {
        total_population: 6100,
        Kawin: 3400,
        "Kawin Belum Tercatat": 520,
        "Belum Kawin": 2180,
      },
      {
        total_population: 6300,
        Kawin: 3800,
        "Kawin Belum Tercatat": 600,
        "Belum Kawin": 1900,
      },
      {
        total_population: 5700,
        Kawin: 3100,
        "Kawin Belum Tercatat": 450,
        "Belum Kawin": 2150,
      },
      {
        total_population: 6000,
        Kawin: 3500,
        "Kawin Belum Tercatat": 500,
        "Belum Kawin": 2000,
      },
      {
        total_population: 6200,
        Kawin: 3700,
        "Kawin Belum Tercatat": 550,
        "Belum Kawin": 1950,
      },
      {
        total_population: 5900,
        Kawin: 3300,
        "Kawin Belum Tercatat": 500,
        "Belum Kawin": 2100,
      },
      {
        total_population: 6100,
        Kawin: 3400,
        "Kawin Belum Tercatat": 520,
        "Belum Kawin": 2180,
      },
    ],
    citizenship: [
      {
        total_population: 6000,
        WNI: 5900,
        WNA: 100,
      },
      {
        total_population: 5500,
        WNI: 5400,
        WNA: 100,
      },
      {
        total_population: 5800,
        WNI: 5700,
        WNA: 100,
      },
      {
        total_population: 6200,
        WNI: 6100,
        WNA: 100,
      },
      {
        total_population: 5900,
        WNI: 5800,
        WNA: 100,
      },
      {
        total_population: 6100,
        WNI: 6000,
        WNA: 100,
      },
      {
        total_population: 6300,
        WNI: 6200,
        WNA: 100,
      },
      {
        total_population: 5700,
        WNI: 5600,
        WNA: 100,
      },
      {
        total_population: 6000,
        WNI: 5900,
        WNA: 100,
      },
      {
        total_population: 6200,
        WNI: 6100,
        WNA: 100,
      },
      {
        total_population: 5900,
        WNI: 5800,
        WNA: 100,
      },
      {
        total_population: 6100,
        WNI: 6000,
        WNA: 100,
      },
    ],
    gender: [
      {
        total_population: 6000,
        "Laki-laki": 3000,
        Perempuan: 3000,
      },
      {
        total_population: 5500,
        "Laki-laki": 2750,
        Perempuan: 2750,
      },
      {
        total_population: 5800,
        "Laki-laki": 2900,
        Perempuan: 2900,
      },
      {
        total_population: 6200,
        "Laki-laki": 3100,
        Perempuan: 3100,
      },
      {
        total_population: 5900,
        "Laki-laki": 2950,
        Perempuan: 2950,
      },
      {
        total_population: 6100,
        "Laki-laki": 3050,
        Perempuan: 3050,
      },
      {
        total_population: 6300,
        "Laki-laki": 3150,
        Perempuan: 3150,
      },
      {
        total_population: 5700,
        "Laki-laki": 2850,
        Perempuan: 2850,
      },
      {
        total_population: 6000,
        "Laki-laki": 3000,
        Perempuan: 3000,
      },
      {
        total_population: 6200,
        "Laki-laki": 3100,
        Perempuan: 3100,
      },
      {
        total_population: 5900,
        "Laki-laki": 2950,
        Perempuan: 2950,
      },
      {
        total_population: 6100,
        "Laki-laki": 3050,
        Perempuan: 3050,
      },
    ],
  };
  const finalData = data?.[category?.[0]?.id as keyof typeof data].map(
    (item: any, i: number) => ({
      ...item,
      month: MONTHS[lang][i].slice(0, 3),
    })
  );
  const categories = Object.keys(finalData?.[0]).filter(
    (key) => key !== "month" && key !== "total_population"
  );
  const categoriesLegend = categories.map((item, i) => ({
    label: item,
    color: CHART_COLORS[i],
  }));
  const legend = [
    {
      label: l.population,
      color: useColorModeValue("black", "white"),
    },
    ...categoriesLegend,
  ];

  console.log("Population Growth", finalData);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer borderless>
        <HStack>
          <IconTrendingUp size={20} />

          <ItemHeaderTitle>{l.population_growth}</ItemHeaderTitle>
        </HStack>

        <HStack>
          <HStack>
            <Text color={"fg.subtle"}>{l.year.toLowerCase()}</Text>
            <NumberInput
              onChangeSetter={(input) => {
                setYear(input);
              }}
              inputValue={year}
              size={"sm"}
              w={"70px"}
              noFormat
              textAlign={"center"}
            />
          </HStack>

          <HStack>
            <Text color={"fg.subtle"}>{l.by}</Text>
            <PopulationCategoriesOptions
              category={category}
              setCategory={setCategory}
            />
          </HStack>
        </HStack>
      </ItemHeaderContainer>

      <CContainer flex={1} minH={ITEM_BODY_H} px={3} pb={4}>
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
                <CContainer my={"auto"} w={"calc(100% + 3*4px)"} ml={-3}>
                  <ResponsiveContainer width={"100%"} height={450}>
                    <ComposedChart data={finalData}>
                      <CartesianGrid />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCount} />
                      <ChartTooltip {...PRESET_LINE_CHART_TOOLTIP} />
                      <Line
                        dataKey="total_population"
                        stroke={useColorModeValue("black", "white")}
                        name={l.population}
                        {...PRESET_LINE_CHART}
                      />
                      {categories?.map((item, i) => {
                        return (
                          <Line
                            key={i}
                            dataKey={item}
                            stroke={CHART_COLORS[i]}
                            name={item}
                            {...PRESET_LINE_CHART}
                          />
                        );
                      })}
                    </ComposedChart>
                  </ResponsiveContainer>
                </CContainer>

                <HStack wrap={"wrap"} justify={"center"} gapX={5} mt={4}>
                  {legend.map((item, i) => {
                    return (
                      <HStack key={i}>
                        <Circle w={"8px"} h={"8px"} bg={item.color} />
                        <Text>{item.label}</Text>
                      </HStack>
                    );
                  })}
                </HStack>
              </>
            )}
          </>
        )}
      </CContainer>
    </ItemContainer>
  );
};

export default PopulationGrowthLineChart;
