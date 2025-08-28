import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import P from "@/components/ui-custom/P";
import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { Box, HStack, Icon } from "@chakra-ui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import PropertyValue from "../PropertyValue";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";
import useDetailFieldInfo from "@/context/useDetailFieldInfo";

const KEYS = [
  { label: "Hak", value: "hak" },
  { label: "NIB", value: "nib" },
  { label: "Luas tertulis", value: "luastertul" },
  { label: "Luas peta", value: "liaspeta" },
  { label: "Pemilik", value: "pemilik" },
  { label: "Tanggal terbit", value: "tglterbith" },
  { label: "Tanggal berakhir", value: "berakhirha" },
  { label: "SK", value: "sk" },
];

export default function PolygonPopover() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { mapRef } = useMapViewState();
  const detailFieldInfoOnOpen = useDetailFieldInfo((s) => s.onOpen);
  const detailFieldInfoOnClose = useDetailFieldInfo((s) => s.onClose);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );

  // States
  const { lat, lon } = selectedPolygon?.clickedLngLat ?? {};
  const properties = normalizeKeys(selectedPolygon?.polygon?.properties as any);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Update pos
  useEffect(() => {
    if (!mapRef?.current || !lat || !lon) return;

    const mapbox = mapRef.current.getMap(); // mapRef.current itu MapRef
    function update() {
      const { x, y } = mapbox.project([lon, lat]);
      setPos({ x, y });
    }

    update();
    mapbox.on("move", update);
    return () => {
      mapbox.off("move", update);
    };
  }, [mapRef, lat, lon]);

  // Reset pos on close
  useEffect(() => {
    if (!selectedPolygon) setPos(null);
  }, [selectedPolygon]);

  // Components
  const ListItemContainer = (props: any) => {
    const { children, last } = props;
    return (
      <CContainer
        borderBottom={last ? "" : "1px solid"}
        borderColor={"border.muted"}
        px={2}
        pt={2}
        pb={2}
      >
        {children}
      </CContainer>
    );
  };

  if (!selectedPolygon || !pos) return null;

  return (
    <CContainer
      w={"fit"}
      pos={"relative"}
      left={pos.x}
      top={pos.y}
      transform={"translate(-50%, -100%)"}
      pointerEvents={"auto"}
    >
      <Box
        w={"20px"}
        h={"20px"}
        transform={"rotate(45deg) translateX(-50%)"}
        left={"50%"}
        bg={"body"}
        pos={"absolute"}
        bottom={"-15px"}
      />

      <ItemContainer
        bg={"body"}
        borderRadius={themeConfig.radii.container}
        w={"250px"}
      >
        <ItemHeaderContainer p={2} py={1}>
          <HStack>
            <Icon>
              <IconInfoCircle stroke={1.5} size={20} />
            </Icon>
            <P fontWeight={"bold"} lineClamp={1}>
              {capsFirstLetterEachWord(l.field_info)}
            </P>
          </HStack>

          <HStack gap={1} ml={"auto"}>
            <FloatingContainerCloseButton
              size={["xs", null, "sm"]}
              onClick={() => {
                clearSelectedPolygon();
                detailFieldInfoOnClose();
              }}
            />
          </HStack>
        </ItemHeaderContainer>

        <CContainer px={"6px"}>
          {KEYS.map((key, i) => (
            <ListItemContainer key={key.value} last={i === KEYS.length - 1}>
              <P fontWeight={"medium"} color={"fg.subtle"}>
                {key.label}
              </P>
              <PropertyValue>{properties?.[key.value] || "-"}</PropertyValue>
            </ListItemContainer>
          ))}
        </CContainer>

        <HStack
          justify={"end"}
          p={2}
          borderTop={"1px solid"}
          borderColor={"border.muted"}
        >
          <BButton
            colorPalette={themeConfig.colorPalette}
            size={["md", null, "sm"]}
            onClick={() => detailFieldInfoOnOpen()}
          >
            Detail
          </BButton>
        </HStack>
      </ItemContainer>
    </CContainer>
  );
}
