import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import useActiveMapStyle from "@/context/useActiveMapStyle";
import useBasemap from "@/context/useBasemap";
import useLang from "@/context/useLang";
import useMapStyle from "@/context/useMapStyle";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import {
  HStack,
  PopoverPositioner,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Switch } from "@/components/ui/switch";
import { OverlayItemContainer } from "../OverlayItemContainer";
import { Tooltip } from "@/components/ui/tooltip";
import BButton from "@/components/ui-custom/BButton";
import { IconMapCog } from "@tabler/icons-react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import P from "@/components/ui-custom/P";
import CContainer from "@/components/ui-custom/CContainer";
import BASEMAP_CONFIG_LIST from "@/static/basemapConfigList";
import pluck from "@/utils/pluck";

export const BasemapFilter = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { basemap, setBasemap } = useBasemap();
  const { activeMapStyle, setActiveMapStyle } = useActiveMapStyle();
  const { mapStyle } = useMapStyle();

  // Utils
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  async function basemapSetter(
    layerType: keyof typeof basemap,
    visible: boolean
  ) {
    const layerMapping: Record<string, string[]> = {
      road: [
        "road_service_case",
        "road_minor_case",
        "road_pri_case_ramp",
        "road-pri-case-ramp",
        "road_trunk_case_ramp",
        "road_mot_case_ramp",
        "road_sec_case_noramp",
        "road_pri_case_noramp",
        "road_trunk_case_noramp",
        "road_mot_case_noramp",
        "road_path",
        "road_service_fill",
        "road_minor_fill",
        "road_pri_fill_ramp",
        "road_trunk_fill_ramp",
        "road_mot_fill_ramp",
        "road_sec_fill_noramp",
        "road_pri_fill_noramp",
        "road_trunk_fill_noramp",
        "road_mot_fill_noramp",
        "roadname_minor",
        "roadname_sec",
        "roadname_pri",
        "roadname_major",
      ],
      water: ["water", "water-shadow", "waterway"],
      building: [
        // "building",
        "building-top",
        "building-extrusion",
        "building-outline",
      ],
    };
    const updatedLayers = activeMapStyle.layers.map((layer: any) =>
      layerMapping[layerType as keyof typeof layerMapping]?.includes(layer.id)
        ? {
            ...layer,
            layout: {
              ...layer.layout,
              visibility: visible ? "visible" : "none",
            },
          }
        : layer
    );
    setActiveMapStyle({ ...activeMapStyle, layers: updatedLayers });
    setBasemap({ ...basemap, [layerType]: visible });
  }
  useClickOutside([triggerRef, contentRef], onClose);

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
              disabled={mapStyle.id !== 1}
            >
              <IconMapCog stroke={1.5} />
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
                <IconMapCog stroke={1.5} size={20} />
                <P fontWeight={"bold"}>{l.basemap_filter}</P>
              </HStack>
            </MenuHeaderContainer>

            <CContainer pt={1}>
              {BASEMAP_CONFIG_LIST.map((item, i) => {
                const active = basemap[item.key];

                const toggleItem = () => {
                  basemapSetter(item.key, !basemap[item.key]);
                };

                return (
                  <BButton
                    key={i}
                    unclicky
                    justifyContent={"space-between"}
                    px={2}
                    onClick={toggleItem}
                    variant={"ghost"}
                    size={"md"}
                    cursor={"pointer"}
                    disabled={item.disabled}
                  >
                    {pluck(l, item.key)}

                    <Switch
                      checked={active}
                      pointerEvents={"none"}
                      colorPalette={themeConfig.colorPalette}
                    />
                  </BButton>
                );
              })}
            </CContainer>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};
