// Hardcoded Dashboard
// HGU_AREA each TIPEHAK sum the LUASTERTUL
// HGU_COUNT_PERCENTAGE calculate percentage each TIPEHAK
// HGU_AREA_BY_KABUPATEN each KABUPATEN sum the LUASTERTUL wich has TIPEHAK value

import BackButton from "@/components/ui-custom/BackButton";
import CContainer from "@/components/ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import HelperText from "@/components/ui-custom/HelperText";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import P from "@/components/ui-custom/P";
import TableComponent from "@/components/ui-custom/TableComponent";
import { Checkbox } from "@/components/ui/checkbox";
import { MenuItem } from "@/components/ui/menu";
import GeoJSONFilter from "@/components/widget/basemapOverlay/GeoJSONFilter";
import PageContainer from "@/components/widget/PageContainer";
import SimplePopover from "@/components/widget/SimplePopover";
import {
  Interface__ActiveWorkspace,
  Interface__ActiveWorkspacesByWorkspaceCategory,
  Interface__DashboardUtilitiesData,
  Interface__DashboardUtilitiesDataRow,
  Interface__PmftanSummary,
} from "@/constants/interfaces";
import { FilterGeoJSON } from "@/constants/types";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import { useConfirmFilterGeoJSON } from "@/context/useConfirmFilterGeoJSON";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import empty from "@/utils/empty";
import formatNumber from "@/utils/formatNumber";
import { Chart, useChart } from "@chakra-ui/charts";
import { Circle, HStack, Link, Tabs, useDisclosure } from "@chakra-ui/react";
import { IconFoldersOff } from "@tabler/icons-react";
import chroma from "chroma-js";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, Sector, Tooltip } from "recharts";

type DashboardStat = {
  name: string;
  value: number;
  percentage: number;
  active: boolean;
};
type DashboardSummary = {
  areaByTipeHak: DashboardStat[];
  countByTipeHak: DashboardStat[];
  areaByKabupaten: DashboardStat[];
};
type FilterKey = (typeof FILTER_KEYS)[number];

