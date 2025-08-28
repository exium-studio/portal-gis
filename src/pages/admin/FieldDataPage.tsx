import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import P from "@/components/ui-custom/P";
import SearchInput from "@/components/ui-custom/SearchInput";
import SelectInput from "@/components/ui-custom/SelectInput";
import TableComponent from "@/components/ui-custom/TableComponent";
import { Field } from "@/components/ui/field";
import { Tooltip } from "@/components/ui/tooltip";
import PageContainer from "@/components/widget/PageContainer";
import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import {
  Interface__ActiveLayer,
  Interface__SelectOption,
} from "@/constants/interfaces";
import { FIT_BOUNDS_PADDING } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useMapViewState from "@/context/useMapViewState";
import { useThemeConfig } from "@/context/useThemeConfig";
import empty from "@/utils/empty";
import { computeBboxAndCenter } from "@/utils/geospatial";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { IconFoldersOff, IconZoomInArea } from "@tabler/icons-react";
import { useMemo, useState } from "react";

const DEFAULT_FILTER_CONFIG = {
  no_hak: "",
  province: [],
  kabupaten: [],
};
const PROVINCE_KEYS = ["province", "provinsi", "propinsi"];
const KABUPATEN_KEYS = ["kabupaten", "kab"];

const ViewField = (props: any) => {
  // Props
  const { field, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const mapRef = useMapViewState((s) => s.mapRef);

  // States
  const formattedFeatureCollection = [
    {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: field.geometry,
        },
      ],
    },
  ];
  const fieldBBoxAndCenter = computeBboxAndCenter(
    formattedFeatureCollection as any
  );

  // Utils
  function onViewLayers() {
    if (mapRef.current && fieldBBoxAndCenter?.bbox) {
      const [minLng, minLat, maxLng, maxLat] = fieldBBoxAndCenter?.bbox;
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: FIT_BOUNDS_PADDING,
          duration: MAP_TRANSITION_DURATION,
          essential: true,
        }
      );
    }
  }

  return (
    <Tooltip content={l.fit_bounds}>
      <BButton
        unclicky
        iconButton
        variant={"ghost"}
        onClick={onViewLayers}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconZoomInArea stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const DataTable = (props: any) => {
  // Props
  const { filteredFields, ...restProps } = props;

  // States
  const ths = [
    {
      th: "No. Hak",
      sortable: true,
    },
    {
      th: "NIB",
      sortable: true,
    },
    {
      th: "",
      wrapperProps: {
        justify: "center",
      },
      tableColumnHeaderProps: {
        w: "32px",
      },
    },
  ];
  const tds = filteredFields.map((field: any, i: number) => {
    const propsNormalized = normalizeKeys(field.properties);

    return {
      originalData: field,
      index: i,
      columnsFormat: [
        {
          value: propsNormalized.hak,
          td: propsNormalized.hak || "-",
        },
        {
          value: propsNormalized.nib,
          td: propsNormalized.nib || "-",
        },
        {
          value: "",
          td: <ViewField field={field} />,
          wrapperProps: {
            justify: "center",
            w: "48px",
          },
          tableCellProps: {
            w: "32px",
          },
        },
      ],
    };
  });

  return (
    <TableComponent
      ths={ths}
      tds={tds}
      minH={"360px"}
      // maxH={"400px"}
      flex={1}
      {...restProps}
    />
  );
};

const FieldDataPage = () => {
  // Hooks
  const { l } = useLang();

  // Contexts
  const { themeConfig } = useThemeConfig();
  const halfPanel = useLayout((s) => s.halfPanel);
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const [filterConfig, setFilterConfig] = useState<any>(DEFAULT_FILTER_CONFIG);
  const { allFields, allProvinces, allKabupatens } = useMemo(() => {
    if (!activeWorkspacesByCategory) {
      return { allFields: [], allProvinces: [], allKabupatens: [] };
    }

    const layers: Interface__ActiveLayer[] = [];
    const provinces = new Set<string>();
    const kabupatens = new Set<string>();

    for (const category of activeWorkspacesByCategory) {
      for (const workspace of category.workspaces) {
        for (const layer of workspace.layers ?? []) {
          layers.push(layer);

          for (const feature of layer.data?.geojson.features ?? []) {
            const props = feature.properties ?? {};

            // normalize props keys → lowercase
            const normalized: Record<string, unknown> = {};
            for (const key in props) {
              normalized[key.toLowerCase()] = props[key];
            }

            // province coverage
            for (const key of PROVINCE_KEYS) {
              const val = normalized[key] as string | undefined;
              if (val) {
                provinces.add(val);
                break;
              }
            }

            // kabupaten coverage
            for (const key of KABUPATEN_KEYS) {
              const val = normalized[key] as string | undefined;
              if (val) {
                kabupatens.add(val);
                break;
              }
            }
          }
        }
      }
    }

    return {
      allFields: layers,
      allProvinces: Array.from(provinces).sort(),
      allKabupatens: Array.from(kabupatens).sort(),
    };
  }, [activeWorkspacesByCategory]);

  const filteredFields = useMemo<Interface__SelectOption[]>(() => {
    if (!allFields) return [];

    const provinceFilterIds = (filterConfig.province ?? []).map(
      (p: Interface__SelectOption) => p.id
    );
    const kabupatenFilterIds = (filterConfig.kabupaten ?? []).map(
      (k: Interface__SelectOption) => k.id
    );
    const noHakFilter = filterConfig.no_hak ?? "";

    const isEmptyFilter =
      provinceFilterIds.length === 0 &&
      kabupatenFilterIds.length === 0 &&
      !noHakFilter;

    if (isEmptyFilter) return [];

    const results: any[] = [];

    for (const layer of allFields) {
      for (const feature of layer.data?.geojson.features ?? []) {
        const props = feature.properties ?? {};

        // normalize props keys → lowercase
        const normalized: Record<string, unknown> = {};
        for (const key in props) {
          normalized[key.toLowerCase()] = props[key];
        }

        const id = normalized["id"];
        if (!id) continue;

        // province filter
        let provinceOk = true;
        if (provinceFilterIds.length > 0) {
          const provinceVal = PROVINCE_KEYS.map((k) => normalized[k]).find(
            (v) => v !== undefined
          ) as string | undefined;
          provinceOk = provinceVal
            ? provinceFilterIds.includes(provinceVal)
            : false;
        }

        // kabupaten filter
        let kabupatenOk = true;
        if (kabupatenFilterIds.length > 0) {
          const kabVal = KABUPATEN_KEYS.map((k) => normalized[k]).find(
            (v) => v !== undefined
          ) as string | undefined;
          kabupatenOk = kabVal ? kabupatenFilterIds.includes(kabVal) : false;
        }

        // no_hak filter
        let noHakOk = true;
        if (noHakFilter) {
          const noHakVal = normalized["hak"] as string | undefined;
          noHakOk = noHakVal ? noHakVal.includes(noHakFilter) : false;
        }

        if (provinceOk && kabupatenOk && noHakOk) {
          results.push(feature);
        }
      }
    }

    return results;
  }, [allFields, filterConfig]);

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
        <CContainer gap={4} flex={1} overflowY={"auto"}>
          <ItemContainer
            p={3}
            borderRadius={themeConfig.radii.container}
            bg={"body"}
          >
            <SimpleGrid gap={4} columns={halfPanel ? 1 : [1, null, null, 3]}>
              <Field label={"No hak"}>
                <SearchInput
                  placeholder="0200*********"
                  onChangeSetter={(input) => {
                    setFilterConfig({
                      ...filterConfig,
                      no_hak: input,
                    });
                  }}
                  inputValue={filterConfig.no_hak}
                />
              </Field>

              <Field label={l.province}>
                <SelectInput
                  multiple
                  initialOptions={allProvinces?.map((p) => ({
                    id: p,
                    label: p,
                  }))}
                  onConfirm={(input) => {
                    setFilterConfig({
                      ...filterConfig,
                      province: input,
                    });
                  }}
                  inputValue={filterConfig.province}
                />
              </Field>

              <Field label={"Kabupaten"}>
                <SelectInput
                  multiple
                  initialOptions={allKabupatens?.map((k) => ({
                    id: k,
                    label: k,
                  }))}
                  onConfirm={(input) => {
                    setFilterConfig({
                      ...filterConfig,
                      kabupaten: input,
                    });
                  }}
                  inputValue={filterConfig.kabupaten}
                />
              </Field>
            </SimpleGrid>
          </ItemContainer>

          <CContainer gap={2} flex={1} overflowY={"auto"}>
            <HStack justify={"space-between"} gap={4} wrap={"wrap"} px={2}>
              <P fontWeight={"medium"} color={"fg.subtle"}>
                {l.result}
              </P>

              <P fontWeight={"medium"} color={"fg.subtle"}>
                {`Total: ${filteredFields.length}`}
              </P>
            </HStack>

            <CContainer
              borderRadius={themeConfig.radii.container}
              bg={"body"}
              flex={1}
              className="scrollY"
              overflowY={"auto"}
            >
              {empty(filteredFields) && (
                <FeedbackNoData description={l.no_data_feedback.description2} />
              )}

              {!empty(filteredFields) && (
                <DataTable filteredFields={filteredFields} />
              )}
            </CContainer>
          </CContainer>
        </CContainer>
      )}
    </PageContainer>
  );
};

export default FieldDataPage;
