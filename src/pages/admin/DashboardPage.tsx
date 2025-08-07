// Hardcoded Dashboard
// HGU_AREA each TIPEHAK sum the LUASPETA
// HGU_COUNT_PERCENTAGE calculate percentage each TIPEHAK
// HGU_AREA_BY_KABUPATEN each KABUPATEN sum the LUASPETA wich has TIPEHAK value

import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import HelperText from "@/components/ui-custom/HelperText";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import P from "@/components/ui-custom/P";
import { Checkbox } from "@/components/ui/checkbox";
import PageContainer from "@/components/widget/PageContainer";
import SimplePopover from "@/components/widget/SimplePopover";
import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import { R_GAP } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import { addOpacityToHex } from "@/utils/addOpacityToHex";
import empty from "@/utils/empty";
import { Chart, useChart } from "@chakra-ui/charts";
import { Circle, HStack } from "@chakra-ui/react";
import { IconFoldersOff } from "@tabler/icons-react";
import chroma from "chroma-js";
import { useEffect, useState } from "react";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";

type DashboardStat = {
  name: string;
  value: number;
  percentage: number;
};
type DashboardSummary = {
  areaByTipeHak: DashboardStat[];
  countByTipeHak: DashboardStat[];
  areaByKabupaten: DashboardStat[];
};

function summarizeDashboard(
  workspaces: Interface__ActiveWorkspace[]
): DashboardSummary {
  const areaRaw: Record<string, number> = {};
  const countRaw: Record<string, number> = {};
  const areaByKabupatenRaw: Record<string, Record<string, number>> = {};

  let totalArea = 0;
  let totalCount = 0;

  for (const ws of workspaces) {
    for (const layer of ws.layers || []) {
      const features = layer.data?.geojson.features || [];

      for (const feature of features) {
        const props = feature.properties as Record<string, any>;
        const tipeHak = props.TIPEHAK;
        const luas = Number(props.LUASPETA);
        const kabupaten = props.KABUPATEN;

        if (!tipeHak || isNaN(luas)) continue;

        // Sum area
        areaRaw[tipeHak] = (areaRaw[tipeHak] || 0) + luas;
        totalArea += luas;

        // Count
        countRaw[tipeHak] = (countRaw[tipeHak] || 0) + 1;
        totalCount++;

        // Area by Kabupaten
        if (!areaByKabupatenRaw[kabupaten]) areaByKabupatenRaw[kabupaten] = {};
        areaByKabupatenRaw[kabupaten][tipeHak] =
          (areaByKabupatenRaw[kabupaten][tipeHak] || 0) + luas;
      }
    }
  }

  const areaByTipeHak: DashboardStat[] = Object.entries(areaRaw).map(
    ([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      percentage: parseFloat(((value / totalArea) * 100).toFixed(2)),
    })
  );

  const countByTipeHak: DashboardStat[] = Object.entries(countRaw).map(
    ([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      percentage: parseFloat(((value / totalCount) * 100).toFixed(2)),
    })
  );

  const areaByKabupaten: DashboardStat[] = Object.entries(
    areaByKabupatenRaw
  ).map(([kabupaten, tipeData]) => {
    const totalKabupaten = Object.values(tipeData).reduce(
      (sum, v) => sum + v,
      0
    );
    return {
      name: kabupaten,
      value: parseFloat(totalKabupaten.toFixed(1)),
      percentage: parseFloat(((totalKabupaten / totalArea) * 100).toFixed(1)),
    };
  });

  return {
    areaByTipeHak,
    countByTipeHak,
    areaByKabupaten,
  };
}

