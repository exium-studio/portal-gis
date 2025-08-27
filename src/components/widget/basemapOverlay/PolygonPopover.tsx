import CContainer from "@/components/ui-custom/CContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import P from "@/components/ui-custom/P";
import { useColorMode } from "@/components/ui/color-mode";
import useLang from "@/context/useLang";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { HStack, Icon } from "@chakra-ui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { Popup } from "react-map-gl/mapbox";
import PropertyValue from "../PropertyValue";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import BButton from "@/components/ui-custom/BButton";

const KEYS = [
  {
    label: "Hak",
    value: "hak",
  },
  {
    label: "NIB",
    value: "nib",
  },
  {
    label: "Luas tertulis",
    value: "luastertul",
  },
  {
    label: "Luas peta",
    value: "liaspeta",
  },
  {
    label: "Pemilik",
    value: "pemilik",
  },
  {
    label: "Tanggal terbit",
    value: "tglterbith",
  },
  {
    label: "Tanggal berakhir",
    value: "berakhirha",
  },
  {
    label: "SK",
    value: "sk",
  },
];

export default function PolygonPopover() {
  // Contexts
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();

  // States
  const { lat, lon } = selectedPolygon?.clickedLngLat ?? {};
  const properties = normalizeKeys(selectedPolygon?.polygon?.properties as any);
  const popupStyle = `
    .mapboxgl-popup-content {
      padding: 0px !important;
      border-radius: 6px !important;
      background: ${colorMode === "dark" ? "#151515" : "#ffffff"} !important;
    }
    .mapboxgl-popup-tip {
      border-top-color: ${
        colorMode === "dark" ? "#151515" : "#ffffff"
      } !important;
    }
  `;

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

  return (
    <>
      <style>{popupStyle}</style>

      {selectedPolygon && lat && lon && (
        <Popup
          longitude={lon}
          latitude={lat}
          anchor="bottom"
          closeButton={false}
          closeOnClick={false}
        >
          <ItemContainer
            bg={"body"}
            borderRadius={themeConfig.radii.container}
            minW={"250px"}
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
                  }}
                />
              </HStack>
            </ItemHeaderContainer>

            <CContainer className="scrollY" pl={"6px"}>
              {KEYS.map((key, i) => {
                return (
                  <ListItemContainer
                    key={key.value}
                    last={i === KEYS.length - 1}
                  >
                    <P fontWeight={"medium"} color={"fg.subtle"}>
                      {`${key.label}`}
                    </P>
                    <PropertyValue>{`${
                      properties?.[key.value] || "-"
                    }`}</PropertyValue>
                  </ListItemContainer>
                );
              })}
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
              >
                Detail
              </BButton>
            </HStack>
          </ItemContainer>
        </Popup>
      )}
    </>
  );
}
