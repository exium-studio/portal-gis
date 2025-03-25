import CartesianGrid from "@/components/ui-custom/CartesianGrid";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { CHART_COLORS } from "@/constants/chartColors";
import { Interface__SelectOption } from "@/constants/interfaces";
import { MONTHS } from "@/constants/months";
import {
  PRESET_LINE_CHART,
  PRESET_LINE_CHART_TOOLTIP,
} from "@/constants/presetProps";
import useLang from "@/context/useLang";
import formatCount from "@/utils/formatCount";
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
import SelectInput from "../ui-custom/SelectInput";
import { useColorModeValue } from "../ui/color-mode";

const Categories = ({ category, setCategory }: any) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const categoriesOptions = [
    {
      id: 1,
      label: l.religion,
    },
    {
      id: 2,
      label: l.education,
    },
    {
      id: 3,
      label: l.maried_status,
    },
    {
      id: 4,
      label: l.citizenship,
    },
  ];

  return (
    <SelectInput
      id="jancok"
      initialOptions={categoriesOptions}
      onConfirm={(input) => {
        setCategory(input);
      }}
      inputValue={category}
      w={"fit"}
      placeholder={l.categories}
      size={"sm"}
    />
  );
};

const PopulationGrowthLineChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l, lang } = useLang();

  // States, Refs
  const [category, setCategory] = useState<
    Interface__SelectOption[] | undefined
  >(undefined);

  const data = [
    {
      population: 6000,
      category: [
        { religion_id: 1, label: "Islam", total: 4200 },
        { religion_id: 2, label: "Kristen", total: 1000 },
        { religion_id: 3, label: "Hindu", total: 500 },
        { religion_id: 4, label: "Budha", total: 300 },
      ],
    },
    {
      population: 5500,
      category: [
        { religion_id: 1, label: "Islam", total: 3800 },
        { religion_id: 2, label: "Kristen", total: 1200 },
        { religion_id: 3, label: "Hindu", total: 300 },
        { religion_id: 4, label: "Budha", total: 200 },
      ],
    },
    {
      population: 5800,
      category: [
        { religion_id: 1, label: "Islam", total: 4000 },
        { religion_id: 2, label: "Kristen", total: 1100 },
        { religion_id: 3, label: "Hindu", total: 400 },
        { religion_id: 4, label: "Budha", total: 300 },
      ],
    },
    {
      population: 6200,
      category: [
        { religion_id: 1, label: "Islam", total: 4500 },
        { religion_id: 2, label: "Kristen", total: 900 },
        { religion_id: 3, label: "Hindu", total: 500 },
        { religion_id: 4, label: "Budha", total: 300 },
      ],
    },
    {
      population: 5900,
      category: [
        { religion_id: 1, label: "Islam", total: 4200 },
        { religion_id: 2, label: "Kristen", total: 1100 },
        { religion_id: 3, label: "Hindu", total: 400 },
        { religion_id: 4, label: "Budha", total: 200 },
      ],
    },
    {
      population: 6100,
      category: [
        { religion_id: 1, label: "Islam", total: 4300 },
        { religion_id: 2, label: "Kristen", total: 1000 },
        { religion_id: 3, label: "Hindu", total: 500 },
        { religion_id: 4, label: "Budha", total: 300 },
      ],
    },
    {
      population: 6300,
      category: [
        { religion_id: 1, label: "Islam", total: 4600 },
        { religion_id: 2, label: "Kristen", total: 800 },
        { religion_id: 3, label: "Hindu", total: 600 },
        { religion_id: 4, label: "Budha", total: 300 },
      ],
    },
    {
      population: 5700,
      category: [
        { religion_id: 1, label: "Islam", total: 3900 },
        { religion_id: 2, label: "Kristen", total: 1200 },
        { religion_id: 3, label: "Hindu", total: 400 },
        { religion_id: 4, label: "Budha", total: 200 },
      ],
    },
    {
      population: 6000,
      category: [
        { religion_id: 1, label: "Islam", total: 4100 },
        { religion_id: 2, label: "Kristen", total: 1100 },
        { religion_id: 3, label: "Hindu", total: 500 },
        { religion_id: 4, label: "Budha", total: 300 },
      ],
    },
    {
      population: 6200,
      category: [
        { religion_id: 1, label: "Islam", total: 4400 },
        { religion_id: 2, label: "Kristen", total: 900 },
        { religion_id: 3, label: "Hindu", total: 600 },
        { religion_id: 4, label: "Budha", total: 300 },
      ],
    },
    {
      population: 5900,
      category: [
        { religion_id: 1, label: "Islam", total: 4000 },
        { religion_id: 2, label: "Kristen", total: 1100 },
        { religion_id: 3, label: "Hindu", total: 600 },
        { religion_id: 4, label: "Budha", total: 200 },
      ],
    },
    {
      population: 6100,
      category: [
        { religion_id: 1, label: "Islam", total: 4200 },
        { religion_id: 2, label: "Kristen", total: 1000 },
        { religion_id: 3, label: "Hindu", total: 500 },
        { religion_id: 4, label: "Budha", total: 400 },
      ],
    },
  ];

  const finalData = data.map((item: any, i: number) => ({
    total_population: item.population,
    ...Object.fromEntries(
      item.category.map((cat: any) => [cat.label, cat.total])
    ),
    month: MONTHS[lang][i].slice(0, 3),
  }));
  const categories = Object.keys(finalData[0]).filter(
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

  console.log("Population Growth", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer borderless>
        <HStack>
          <IconTrendingUp size={20} />

          <ItemHeaderTitle>{l.population_growth}</ItemHeaderTitle>
        </HStack>

        <Categories category={category} setCategory={setCategory} />
      </ItemHeaderContainer>

      <CContainer>
        {/* Chart */}
        <CContainer pr={4} pb={4} ml={-2}>
          <ResponsiveContainer width={"100%"} height={400}>
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

          <HStack wrap={"wrap"} justify={"center"} gapX={5} pl={4} mt={4}>
            {legend.map((item, i) => {
              return (
                <HStack key={i}>
                  <Circle w={"8px"} h={"8px"} bg={item.color} />
                  <Text>{item.label}</Text>
                </HStack>
              );
            })}
          </HStack>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default PopulationGrowthLineChart;
