import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import P from "@/components/ui-custom/P";
import { Interface__FilterOptionGroup } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import { useFilterGeoJSON } from "@/context/useFilterGeoJSON";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import { filterOptionGroups } from "@/utils/filterOptionGroups";
import { SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import FilterCheckbox from "../FilterCheckbox";

const GeoJSONFilter = () => {
  // Context
  const { themeConfig } = useThemeConfig();
  const filterGeoJSON = useFilterGeoJSON((s) => s.filterGeoJSON);
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

  // console.log("filterGeoJSON", filterGeoJSON);
  // console.log("filterOptions", filterOptions);

  return (
    <ItemContainer
      gap={4}
      bg={"body"}
      borderRadius={themeConfig.radii.container}
    >
      <ItemHeaderContainer justify={"space-between"} p={2} pl={4}>
        <P fontWeight={"semibold"}>Filter Dashboard</P>

        <BButton
          variant={"ghost"}
          colorPalette={themeConfig.colorPalette}
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
      </ItemHeaderContainer>

      <SimpleGrid
        gap={4}
        columns={halfPanel ? 1 : [1, null, null, 3]}
        px={4}
        pb={4}
      >
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
    </ItemContainer>

    // <PopoverRoot open={open}>
    //   <PopoverTrigger>
    //     {/* <OverlayItemContainer> */}
    //     <Tooltip content={l.basemap_filter}>
    //       <BButton
    //         ref={triggerRef}
    //         unclicky
    //         // iconButton
    //         variant={"outline"}
    //         w={"full"}
    //         onClick={onToggle}
    //         size={"md"}
    //       >
    //         <Icon boxSize={5}>
    //           <IconFilter stroke={1.5} />
    //         </Icon>
    //         Filter
    //       </BButton>
    //     </Tooltip>
    //     {/* </OverlayItemContainer> */}
    //   </PopoverTrigger>

    //   <Portal>
    //     <PopoverPositioner>
    //       <PopoverContent
    //         ref={contentRef}
    //         p={0}
    //         mr={"2px"}
    //         w={"200px"}
    //         pointerEvents={"auto"}
    //       >
    //         <MenuHeaderContainer>
    //           <HStack>
    //             <Icon boxSize={5} mb={"1px"}>
    //               <IconFilter stroke={1.5} />
    //             </Icon>
    //             <P fontWeight={"bold"}>Filter Dashboard</P>
    //           </HStack>
    //         </MenuHeaderContainer>

    //         <CContainer
    //           pt={1}
    //           className="scrollY"
    //           maxH={"calc(50dvh - 56px)"}
    //           w={"calc(100%)"}
    //           px={1}
    //         >
    //           <AccordionRoot multiple>
    //             {filterOptions?.map((option, i) => (
    //               <AccordionItem
    //                 key={option.property}
    //                 value={option.property}
    //                 px={2}
    //                 border={i === filterOptions.length - 1 ? "none" : ""}
    //               >
    //                 <AccordionItemTrigger>
    //                   <HStack>
    //                     <P>{option.property}</P>
    //                   </HStack>
    //                 </AccordionItemTrigger>

    //                 <AccordionItemContent>
    //                   <CContainer gap={4}>
    //                     {option.values?.map((value) => (
    //                       <FilterCheckbox
    //                         key={value.value}
    //                         option={option}
    //                         value={value}
    //                         filterOptions={filterOptions}
    //                         setFilterOptions={setFilterOptions}
    //                       />
    //                     ))}
    //                   </CContainer>
    //                 </AccordionItemContent>
    //               </AccordionItem>
    //             ))}
    //           </AccordionRoot>
    //         </CContainer>

    //         <CContainer p={1}>
    //           <BButton
    //             variant={"outline"}
    //             onClick={() => {
    //               setFilterOptions((prev) =>
    //                 prev.map((group) => ({
    //                   ...group,
    //                   values: group.values.map((v) => ({
    //                     ...v,
    //                     active: true,
    //                   })),
    //                 }))
    //               );
    //               resetFilterGeoJSON();
    //             }}
    //             size={"md"}
    //           >
    //             Reset
    //           </BButton>
    //         </CContainer>
    //       </PopoverContent>
    //     </PopoverPositioner>
    //   </Portal>
    // </PopoverRoot>
  );
};

export default GeoJSONFilter;
