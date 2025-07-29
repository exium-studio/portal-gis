import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import { useEffect, useState } from "react";
import { OverlayItemContainer } from "./OverlayItemContainer";
import { Center, HStack, Icon } from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import BButton from "../ui-custom/BButton";
import { IconNavigationFilled } from "@tabler/icons-react";

export const Compass = () => {
  // Hooks
  const { l } = useLang();

  // Context
  const { mapRef } = useMapViewState();

  // States
  const [bearing, setBearing] = useState(0);

  // Utils
  const handleReset = () => {
    if (mapRef?.current) {
      const map = mapRef.current.getMap();
      map.easeTo({
        bearing: 0,
        pitch: 0,
        duration: 300,
      });
    }
  };

  // Handle bearing rotation
  useEffect(() => {
    if (!mapRef?.current) return;

    const map = mapRef.current.getMap();
    const handleMove = () => {
      setBearing(map.getBearing());
    };

    map.on("move", handleMove);

    return () => {
      map.off("move", handleMove);
    };
  }, [mapRef?.current]);

  return (
    <OverlayItemContainer>
      <HStack gap={1}>
        <Tooltip content={`${l.angle_to_north}`}>
          <CContainer h={"40px"} justify={"center"}>
            <P
              w={"38px"}
              ml={2}
              mt={"2px"}
              textAlign={"center"}
              fontWeight={"semibold"}
            >
              {`${Math.round(bearing)}°`}
            </P>
          </CContainer>
        </Tooltip>

        <Tooltip content={`Reset ${l.angle_to_north.toLowerCase()}`}>
          <BButton iconButton unclicky onClick={handleReset} variant={"ghost"}>
            <Center
              transform={`rotate(${bearing * -1}deg)`}
              position={"relative"}
            >
              <Icon color={"fg.error"}>
                <IconNavigationFilled />
              </Icon>
            </Center>
          </BButton>
        </Tooltip>
      </HStack>
    </OverlayItemContainer>
  );
};
