import { useColorMode } from "@/components/ui/color-mode";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import useLang from "@/context/useLang";
import useMapStyle from "@/context/useMapStyle";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import {
  Box,
  Center,
  HStack,
  PopoverPositioner,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { OverlayItemContainer } from "../OverlayItemContainer";
import { Tooltip } from "@/components/ui/tooltip";
import Img from "@/components/ui-custom/Img";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { IconMap } from "@tabler/icons-react";
import P from "@/components/ui-custom/P";
import CContainer from "@/components/ui-custom/CContainer";
import MAPS_STYLES_OPTIONS from "@/constants/mapsStylesOptions";
import pluck from "@/utils/pluck";

export const BasemapMapStyle = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();
  const { mapStyle, setMapStyle } = useMapStyle();

  // Utils
  const displaySrc = mapStyle.img[colorMode as keyof typeof mapStyle.img];
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  useClickOutside([triggerRef, contentRef], onClose);

  return (
    <PopoverRoot
      key={displaySrc}
      open={open}
      positioning={{ placement: "top" }}
    >
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <Tooltip content={l.basemap}>
            <Center
              ref={triggerRef}
              w={"40px"}
              aspectRatio={1}
              onClick={onToggle}
            >
              <Img
                src={displaySrc}
                w={"40px"}
                borderRadius={"sm"}
                cursor={"pointer"}
                _hover={{ opacity: 0.6 }}
                transition={"200ms"}
              />
            </Center>
          </Tooltip>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            w={"200px"}
            pointerEvents={"auto"}
          >
            <MenuHeaderContainer>
              <HStack h={"20px"}>
                <IconMap stroke={1.5} size={20} />
                <P fontWeight={"bold"}>{l.basemap}</P>
              </HStack>
            </MenuHeaderContainer>

            <CContainer p={1} pt={2}>
              <HStack>
                {MAPS_STYLES_OPTIONS.map((item, i) => {
                  const active = mapStyle.id === item.id;

                  return (
                    <CContainer
                      key={i}
                      gap={2}
                      cursor={!item.disabled ? "pointer" : "disabled"}
                      onClick={
                        !item.disabled
                          ? () => {
                              setMapStyle(item);
                            }
                          : () => {}
                      }
                      opacity={item.disabled ? 0.6 : 1}
                    >
                      <Box
                        p={active ? 1 : 0}
                        border={active ? "1px solid" : ""}
                        borderColor={active ? themeConfig.primaryColor : ""}
                        borderRadius={themeConfig.radii.component}
                        aspectRatio={1}
                      >
                        <Img
                          src={item.img[colorMode as keyof typeof item.img]}
                          borderRadius={"sm"}
                          aspectRatio={1}
                          w={"full"}
                        />
                      </Box>

                      <P
                        fontSize={"xs"}
                        textAlign={"center"}
                        color={active ? themeConfig.primaryColor : ""}
                      >
                        {pluck(l, item.labelKey)}
                      </P>
                    </CContainer>
                  );
                })}
              </HStack>
            </CContainer>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};
