import CContainer from "@/components/ui-custom/CContainer";
import HScroll from "@/components/ui-custom/HScroll";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { Box, HStack } from "@chakra-ui/react";
import { BasemapFilter } from "../basemapOverlay/BasemapFIlter";
import { BasemapMapStyle } from "../basemapOverlay/BasemapMapStyle";
import { CurrentLocation } from "../basemapOverlay/CurrentLocation";
import { FieldInfo } from "../basemapOverlay/FieldInfo";
import { LegendContent, LegendTrigger } from "../basemapOverlay/Legend";
import { SearchAddress } from "../basemapOverlay/SearchAddress";
import { ZoomControl } from "../basemapOverlay/ZoomControl";
import { Compass } from "../Compass";

const AdminMapOverlay = () => {
  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer
      id="map_overlay"
      w={"calc(100% - 2px)"}
      h={"calc(100% - 4px)"}
      pointerEvents={"none"}
      justify={"space-between"}
      zIndex={1}
      position={"absolute"}
      top={0}
    >
      <FieldInfo />
      {iss && <LegendContent containerProps={{ top: "66px" }} />}

      <CContainer flex={1} justify={"space-between"}>
        <Box p={2}>
          <HStack
            align={"start"}
            justify={"space-between"}
            position={"relative"}
            h={"calc(40px + 8px)"}
          >
            <HStack align={"start"} w={"fit"} h={"fit"} zIndex={2}>
              <SearchAddress />
            </HStack>

            <HStack position={"absolute"} right={0}>
              {/* <DisplayedData /> */}

              {/* <GeoJSONFilter /> */}

              <BasemapFilter />

              {/* <LayoutMenu /> */}
            </HStack>
          </HStack>
        </Box>

        <Box p={2} pr={0}>
          <HStack
            align={"start"}
            justify={"space-between"}
            position={"relative"}
            h={"calc(40px + 8px)"}
          >
            <HStack gap={0} align={"start"} w={"full"} zIndex={2}>
              <LegendTrigger />
            </HStack>

            <HScroll
              position={"absolute"}
              w={"fit"}
              maxW={"calc(100% - 50px - 8px)"}
              right={0}
              pr={2}
              className="noScroll"
            >
              <BasemapMapStyle />

              <ZoomControl />

              <CurrentLocation />

              <Compass />
            </HScroll>
          </HStack>
        </Box>
      </CContainer>
    </CContainer>
  );
};

export default AdminMapOverlay;