const PIE_INNER_RADIUS = 0;
const FILTER_KEYS = ["KABUPATEN", "TIPEHAK", "GUNATANAHK"] as const;
const COLORWAY = [
  "#e78ac3",
  "#66c2a5",
  "#8da0cb",
  "#a6d854",
  "#ffd92f",
  "#ff775c",
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
      if (activeSet.size === 0) continue;
      const val = norm(props[key]);

      if (val && activeSet.has(val)) return false;
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

        const luas = parseNum(props.LUASTERTUL);
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

  // make color scales from COLORWAY
  const scaleTipeHak = chroma.scale(COLORWAY).colors(domainTipeHak.size);
  const scaleKabupaten = chroma.scale(COLORWAY).colors(domainKabupaten.size);

  const areaByTipeHak: DashboardStat[] = Array.from(domainTipeHak)
    .map((name, i) => {
      const value = areaRaw[name] || 0;
      const active =
        lookup.TIPEHAK.size === 0 ? true : lookup.TIPEHAK.has(name);
      return {
        name,
        value: toFixedNum(value, 2),
        percentage: toFixedNum((value / (totalArea || 1)) * 100, 2),
        active,
        color: scaleTipeHak[i],
      };
    })
    .sort(byNameAsc);

  const countByTipeHak: DashboardStat[] = Array.from(domainTipeHak)
    .map((name, i) => {
      const value = countRaw[name] || 0;
      const active =
        lookup.TIPEHAK.size === 0 ? true : lookup.TIPEHAK.has(name);
      return {
        name,
        value: toFixedNum(value, 2),
        percentage: toFixedNum((value / (totalCount || 1)) * 100, 2),
        active,
        color: scaleTipeHak[i],
      };
    })
    .sort(byNameAsc);

  const areaByKabupaten: DashboardStat[] = Array.from(domainKabupaten)
    .map((kabupaten, i) => {
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
        color: scaleKabupaten[i],
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
    const newChartData = data?.map((item: any) => {
      return {
        ...item,
        name: item?.name,
        value: percentageView ? item?.percentage : item?.value,
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
                  innerRadius={PIE_INNER_RADIUS}
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
            <CContainer maxH={"200px"} className="scrollY" px={8} gap={2}>
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
    const newChartData = data?.map((item: any) => {
      return {
        ...item,
        name: item?.name,
        value: percentageView ? item?.percentage : item?.value,
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
                  innerRadius={PIE_INNER_RADIUS}
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
            <CContainer maxH={"200px"} className="scrollY" px={8} gap={2}>
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
    const newChartData = data?.map((item: any) => {
      return {
        ...item,
        name: item?.name,
        value: percentageView ? item?.percentage : item?.value,
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
                  innerRadius={PIE_INNER_RADIUS}
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
            <CContainer maxH={"200px"} className="scrollY" px={8} gap={2}>
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

const DashboardHGUData = (props: any) => {
  // Props
  const { search } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );
  const filterGeoJSON = useConfirmFilterGeoJSON((s) => s.confirmFilterGeoJSON);

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

  // console.log(dashboardData);

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
const DashboardHGU = () => {
  // Contexts
  const { l } = useLang();
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const [search] = useState<string>("");

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
          {/* <HStack>
            <SearchInput
              onChangeSetter={(input) => {
                setSearch(input);
              }}
              inputValue={search}
            />
          </HStack> */}

          <GeoJSONFilter />

          <DashboardHGUData search={search} />
        </CContainer>
      )}
    </PageContainer>
  );
};
const DetailUtilizationTrigger = (props: any) => {
  // Props
  const { children, row, workspace, allPmftanKeys, ...restProps } = props;
  const resolvedRow: Interface__DashboardUtilitiesDataRow = row;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `detail-utilization-${workspace?.title}`,
    open,
    onOpen,
    onClose
  );

  // States
  const cols = useMemo(() => resolvedRow?.cols, [resolvedRow]);

  return (
    <>
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Detail`} />
          </DisclosureHeader>

          <DisclosureBody px={1}>
            <CContainer gap={4}>
              <CContainer
                gap={1}
                pb={4}
                borderBottom={"1px solid"}
                borderColor={"border.muted"}
                px={3}
              >
                <P fontWeight={"medium"} color={"fg.subtle"}>
                  {l.garden_name}
                </P>
                <P>{cols.Nm_Kebun}</P>
              </CContainer>

              <CContainer
                gap={1}
                pb={4}
                borderBottom={"1px solid"}
                borderColor={"border.muted"}
                px={3}
              >
                <P fontWeight={"medium"} color={"fg.subtle"}>
                  {"No. HGU"}
                </P>
                <P>{cols?.no_HGU}</P>
              </CContainer>

              <CContainer
                gap={1}
                pb={4}
                borderBottom={"1px solid"}
                borderColor={"border.muted"}
                px={3}
              >
                <P fontWeight={"medium"} color={"fg.subtle"}>
                  {l.area_ha}
                </P>
                <P>{formatNumber(parseInt(`${cols?.Luas}`))}</P>
              </CContainer>

              <CContainer gap={2} px={3}>
                <P fontWeight={"medium"} color={"fg.subtle"}>
                  {l.area_utilization}
                </P>

                <CContainer gap={4}>
                  {allPmftanKeys?.map((key: string, idx: number) => {
                    const isLastIdx = idx === allPmftanKeys?.length - 1;

                    return (
                      <CContainer
                        key={key}
                        gap={1}
                        pb={4}
                        borderBottom={isLastIdx ? "" : "1px solid"}
                        borderColor={"border.subtle"}
                      >
                        <HStack align={"start"}>
                          <P
                            w={"100px"}
                            color={"fg.muted"}
                          >{`${l.utilization}`}</P>

                          <P>{key}</P>
                        </HStack>

                        <HStack align={"start"}>
                          <P w={"100px"} color={"fg.muted"}>{`${l.spatial}`}</P>

                          <P>
                            {`${formatNumber(
                              parseInt(`${cols?.Pmftan_Lhn[key]?.L_Spasial}`)
                            )}`}
                          </P>
                        </HStack>

                        <HStack align={"start"}>
                          <P w={"100px"} color={"fg.muted"}>{`${l.textual}`}</P>

                          <P>
                            {`${formatNumber(
                              parseInt(`${cols?.Pmftan_Lhn[key]?.L_Tekstual}`)
                            )}`}
                          </P>
                        </HStack>
                      </CContainer>
                    );
                  })}
                </CContainer>
              </CContainer>
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const DashboardUtilization = () => {
  // Contexts
  const { l } = useLang();
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const summary = getDashboardUtilitiesData(activeWorkspacesByCategory);

  // console.log("summary", summary);
  // console.log("active workspace by category", activeWorkspacesByCategory);

  // Utils
  function getProp(obj: Record<string, any>, keys: string[]) {
    for (const k of keys) {
      if (obj[k] != null) return obj[k];
    }
    return undefined;
  }
  function getDashboardUtilitiesData(
    categories: Interface__ActiveWorkspacesByWorkspaceCategory[]
  ): Interface__DashboardUtilitiesData[] {
    const result: Interface__DashboardUtilitiesData[] = [];

    for (const cat of categories) {
      for (const ws of cat.workspaces) {
        const workspaceData: Interface__DashboardUtilitiesData = {
          workspace: ws,
          rows: [],
        };

        // Filter layers by type
        const fillLayers = ws.layers.filter((l) => l.layer_type === "fill");
        const pointLayers = ws.layers.filter(
          (l) =>
            (l.layer_type === "point" || l.layer_type === "symbol") &&
            l.is_boundary
        );

        // Count points (patok) per no_HGU
        const pointCountMap = new Map<string, number>();
        for (const layer of pointLayers) {
          const features = layer.data?.geojson?.features;
          if (!Array.isArray(features)) continue;

          for (const f of features) {
            const props = f.properties || {};
            const no_HGU = getProp(props, [
              "No_HGU",
              "no_HGU",
              "No_Hak",
              "no_hgu",
            ]);
            if (!no_HGU) continue;
            pointCountMap.set(no_HGU, (pointCountMap.get(no_HGU) || 0) + 1);
          }
        }

        // Group fill data by Nm_Kebun + no_HGU
        const grouped = new Map<
          string,
          {
            Nm_Kebun: string;
            no_HGU: string;
            Pmftan_Lhn: Record<string, Interface__PmftanSummary>;
            L_Spasial: number;
            L_Tekstual: number;
            Luas: number;
          }
        >();

        for (const layer of fillLayers) {
          const features = layer.data?.geojson?.features;
          if (!Array.isArray(features)) continue;

          for (const f of features) {
            const props = f.properties || {};
            const Nm_Kebun = getProp(props, [
              "Nm_Kebun",
              "nm_kebun",
              "Nama_Kebun",
            ]);
            const no_HGU = getProp(props, [
              "No_HGU",
              "no_HGU",
              "No_Hak",
              "no_hgu",
            ]);
            const pmftan = getProp(props, ["Pmftan_Lhn", "pmftan_lhn"]);
            if (!Nm_Kebun || !no_HGU) continue;

            const L_Spasial = Number(props["L_Spasial"]) || 0;
            const L_Tekstual = Number(props["L_Tekstual"]) || 0;
            const key = `${Nm_Kebun}__${no_HGU}`;

            if (!grouped.has(key)) {
              grouped.set(key, {
                Nm_Kebun,
                no_HGU,
                Pmftan_Lhn: {},
                L_Spasial: 0,
                L_Tekstual: 0,
                Luas: 0,
              });
            }

            const kebun = grouped.get(key)!;
            const pmKey = String(pmftan || "UNKNOWN");

            // Ensure Pmftan_Lhn entry exists
            if (!kebun.Pmftan_Lhn[pmKey]) {
              kebun.Pmftan_Lhn[pmKey] = {
                L_Spasial: 0,
                L_Tekstual: 0,
                Luas: 0,
              };
            }

            // Update Pmftan_Lhn summary
            const pmData = kebun.Pmftan_Lhn[pmKey];
            pmData.L_Spasial += L_Spasial;
            pmData.L_Tekstual += L_Tekstual;
            pmData.Luas = pmData.L_Spasial + pmData.L_Tekstual;

            // Update kebun-level totals
            kebun.L_Spasial += L_Spasial;
            kebun.L_Tekstual += L_Tekstual;
            kebun.Luas = kebun.L_Spasial + kebun.L_Tekstual;
          }
        }

        // Build final rows
        for (const [, item] of grouped.entries()) {
          const total_boundary = pointCountMap.get(item.no_HGU) || 0;

          workspaceData.rows.push({
            cols: {
              Nm_Kebun: item.Nm_Kebun,
              no_HGU: item.no_HGU,
              Pmftan_Lhn: item.Pmftan_Lhn,
              L_Spasial: item.L_Spasial,
              L_Tekstual: item.L_Tekstual,
              Luas: item.Luas,
              total_boundary,
            },
          });
        }

        result.push(workspaceData);
      }
    }

    return result;
  }

  return (
    <PageContainer pb={4} flex={1} overflowY={"auto"}>
      {empty(activeWorkspacesByCategory) && (
        <FeedbackNoData
          icon={<IconFoldersOff />}
          title={l.no_active_workspaces.title}
          description={l.no_active_workspaces.description}
        />
      )}

      {!empty(activeWorkspacesByCategory) && (
        <CContainer gap={4}>
          {summary?.map((item: Interface__DashboardUtilitiesData) => {
            const allPmftanKeys = Array.from(
              new Set(
                item?.rows?.flatMap((r) =>
                  Object.keys(r?.cols?.Pmftan_Lhn || {})
                )
              )
            );
            const ths = [
              {
                th: l.garden_name,
                sortable: true,
              },
              {
                th: "No. HGU",
                sortable: true,
              },
              {
                th: l.area_ha,
                sortable: true,
              },
              // Add dynamic headers for each Pmftan_Lhn key: L_Spasial + L_Tekstual
              ...allPmftanKeys.flatMap((key) => [
                { th: `${key} (${l.spatial})`, sortable: true },
                { th: `${key} (${l.textual})`, sortable: true },
              ]),
            ];
            const tds = item?.rows?.map((r: any, i: number) => {
              return {
                id: r.id,
                index: i,
                originalData: r,
                columnsFormat: [
                  {
                    value: r?.cols.Nm_Kebun,
                    td: r?.cols.Nm_Kebun,
                  },
                  {
                    value: r?.cols.no_HGU,
                    td: formatNumber(r?.cols.no_HGU),
                    dataType: "number",
                  },
                  {
                    value: r?.cols.Luas,
                    td: formatNumber(parseInt(r?.cols.Luas)),
                    dataType: "number",
                  },
                  // Fill dynamic cells for each Pmftan_Lhn
                  ...allPmftanKeys.flatMap((key) => {
                    const val = r?.cols?.Pmftan_Lhn?.[key] || {};
                    return [
                      {
                        value: val?.L_Spasial ?? 0,
                        td: formatNumber(parseInt(val?.L_Spasial ?? 0)),
                        dataType: "number",
                      },
                      {
                        value: val?.L_Tekstual ?? 0,
                        td: formatNumber(parseInt(val?.L_Tekstual ?? 0)),
                        dataType: "number",
                      },
                    ];
                  }),
                ],
              };
            });
            const rowOptions = [
              {
                label: "Detail",
                independent: true,
                component: (rowData: any) => {
                  return (
                    <DetailUtilizationTrigger
                      row={rowData.originalData}
                      workspace={item?.workspace}
                      allPmftanKeys={allPmftanKeys}
                      w={"full"}
                    >
                      <MenuItem value="detail">Detail</MenuItem>
                    </DetailUtilizationTrigger>
                  );
                },
              },
            ];

            return (
              <CContainer gap={2}>
                <P fontWeight={"semibold"} ml={"2px"}>
                  {item?.workspace?.title}
                </P>

                <TableComponent
                  flex={1}
                  originalData={summary}
                  ths={ths}
                  tds={tds}
                  rowOptions={rowOptions}
                />
              </CContainer>
            );
          })}
        </CContainer>
      )}
    </PageContainer>
  );
};

const DashboardPage = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer flex={1} maxH={"calc(100% - 54px)"}>
      <Tabs.Root
        as={CContainer}
        flex={1}
        defaultValue="hgu"
        colorPalette={themeConfig.colorPalette}
        maxH={"full"}
      >
        <Tabs.List position={"sticky"} top={"54px"} bg={"bgContent"} zIndex={4}>
          <Tabs.Trigger value="hgu" asChild>
            <Link unstyled href="#hgu">
              HGU
            </Link>
          </Tabs.Trigger>
          <Tabs.Trigger value="utilization" asChild>
            <Link unstyled href="#utilization">
              {l.utilization}
            </Link>
          </Tabs.Trigger>
        </Tabs.List>

        <>
          <Tabs.Content
            as={CContainer}
            flex={1}
            value="hgu"
            p={0}
            overflowY={"auto"}
          >
            <DashboardHGU />
          </Tabs.Content>

          <Tabs.Content
            as={CContainer}
            flex={1}
            value="utilization"
            p={0}
            overflowY={"auto"}
          >
            <DashboardUtilization />
          </Tabs.Content>
        </>
      </Tabs.Root>
    </CContainer>
  );
};

export default DashboardPage;
