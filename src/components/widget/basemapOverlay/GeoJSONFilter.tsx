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
import { useMemo, useRef } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { OverlayItemContainer } from "../OverlayItemContainer";

const GeoJSONFilter = () => {
  // Hooks
  const { l } = useLang();

  // Context
  const filterGeoJSON = useFilterGeoJSON((s) => s.filterGeoJSON);
  const addFilterGeoJSON = useFilterGeoJSON((s) => s.addFilterGeoJSON);
  const removeFilterGeoJSON = useFilterGeoJSON((s) => s.removeFilterGeoJSON);
  const clearFilterGeoJSON = useFilterGeoJSON((s) => s.clearFilterGeoJSON);

  // States
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const filterOptions = useMemo(
    () => filterOptionGroups(activeWorkspaces, filterGeoJSON),
    [activeWorkspaces, filterGeoJSON]
  );

  // Popover
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  useClickOutside([triggerRef, contentRef], onClose);

  // Handler toggle checkbox
  const handleToggle = (
    property: keyof typeof filterGeoJSON,
    value: string,
    nextChecked: boolean
  ) => {
    if (nextChecked) {
      addFilterGeoJSON({ [property]: [value] } as Partial<
        typeof filterGeoJSON
      >);
    } else {
      removeFilterGeoJSON(property, value);
    }
  };

  return (
    <PopoverRoot open={open}>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <Tooltip content={l.basemap_filter}>
            <BButton
              ref={triggerRef}
              iconButton
              unclicky
              variant={"ghost"}
              w={"fit"}
              onClick={onToggle}
            >
              <Icon boxSize={5}>
                <IconFilter stroke={1.5} />
              </Icon>
            </BButton>
          </Tooltip>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            mr={"2px"}
            w={"200px"}
            pointerEvents={"auto"}
          >
            <MenuHeaderContainer>
              <HStack>
                <Icon boxSize={5} mb={"1px"}>
                  <IconFilter stroke={1.5} />
                </Icon>
                <P fontWeight={"bold"}>Filter GeoJSON</P>
              </HStack>
            </MenuHeaderContainer>

            <CContainer
              pt={1}
              className="scrollY"
              maxH={"calc(50dvh - 56px)"}
              w={"calc(100% + 6px)"}
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

            <BButton mt={1} variant={"outline"} onClick={clearFilterGeoJSON}>
              Clear
            </BButton>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

export default GeoJSONFilter;
