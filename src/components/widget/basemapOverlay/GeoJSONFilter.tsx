import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import P from "@/components/ui-custom/P";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import { Interface__FilterOptionGroup } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import { useFilterGeoJSON } from "@/context/useFilterGeoJSON";
import useLang from "@/context/useLang";
import useClickOutside from "@/hooks/useClickOutside";
import { filterOptionGroups } from "@/utils/filterOptionGroups";
import {
  HStack,
  Icon,
  PopoverPositioner,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { IconFilter } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import FilterCheckbox from "../FilterCheckbox";
import MenuHeaderContainer from "../MenuHeaderContainer";

const GeoJSONFilter = () => {
  // Hooks
  const { l } = useLang();

  // Context
  const filterGeoJSON = useFilterGeoJSON((s) => s.filterGeoJSON);
  const resetFilterGeoJSON = useFilterGeoJSON((s) => s.clearFilterGeoJSON);
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const [filterOptions, setFilterOptions] = useState<
    Interface__FilterOptionGroup[]
  >([]);

  // Popover
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  useClickOutside([triggerRef, contentRef], onClose);

  useEffect(() => {
    const activeWorkspaces = activeWorkspacesByCategory.flatMap(
      (activeWorkspace) => activeWorkspace?.workspaces
    );
    setFilterOptions(filterOptionGroups(activeWorkspaces, filterGeoJSON));
  }, [activeWorkspacesByCategory]);

  // console.log("filterGeoJSON", filterGeoJSON);
  // console.log("filterOptions", filterOptions);

  return (
    <PopoverRoot open={open}>
      <PopoverTrigger>
        {/* <OverlayItemContainer> */}
        <Tooltip content={l.basemap_filter}>
          <BButton
            ref={triggerRef}
            unclicky
            // iconButton
            variant={"outline"}
            w={"full"}
            onClick={onToggle}
            size={"md"}
          >
            <Icon boxSize={5}>
              <IconFilter stroke={1.5} />
            </Icon>
            Filter
          </BButton>
        </Tooltip>
        {/* </OverlayItemContainer> */}
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={0}
            mr={"2px"}
            w={"200px"}
            pointerEvents={"auto"}
          >
            <MenuHeaderContainer>
              <HStack>
                <Icon boxSize={5} mb={"1px"}>
                  <IconFilter stroke={1.5} />
                </Icon>
                <P fontWeight={"bold"}>Filter Dashboard</P>
              </HStack>
            </MenuHeaderContainer>

            <CContainer
              pt={1}
              className="scrollY"
              maxH={"calc(50dvh - 56px)"}
              w={"calc(100%)"}
              px={1}
            >
              <AccordionRoot multiple>
                {filterOptions?.map((option, i) => (
                  <AccordionItem
                    key={option.property}
                    value={option.property}
                    px={2}
                    border={i === filterOptions.length - 1 ? "none" : ""}
                  >
                    <AccordionItemTrigger>
                      <HStack>
                        <P>{option.property}</P>
                      </HStack>
                    </AccordionItemTrigger>

                    <AccordionItemContent>
                      <CContainer gap={4}>
                        {option.values?.map((value) => (
                          <FilterCheckbox
                            key={value.value}
                            option={option}
                            value={value}
                            filterOptions={filterOptions}
                            setFilterOptions={setFilterOptions}
                          />
                        ))}
                      </CContainer>
                    </AccordionItemContent>
                  </AccordionItem>
                ))}
              </AccordionRoot>
            </CContainer>

            <CContainer p={1}>
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
                size={"md"}
              >
                Reset
              </BButton>
            </CContainer>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

export default GeoJSONFilter;
