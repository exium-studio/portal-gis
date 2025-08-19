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
import SearchInput from "@/components/ui-custom/SearchInput";
import { Checkbox } from "@/components/ui/checkbox";
import GeoJSONFilter from "@/components/widget/basemapOverlay/GeoJSONFilter";
import PageContainer from "@/components/widget/PageContainer";
import SimplePopover from "@/components/widget/SimplePopover";
import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import { FilterGeoJSON, useFilterGeoJSON } from "@/context/useFilterGeoJSON";
import useLang from "@/context/useLang";
import { addOpacityToHex } from "@/utils/addOpacityToHex";
import empty from "@/utils/empty";
import { Chart, useChart } from "@chakra-ui/charts";
import { Circle, HStack } from "@chakra-ui/react";
import { IconFoldersOff } from "@tabler/icons-react";
import chroma from "chroma-js";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, Sector, Tooltip } from "recharts";

type DashboardStat = {
  name: string;
  value: number;
  percentage: number;
  active: boolean; // NEW
};
type DashboardSummary = {
  areaByTipeHak: DashboardStat[];
  countByTipeHak: DashboardStat[];
  areaByKabupaten: DashboardStat[];
};
type FilterKey = (typeof FILTER_KEYS)[number];

const FILTER_KEYS = ["KABUPATEN", "TIPEHAK", "GUNATANAHK"] as const;
const COLORWAY = [
  "#66c2a5",
  "#fc8d62",
  "#8da0cb",
  "#e78ac3",
  "#a6d854",
  "#ffd92f",
  "#e5c494",
  "#b3b3b3",
].reverse();

