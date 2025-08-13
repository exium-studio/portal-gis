import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import P from "@/components/ui-custom/P";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Interface__ActiveWorkspace,
  Interface__FilterOptionGroup,
} from "@/constants/interfaces";
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
import { useEffect, useMemo, useRef, useState } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";

const GeoJSONFilter = () => {
  // Hooks
  const { l } = useLang();

  // Context
  const rawFilterGeoJSON = useFilterGeoJSON((s) => s.filterGeoJSON);
  const filterGeoJSON = useMemo(
    () => rawFilterGeoJSON,
    [JSON.stringify(rawFilterGeoJSON)]
  );
  const addFilterGeoJSON = useFilterGeoJSON((s) => s.addFilterGeoJSON);
  const removeFilterGeoJSON = useFilterGeoJSON((s) => s.removeFilterGeoJSON);
  const resetFilterGeoJSON = useFilterGeoJSON((s) => s.clearFilterGeoJSON);
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const [activeWorkspaces, setActiveWorkspaces] = useState<
    Interface__ActiveWorkspace[]
  >([]);
  const [filterOptions, setFilterOptions] = useState<
    Interface__FilterOptionGroup[]
  >([]);

  // Popover
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  useClickOutside([triggerRef, contentRef], onClose);

  // Utils
  const handleToggle = (
    property: keyof typeof filterGeoJSON,
    value: string,
    nextChecked: boolean
  ) => {
    setFilterOptions((prev) =>
      prev.map((group) =>
        group.property === property
          ? {
              ...group,
              values: group.values.map((v) =>
                v.value === value ? { ...v, active: nextChecked } : v
              ),
            }
          : group
      )
    );

    if (!nextChecked) {
      addFilterGeoJSON({ [property]: [value] });
    } else {
      removeFilterGeoJSON(property, value);
    }
  };

  useEffect(() => {
    const newActiveWorkspaces = activeWorkspacesByCategory.flatMap(
      (activeWorkspace) => activeWorkspace?.workspaces
    );
    setActiveWorkspaces((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newActiveWorkspaces))
        return prev;
      return newActiveWorkspaces;
    });
  }, [activeWorkspacesByCategory]);

  useEffect(() => {
    setFilterOptions(filterOptionGroups(activeWorkspaces, filterGeoJSON));
  }, [activeWorkspaces]);

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
                        {option.values?.map((v) => (
                          <Checkbox
                            key={`${option.property}-${v.value}`}
                            checked={v.active}
                            onChange={(e: any) =>
                              handleToggle(
                                option.property,
                                v.value,
                                !!e.target.checked
                              )
                            }
                            aria-label={`${option.property}-${v.value}`}
                          >
                            <Tooltip content={v.value}>
                              <P lineClamp={1}>{v.value}</P>
                            </Tooltip>
                          </Checkbox>
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
                  resetFilterGeoJSON();
                  setFilterOptions((prev) =>
                    prev.map((group) => ({
                      ...group,
                      values: group.values.map((v) => ({
                        ...v,
                        active: true,
                      })),
                    }))
                  );
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