const HGUArea = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // States
  const [percentageView, setPercentageView] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>([]);
  const chart = useChart({
    data: chartData,
  });

  useEffect(() => {
    const newChartData = data?.map((item: any, i: number) => {
      const colors = chroma
        .scale(["#d73027", "#fee08b", "#1a9850", "#4575b4", "#542788"])
        .mode("lab")
        .colors(data?.length || 0);

      return {
        name: item?.name,
        value: percentageView ? item?.percentage : item?.value,
        color: addOpacityToHex(colors[i], 0.8),
      };
    });
    setChartData(newChartData);
  }, [data, percentageView]);

  return (
    <ItemContainer pb={4} {...restProps}>
      <ItemHeaderContainer>
        <HStack w={"full"} justify={"space-between"}>
          <P fontWeight={"semibold"}>{l.hgu_area}</P>

          <Checkbox onChange={(e: any) => setPercentageView(e.target.checked)}>
            %
          </Checkbox>
        </HStack>
      </ItemHeaderContainer>

      <CContainer p={4} pos={"relative"}>
        <Chart.Root chart={chart} mx="auto">
          <PieChart>
            <Tooltip
              cursor={false}
              animationDuration={100}
              content={<Chart.Tooltip hideLabel />}
            />
            <Pie
              innerRadius={70}
              outerRadius={100}
              isAnimationActive={false}
              data={chart.data}
              dataKey={chart.key("value")}
              nameKey="name"
            >
              <Label
                content={({ viewBox }) => (
                  <Chart.RadialText
                    viewBox={viewBox}
                    title={chart.getTotal("value").toLocaleString()}
                    description="users"
                  />
                )}
              />

              {chart.data.map((item) => (
                <Cell
                  key={item.name}
                  fill={chart.color(item.color)}
                  strokeWidth={0}
                />
              ))}
            </Pie>
          </PieChart>
        </Chart.Root>
      </CContainer>

      <CContainer mt={4}>
        <CContainer maxH={"150px"} className="scrollY" px={8} gap={2}>
          {chart.data.map((item: any) => {
            return (
              <HStack key={item?.name}>
                <Circle w={"10px"} h={"10px"} bg={item?.color} opacity={0.8} />
                <SimplePopover content={item?.name}>
                  <P lineClamp={1}>{item?.name}</P>
                </SimplePopover>

                <P textAlign={"right"} ml={"auto"}>{`${item?.value}`}</P>
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>

      <CContainer px={4} align={"center"} mt={"auto"} pt={4}>
        <HelperText textAlign={"center"}>{l.data_unit_ha}</HelperText>
      </CContainer>
    </ItemContainer>
  );
};
const HGUCount = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // States
  const [percentageView, setPercentageView] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>([]);
  const chart = useChart({
    data: chartData,
  });

  useEffect(() => {
    const newChartData = data?.map((item: any, i: number) => {
      const colors = chroma
        .scale(["#d73027", "#fee08b", "#1a9850", "#4575b4", "#542788"])
        .mode("lab")
        .colors(data?.length || 0);

      return {
        name: item?.name,
        value: percentageView ? item?.percentage : item?.value,
        color: addOpacityToHex(colors[i], 0.8),
      };
    });
    setChartData(newChartData);
  }, [data, percentageView]);

  return (
    <ItemContainer pb={6} {...restProps}>
      <ItemHeaderContainer>
        <HStack justify={"space-between"} w={"full"}>
          <P fontWeight={"semibold"}>{l.hgu_count}</P>

          <Checkbox onChange={(e: any) => setPercentageView(e.target.checked)}>
            %
          </Checkbox>
        </HStack>
      </ItemHeaderContainer>

      <CContainer p={4} pos={"relative"}>
        <Chart.Root chart={chart} mx="auto">
          <PieChart>
            <Tooltip
              cursor={false}
              animationDuration={100}
              content={<Chart.Tooltip hideLabel />}
            />
            <Pie
              innerRadius={70}
              outerRadius={100}
              isAnimationActive={false}
              data={chart.data}
              dataKey={chart.key("value")}
              nameKey="name"
            >
              {chart.data.map((item) => (
                <Cell
                  key={item.color}
                  fill={chart.color(item.color)}
                  strokeWidth={0}
                />
              ))}
            </Pie>
          </PieChart>
        </Chart.Root>
      </CContainer>

      <CContainer mt={4}>
        <CContainer maxH={"150px"} className="scrollY" px={8} gap={2}>
          {chart.data.map((item: any) => {
            return (
              <HStack key={item?.name}>
                <Circle w={"10px"} h={"10px"} bg={item?.color} opacity={0.8} />
                <SimplePopover content={item?.name}>
                  <P lineClamp={1}>{item?.name}</P>
                </SimplePopover>

                <P textAlign={"right"} ml={"auto"}>{`${item?.value}`}</P>
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const HGUAreaByKabupaten = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // States
  const [percentageView, setPercentageView] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any>([]);
  const chart = useChart({
    data: chartData,
  });

  useEffect(() => {
    const newChartData = data?.map((item: any, i: number) => {
      const colors = chroma
        .scale(["#d73027", "#fee08b", "#1a9850", "#4575b4", "#542788"])
        .mode("lab")
        .colors(data?.length || 0);

      return {
        name: item?.name,
        value: percentageView ? item?.percentage : item?.value,
        color: addOpacityToHex(colors[i], 0.8),
      };
    });
    setChartData(newChartData);
  }, [data, percentageView]);

  return (
    <ItemContainer pb={4} {...restProps}>
      <ItemHeaderContainer>
        <HStack w={"full"} justify={"space-between"}>
          <P fontWeight={"semibold"}>{l.hgu_area_by_kabupaten}</P>

          <Checkbox onChange={(e: any) => setPercentageView(e.target.checked)}>
            %
          </Checkbox>
        </HStack>
      </ItemHeaderContainer>

      <CContainer p={4}>
        <Chart.Root chart={chart} mx="auto">
          <PieChart>
            <Tooltip
              cursor={false}
              animationDuration={100}
              content={<Chart.Tooltip hideLabel />}
            />
            <Pie
              innerRadius={70}
              outerRadius={100}
              isAnimationActive={false}
              data={chart.data}
              dataKey={chart.key("value")}
              nameKey="name"
            >
              <Label
                content={({ viewBox }) => (
                  <Chart.RadialText
                    viewBox={viewBox}
                    title={chart.getTotal("value").toLocaleString()}
                    description="users"
                  />
                )}
              />

              {chart.data.map((item) => (
                <Cell
                  key={item.color}
                  fill={chart.color(item.color)}
                  strokeWidth={0}
                />
              ))}
            </Pie>
          </PieChart>
        </Chart.Root>
      </CContainer>

      <CContainer mt={4}>
        <CContainer maxH={"150px"} className="scrollY" px={8} gap={2}>
          {chart.data.map((item: any) => {
            return (
              <HStack key={item?.name}>
                <Circle w={"10px"} h={"10px"} bg={item?.color} opacity={0.8} />
                <SimplePopover content={item?.name}>
                  <P lineClamp={1}>{item?.name}</P>
                </SimplePopover>

                <P textAlign={"right"} ml={"auto"}>{`${item?.value}`}</P>
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>

      <CContainer px={4} align={"center"} mt={"auto"} pt={4}>
        <HelperText textAlign={"center"}>{l.data_unit_ha}</HelperText>
      </CContainer>
    </ItemContainer>
  );
};

const DashboardPage = () => {
  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);

  // States
  const [dashboardData, setDashboardData] = useState<DashboardSummary>(
    summarizeDashboard(activeWorkspaces)
  );

  useEffect(() => {
    setDashboardData(summarizeDashboard(activeWorkspaces));
  }, [activeWorkspaces]);

  return (
    <PageContainer gap={R_GAP} pb={4} flex={1}>
      {empty(activeWorkspaces) && (
        <FeedbackNoData
          icon={<IconFoldersOff />}
          title={l.no_active_workspaces.title}
          description={l.no_active_workspaces.description}
        />
      )}

      {!empty(activeWorkspaces) && (
        <HStack wrap={"wrap"} align={"stretch"} gap={4}>
          <HGUArea data={dashboardData?.areaByTipeHak} flex={"1 1 300px"} />

          <HGUCount data={dashboardData?.countByTipeHak} flex={"1 1 300px"} />

          <HGUAreaByKabupaten
            data={dashboardData?.areaByKabupaten}
            flex={"1 1 300px"}
          />
        </HStack>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