const summarizeDashboard = (
  workspaces: Interface__ActiveWorkspace[],
  filter: { [K in FilterKey]: string[] }
): DashboardSummary => {
  const areaRaw: Record<string, number> = {};
  const countRaw: Record<string, number> = {};
  const areaByKabupatenRaw: Record<string, Record<string, number>> = {};

  const domainTipeHak = new Set<string>();
  const domainKabupaten = new Set<string>();

  let totalArea = 0;
  let totalCount = 0;

  const norm = (s: unknown) => (typeof s === "string" ? s.trim() : "");
  const parseNum = (n: unknown) => {
    const x = Number(n);
    return Number.isFinite(x) ? x : NaN;
  };

  const lookup: Record<FilterKey, Set<string>> = {
    KABUPATEN: new Set(filter?.KABUPATEN ?? []),
    TIPEHAK: new Set(filter?.TIPEHAK ?? []),
    GUNATANAHK: new Set(filter?.GUNATANAHK ?? []),
  };

  const passFilter = (props: Record<string, unknown>) => {
    for (const key of FILTER_KEYS) {
      const activeSet = lookup[key];
      if (activeSet.size === 0) continue; // empty = semua lolos utk key tsb
      const val = norm(props[key]);

      if (val && activeSet.has(val)) return false;

      // if value is in filter → reject
      if (activeSet.has(val)) return false;
    }
    return true;
  };

  for (const ws of workspaces ?? []) {
    for (const layer of ws.layers ?? []) {
      const features = layer.data?.geojson?.features ?? [];
      for (const feature of features) {
        const props = (feature?.properties ?? {}) as Record<string, unknown>;

        const tipeHak = norm(props.TIPEHAK);
        const kabupaten = norm(props.KABUPATEN);
        if (tipeHak) domainTipeHak.add(tipeHak);
        if (kabupaten) domainKabupaten.add(kabupaten);

        if (!passFilter(props)) continue;

        const luas = parseNum(props.LUASPETA);
        if (!tipeHak || !Number.isFinite(luas)) continue;

        areaRaw[tipeHak] = (areaRaw[tipeHak] || 0) + luas;
        totalArea += luas;

        countRaw[tipeHak] = (countRaw[tipeHak] || 0) + 1;
        totalCount++;

        if (kabupaten) {
          areaByKabupatenRaw[kabupaten] ||= {};
          areaByKabupatenRaw[kabupaten][tipeHak] =
            (areaByKabupatenRaw[kabupaten][tipeHak] || 0) + luas;
        }
      }
    }
  }

  const byNameAsc = <T extends { name: string }>(a: T, b: T) =>
    a.name.localeCompare(b.name, "id", { sensitivity: "base" });
  const toFixedNum = (v: number, d: number) =>
    Number.isFinite(v) ? parseFloat(v.toFixed(d)) : 0;

  const areaByTipeHak: DashboardStat[] = Array.from(domainTipeHak)
    .map((name) => {
      const value = areaRaw[name] || 0;
      const active =
        lookup.TIPEHAK.size === 0 ? true : lookup.TIPEHAK.has(name);
      return {
        name,
        value: toFixedNum(value, 2),
        percentage: toFixedNum((value / (totalArea || 1)) * 100, 2),
        active,
      };
    })
    .sort(byNameAsc);

  const countByTipeHak: DashboardStat[] = Array.from(domainTipeHak)
    .map((name) => {
      const value = countRaw[name] || 0;
      const active =
        lookup.TIPEHAK.size === 0 ? true : lookup.TIPEHAK.has(name);
      return {
        name,
        value: toFixedNum(value, 2),
        percentage: toFixedNum((value / (totalCount || 1)) * 100, 2),
        active,
      };
    })
    .sort(byNameAsc);

  const areaByKabupaten: DashboardStat[] = Array.from(domainKabupaten)
    .map((kabupaten) => {
      const totalKabupaten = Object.values(
        areaByKabupatenRaw[kabupaten] ?? []
      ).reduce((sum, v) => sum + v, 0);
      const active =
        lookup.KABUPATEN.size === 0 ? true : lookup.KABUPATEN.has(kabupaten);
      return {
        name: kabupaten,
        value: toFixedNum(totalKabupaten, 1),
        percentage: toFixedNum((totalKabupaten / (totalArea || 1)) * 100, 1),
        active,
      };
    })
    .sort(byNameAsc);

  return { areaByTipeHak, countByTipeHak, areaByKabupaten };
};
const applyFilterToDashboard = (
  original: DashboardSummary,
  filter: FilterGeoJSON
): DashboardSummary => {
  const lookup: Record<keyof FilterGeoJSON, Set<string>> = {
    KABUPATEN: new Set(filter?.KABUPATEN ?? []),
    TIPEHAK: new Set(filter?.TIPEHAK ?? []),
    GUNATANAHK: new Set(filter?.GUNATANAHK ?? []),
  };

  const filterStat = (data: DashboardStat[], key: keyof FilterGeoJSON) =>
    data.filter((item) => !lookup[key].has(item.name));

  return {
    areaByTipeHak: filterStat(original.areaByTipeHak, "TIPEHAK"),
    countByTipeHak: filterStat(original.countByTipeHak, "TIPEHAK"),
    areaByKabupaten: filterStat(original.areaByKabupaten, "KABUPATEN"),
  };
};

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
        .scale(COLORWAY)
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

      {empty(data) && <FeedbackNoData />}

      {!empty(data) && (
        <>
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
                  activeShape={<Sector outerRadius={110} />}
                >
                  {chart.data?.map((item) => (
                    <Cell
                      key={item.name}
                      strokeWidth={0}
                      fill={chart.color(item.color)}
                    />
                  ))}
                </Pie>
              </PieChart>
            </Chart.Root>
          </CContainer>

          <CContainer mt={4}>
            <CContainer maxH={"150px"} className="scrollY" px={8} gap={2}>
              {chart.data?.map((item: any) => {
                return (
                  <HStack key={item?.name}>
                    <Circle
                      w={"10px"}
                      h={"10px"}
                      bg={item?.color}
                      opacity={0.8}
                    />
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
        </>
      )}
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
        .scale(COLORWAY)
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

      {empty(data) && <FeedbackNoData />}

      {!empty(data) && (
        <>
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
                  activeShape={<Sector outerRadius={110} />}
                >
                  {chart.data?.map((item) => (
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
              {chart.data?.map((item: any) => {
                return (
                  <HStack key={item?.name}>
                    <Circle
                      w={"10px"}
                      h={"10px"}
                      bg={item?.color}
                      opacity={0.8}
                    />
                    <SimplePopover content={item?.name}>
                      <P lineClamp={1}>{item?.name}</P>
                    </SimplePopover>

                    <P textAlign={"right"} ml={"auto"}>{`${item?.value}`}</P>
                  </HStack>
                );
              })}
            </CContainer>
          </CContainer>
        </>
      )}
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
        .scale(COLORWAY)
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

      {empty(data) && <FeedbackNoData />}

      {!empty(data) && (
        <>
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
                  activeShape={<Sector outerRadius={110} />}
                >
                  {chart.data?.map((item) => (
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
              {chart.data?.map((item: any) => {
                return (
                  <HStack key={item?.name}>
                    <Circle
                      w={"10px"}
                      h={"10px"}
                      bg={item?.color}
                      opacity={0.8}
                    />
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
        </>
      )}
    </ItemContainer>
  );
};

const DashboardData = (props: any) => {
  // Props
  const { search } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );
  const filterGeoJSON = useFilterGeoJSON((s) => s.filterGeoJSON);

  // States
  const searchTerm = useMemo(() => search?.toLowerCase() || "", [search]);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
    null
  );
  const [filteredDashboardData, setFilteredDashboardData] =
    useState<DashboardSummary | null>(dashboardData);
  const dashboardItems = [
    {
      name: l.hgu_area,
      component: (
        <HGUArea
          data={filteredDashboardData?.areaByTipeHak}
          flex={"1 1 300px"}
        />
      ),
    },
    {
      name: l.hgu_count,
      component: (
        <HGUCount
          data={filteredDashboardData?.countByTipeHak}
          flex={"1 1 300px"}
        />
      ),
    },
    {
      name: l.hgu_area_by_kabupaten,
      component: (
        <HGUAreaByKabupaten
          data={filteredDashboardData?.areaByKabupaten}
          flex={"1 1 300px"}
        />
      ),
    },
  ];
  const filteredDashboardItems = useMemo(() => {
    return dashboardItems.filter((item) => {
      return (
        <Fragment key={item.name}>
          {item.name.toLowerCase().includes(searchTerm)}
        </Fragment>
      );
    });
  }, [searchTerm, filteredDashboardData]);

  // Handle init dashboard data when active workspces by category changes
  useEffect(() => {
    const newActiveWorkspaces = activeWorkspacesByCategory.flatMap(
      (activeWorkspace) => activeWorkspace?.workspaces
    );
    setDashboardData(summarizeDashboard(newActiveWorkspaces, filterGeoJSON));
  }, [activeWorkspacesByCategory, filterGeoJSON]);

  // Handle filter
  useEffect(() => {
    if (dashboardData) {
      setFilteredDashboardData(
        applyFilterToDashboard(dashboardData, filterGeoJSON)
      );
    }
  }, [dashboardData, filterGeoJSON]);

  return (
    <HStack wrap={"wrap"} align={"stretch"} gap={4}>
      {empty(filteredDashboardItems) && <FeedbackNoData />}

      {!empty(filteredDashboardItems) &&
        filteredDashboardItems.map((item) => item.component)}
    </HStack>
  );
};

const DashboardPage = () => {
  const { l } = useLang();

  // Contexts
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const [search, setSearch] = useState<string>("");

  return (
    <PageContainer pb={4} flex={1}>
      {empty(activeWorkspacesByCategory) && (
        <FeedbackNoData
          icon={<IconFoldersOff />}
          title={l.no_active_workspaces.title}
          description={l.no_active_workspaces.description}
        />
      )}

      {!empty(activeWorkspacesByCategory) && (
        <CContainer gap={4} flex={1}>
          <HStack>
            <SearchInput
              onChangeSetter={(input) => {
                setSearch(input);
              }}
              inputValue={search}
            />

            <GeoJSONFilter />
          </HStack>

          <DashboardData search={search} />
        </CContainer>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
