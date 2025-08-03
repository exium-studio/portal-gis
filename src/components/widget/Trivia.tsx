import useMapViewState from "@/context/useMapViewState";
import autoTimeZone from "@/utils/autoTimeZone";
import { HStack } from "@chakra-ui/react";
import P from "../ui-custom/P";
import Clock from "./Clock";
import { useEffect, useState } from "react";

const CurrentCenter = () => {
  const mapRef = useMapViewState((s) => s.mapRef);
  const [currentCenter, setCurrentCenter] = useState<any>(
    mapRef?.current?.getCenter()
  );

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map) return;

    const updateCenter = () => {
      setCurrentCenter(map.getCenter());
    };

    map.on("move", updateCenter); // or "moveend" for after drag ends
    updateCenter(); // init once

    return () => {
      map.off("move", updateCenter);
    };
  }, [mapRef]);

  return (
    <HStack>
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
  return (
    <HStack
      position={"fixed"}
      zIndex={99999999999}
      top={"50%"}
      right={"-218px"}
      rotate={"90deg"}
      // bg={"red"}
      flexShrink={0}
      w={"444px"}
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
