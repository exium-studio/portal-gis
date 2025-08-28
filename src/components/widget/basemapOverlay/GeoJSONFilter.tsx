import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import P from "@/components/ui-custom/P";
import { Interface__FilterOptionGroup } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import { useConfirmFilterGeoJSON } from "@/context/useConfirmFilterGeoJSON";
import { useFilterGeoJSON } from "@/context/useFilterGeoJSON";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import { filterOptionGroups } from "@/utils/filterOptionGroups";
import { HStack, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FilterCheckbox from "../FilterCheckbox";

const GeoJSONFilter = () => {
  // Context
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const filterGeoJSON = useFilterGeoJSON((s) => s.filterGeoJSON);
  const setConfirmFilterGeoJSON = useConfirmFilterGeoJSON(
    (s) => s.setConfirmFilterGeoJSON
  );
  const halfPanel = useLayout((s) => s.halfPanel);
  const resetFilterGeoJSON = useFilterGeoJSON((s) => s.clearFilterGeoJSON);
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const [filterOptions, setFilterOptions] = useState<
    Interface__FilterOptionGroup[]
  >([]);

  useEffect(() => {
    const activeWorkspaces = activeWorkspacesByCategory.flatMap(
      (activeWorkspace) => activeWorkspace?.workspaces
    );
    setFilterOptions(filterOptionGroups(activeWorkspaces, filterGeoJSON));
  }, [activeWorkspacesByCategory]);

  return (
    <ItemContainer bg={"body"} borderRadius={themeConfig.radii.container}>
      <ItemHeaderContainer justify={"space-between"}>
        <P fontWeight={"semibold"}>Filter Dashboard</P>
      </ItemHeaderContainer>

      <SimpleGrid gap={4} columns={halfPanel ? 1 : [1, null, null, 3]} p={4}>
        {filterOptions?.map((option, i) => (
          <CContainer
            key={option.property}
            border={i === filterOptions.length - 1 ? "none" : ""}
            gap={2}
          >
            <P color={"fg.subtle"}>{option.property}</P>

            <SimpleGrid gap={4} columns={[2]}>
              {option.values?.map((value) => (
                <FilterCheckbox
                  key={value.value}
                  option={option}
                  value={value}
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                />
              ))}
            </SimpleGrid>
          </CContainer>
        ))}
      </SimpleGrid>

      <HStack
        p={4}
        // borderTop={"1px solid"}
        borderColor={"border.muted"}
        justify={"end"}
      >
        <BButton
          variant={"outline"}
          onClick={() => {
            setFilterOptions((prev) =>
              prev.map((group) => ({
                ...group,
                values: group.values.map((v) => ({
                  ...v,
                  active: true,
                })),
              }))
            );
            resetFilterGeoJSON();
          }}
          size={"sm"}
        >
          Reset
        </BButton>

        <BButton
          size={"sm"}
          colorPalette={themeConfig.colorPalette}
          onClick={() => setConfirmFilterGeoJSON(filterGeoJSON)}
        >
          {l.apply}
        </BButton>
      </HStack>
    </ItemContainer>
  );
};

export default GeoJSONFilter;
