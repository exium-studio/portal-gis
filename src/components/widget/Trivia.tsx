import useMapStyle from "@/context/useMapStyle";
import useMapViewState from "@/context/useMapViewState";
import autoTimeZone from "@/utils/autoTimeZone";
import { HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import P from "../ui-custom/P";
import { useColorMode } from "../ui/color-mode";
import Clock from "./Clock";

const CurrentCenter = (props: any) => {
  // Props
  const { ...restProps } = props;

  const mapViewState = useMapViewState((s) => s.mapViewState);
  const [currentCenter, setCurrentCenter] = useState<any>({
    lng: mapViewState?.longitude,
    lat: mapViewState?.latitude,
  });

  useEffect(() => {
    if (!mapViewState) return;

    setCurrentCenter({
      lng: mapViewState?.longitude,
      lat: mapViewState?.latitude,
    });
  }, [mapViewState]);

  return (
    <HStack {...restProps}>
      <P fontSize={"12px"} opacity={0.5}>
        Current Center :
      </P>
      <P fontSize={"12px"}>
        {`${currentCenter?.lng.toFixed(5)}, ${currentCenter?.lat.toFixed(5)}`}
      </P>
    </HStack>
  );
};

const Trivia = () => {
  // Contexts
  const { colorMode } = useColorMode();
  const mapStyle = useMapStyle((s) => s.mapStyle);

  // States
  const plainLight = colorMode === "light" && mapStyle?.id === 1;
  const plainDark = colorMode === "dark" && mapStyle?.id === 1;
  const colorful = mapStyle?.id === 2;
  const satellite = mapStyle?.id === 3;
  const color = plainLight
    ? "black"
    : plainDark
    ? "white"
    : colorful
    ? "black"
    : satellite
    ? "white"
    : "white";

  return (
    <HStack
      position={"absolute"}
      zIndex={2}
      top={"50%"}
      right={"-225px"}
      rotate={"90deg"}
      justify={"center"}
      flexShrink={0}
      w={"460px"}
      color={color}
      // bg={"red"}
    >
      <CurrentCenter />

      <HStack>
        <P fontSize={"12px"} opacity={0.5}>
          Current Time :
        </P>
        <Clock fontSize={"xs"} />
      </HStack>

      <HStack>
        <P fontSize={"12px"} opacity={0.5}>
          Local Time :
        </P>
        <Clock fontSize={"xs"} timeZoneKey={autoTimeZone().key} />
      </HStack>
    </HStack>
  );
};

export default Trivia;
