import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import FileInput from "@/components/ui-custom/FileInput";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import HScroll from "@/components/ui-custom/HScroll";
import NumberInput from "@/components/ui-custom/NumberInput";
import P from "@/components/ui-custom/P";
import SearchInput from "@/components/ui-custom/SearchInput";
import StringInput from "@/components/ui-custom/StringInput";
import Textarea from "@/components/ui-custom/Textarea";
import { useColorMode } from "@/components/ui/color-mode";
import { Field } from "@/components/ui/field";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import MAPS_STYLES_OPTIONS from "@/constants/mapsStylesOptions";
import useAdminSearchAddress from "@/constants/useSearchAddress";
import useActiveMapStyle from "@/context/useActiveMapStyle";
import useMapsConfig from "@/context/useBasemap";
import useCurrentLocation from "@/context/useCurrentLocation";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useLegend from "@/context/useLegend";
import useMapStyle from "@/context/useMapStyle";
import useMapViewState from "@/context/useMapViewState";
import useMapsZoom from "@/context/useMapZoom";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useClickOutside from "@/hooks/useClickOutside";
import useDataState from "@/hooks/useDataState";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import BASEMAP_CONFIG_LIST from "@/static/basemapConfigList";
import back from "@/utils/back";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import pluck from "@/utils/pluck";
import { fileValidation } from "@/utils/validationSchemas";
import {
  Box,
  Center,
  Circle,
  Group,
  HStack,
  Icon,
  Image,
  PopoverPositioner,
  Portal,
  SimpleGrid,
  Stack,
  StackProps,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconClock,
  IconCurrentLocation,
  IconCurrentLocationFilled,
  IconEdit,
  IconFlag,
  IconInfoCircle,
  IconMap,
  IconMapCog,
  IconMapPin,
  IconMinus,
  IconNavigationFilled,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import chroma from "chroma-js";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import useSearchMode from "../../../context/useSearchMode";
import ExistingFileItem from "../ExistingFIleItem";
import MenuHeaderContainer from "../MenuHeaderContainer";
import useActiveLayers from "@/context/useActiveWorkspaces";
import getLocation from "@/utils/getLocation";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface OverlayItemContainerProps extends StackProps {
  children?: any;
}

const OverlayItemContainer = ({
  children,
  ...props
}: OverlayItemContainerProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Stack
      p={1}
      w={"fit"}
      bg={"body"}
      border={"1px solid"}
      borderColor={"border.muted"}
      borderRadius={themeConfig.radii.container}
      pointerEvents={"auto"}
      transition={"100ms"}
      gap={0}
      {...props}
    >
      {children}
    </Stack>
  );
};

const SearchAddress = () => {
  // Utils
  const iss = useIsSmScreenWidth();

  // Context
  const { l } = useLang();
  const {
    searchAddress,
    setSearchAddress,
    searchResult,
    setSearchResult,
    setSelectedSearchResult,
  } = useAdminSearchAddress();
  const { searchMode, setSearchMode, toggleSearchMode } = useSearchMode();

  // States, Refs
  const [searchInputFocus, setSearchInputFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchAddressHistory = JSON.parse(
    localStorage.getItem("search_address_history") as string
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const showSearchResult =
    (searchAddress || searchAddressHistory) && searchInputFocus;

  // Handle click outside
  useClickOutside([containerRef, contentRef], () => {
    setSearchInputFocus(false);
    if (!searchAddress) {
      setSearchMode(false);
    }
  });

  // Handle search
  useEffect(() => {
    if (searchMode && searchRef.current) {
      searchRef.current.focus();
    } else {
      setSearchInputFocus(false);
    }
  }, [searchMode]);
  useEffect(() => {
    if (searchAddress) {
      setLoading(true);
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchAddress
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            setSearchResult(data.features);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      if (!searchMode) {
        setSelectedSearchResult("");
      }
      setSearchResult([]);
    }
  }, [searchMode, searchAddress, setSearchResult]);

  // Components
  const SearchResultItem = ({ result, historyItem = false }: any) => {
    function handleItemClick() {
      setSelectedSearchResult(result);
      setSearchAddress(result.place_name);

      if (!historyItem) {
        const updatedHistory = [
          result,
          ...(Array.isArray(searchAddressHistory)
            ? searchAddressHistory
            : []
          ).filter((item: any) => item.place_name !== result.place_name),
        ].slice(0, 5);

        localStorage.setItem(
          "search_address_history",
          JSON.stringify(updatedHistory)
        );
      }

      setSearchInputFocus(false);
    }

    return (
      <BButton
        unclicky
        variant={"ghost"}
        px={2}
        justifyContent={"start"}
        onClick={() => handleItemClick()}
        color={historyItem ? "fg.muted" : ""}
      >
        <Icon mb={"1px"}>
          {historyItem ? (
            <IconClock size={"1rem"} />
          ) : (
            <IconMapPin size={"1rem"} />
          )}
        </Icon>
        <Text truncate>{result.place_name}</Text>
      </BButton>
    );
  };

  return (
    <CContainer
      fRef={containerRef}
      gap={2}
      maxW={iss ? "" : "300px"}
      zIndex={4}
      pointerEvents={"auto"}
    >
      <OverlayItemContainer
        id="search-trigger"
        w={searchMode ? (iss ? "calc(100vw - 18px)" : "300px") : "50px"}
        flexDir={"row"}
        overflow={"clip"}
        transition={"200ms"}
      >
        <Tooltip content={`${l.search} ${l.address.toLowerCase()}`}>
          <BButton
            unclicky
            iconButton
            variant="ghost"
            onClick={() => {
              toggleSearchMode();
            }}
          >
            <IconSearch />
          </BButton>
        </Tooltip>

        <SearchInput
          inputRef={searchRef}
          onChangeSetter={(input) => {
            setSearchAddress(input);
          }}
          inputValue={searchAddress}
          noIcon
          inputProps={{
            pl: 1,
            border: "none",
            onFocus: () => setSearchInputFocus(true),
          }}
        />
      </OverlayItemContainer>

      <PopoverRoot
        open={showSearchResult}
        positioning={{ sameWidth: true }}
        initialFocusEl={() => searchRef.current}
      >
        <PopoverTrigger asChild>
          <div></div>
        </PopoverTrigger>

        <Portal>
          <PopoverPositioner>
            <PopoverContent
              ref={contentRef}
              w={"auto"}
              p={1}
              mt={-2}
              pointerEvents={"auto"}
            >
              {/* Render loading */}
              {loading && <ComponentSpinner />}

              {/* Render result */}
              {!loading && (
                <>
                  {searchAddress && (
                    <>
                      {/* Render Not Found */}
                      {searchResult.length === 0 && <FeedbackNotFound />}

                      {/* Render Search Result */}
                      {searchResult?.length > 0 &&
                        searchResult.map((result: any, i: number) => (
                          <SearchResultItem key={i} result={result} />
                        ))}
                    </>
                  )}

                  {/* Render History */}
                  {!searchAddress && (
                    <>
                      {searchAddressHistory &&
                        searchAddressHistory.map((history: any, i: number) => (
                          <SearchResultItem
                            key={i}
                            result={history}
                            historyItem
                          />
                        ))}
                    </>
                  )}
                </>
              )}
            </PopoverContent>
          </PopoverPositioner>
        </Portal>
      </PopoverRoot>
    </CContainer>
  );
};

const BasemapFilter = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { basemap, setBasemap } = useMapsConfig();
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
                <Text fontWeight={"bold"}>{l.basemap_filter}</Text>
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

const Legend = () => {
  // Hooks
  const { open, onToggle, onClose } = useDisclosure();
  const iss = useIsSmScreenWidth();

  // Contexts
  const { l } = useLang();
  const { legends, setLegends } = useLegend();
  const halfPanel = useLayout((s) => s.halfPanel);

  // States
  const { error, loading, data, makeRequest } = useDataState<any>({
    initialData: [
      "Perkebunan",
      "Ladang",
      "Sawit",
      "Ladang, Sa",
      "Ladang,Pet",
      "Ladang dan",
      "Sekolah da",
      "Pemukiman",
      "Kelapa Saw",
      "Masjid",
      "Sawah",
      "Jalan Tol",
      "Irigasi",
      "Jalan",
    ],
    // url: `/api/gis-bpn/workspace-layers/shape-files/penggunaan`,
    noRt: true,
    dataResource: false,
  });
  const render = {
    loading: <ComponentSpinner />,
    error: <FeedbackRetry onRetry={makeRequest} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <SimpleGrid gapX={4} gapY={1} px={"2px"} columns={2}>
        {legends.map((item) => {
          return (
            <HStack key={item?.label}>
              <Circle w={"10px"} h={"10px"} bg={item?.color} opacity={0.8} />
              <Text>{item?.label}</Text>
            </HStack>
          );
        })}
      </SimpleGrid>
    ),
  };

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle set legends on fetched data
  useEffect(() => {
    if (data) {
      const colors = chroma
        .scale(["#d73027", "#fee08b", "#1a9850", "#4575b4", "#542788"])
        .mode("lab")
        .colors(data?.length || 0);

      const newLegends = data.map((label: any, i: number) => ({
        label: label,
        color: colors[i],
      }));
      setLegends(newLegends);
    }
  }, [data]);

  return (
    <CContainer w={"fit"} fRef={containerRef} zIndex={1} position={"relative"}>
      <Portal container={containerRef}>
        <FloatingContainer
          open={open}
          containerProps={{
            position: "absolute",
            left: "0",
            bottom: "58px",
            pointerEvents: "auto",
            w: iss ? "calc(100vw - 16px)" : "300px",
            pb: 2,
            maxH: iss
              ? halfPanel
                ? "calc(50dvh - 174px)"
                : "35dvh"
              : "calc(100dvh - 72px)",
          }}
          animationEntrance="bottom"
        >
          <MenuHeaderContainer>
            <HStack h={"20px"}>
              <IconFlag stroke={1.5} size={20} />
              <Text fontWeight={"bold"}>{l.legend}</Text>

              <BButton
                iconButton
                unclicky
                size={"sm"}
                variant={"ghost"}
                ml={"auto"}
                mr={-1}
                onClick={onClose}
              >
                <Icon boxSize={5}>
                  <IconX />
                </Icon>
              </BButton>
            </HStack>
          </MenuHeaderContainer>

          <CContainer p={3} pb={1} className="scrollY">
            {loading && render.loading}
            {!loading && (
              <>
                {error && render.error}
                {!error && (
                  <>
                    {data && render.loaded}
                    {(!data || empty(data)) && render.empty}
                  </>
                )}
              </>
            )}

            {/* <HelperText>
              {l.legend_helper}
              <Span>
                <Icon mx={1}>
                  <IconMapPinCog size={18} stroke={1.5} />
                </Icon>
                {l.displayed_data}
              </Span>
            </HelperText> */}
          </CContainer>
        </FloatingContainer>
      </Portal>

      <OverlayItemContainer>
        <Tooltip content={l.legend}>
          <BButton iconButton unclicky variant={"ghost"} onClick={onToggle}>
            <IconFlag stroke={1.5} />
          </BButton>
        </Tooltip>
      </OverlayItemContainer>
    </CContainer>
  );
};

const BasemapMapStyle = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();
  const { mapStyle, setMapStyle } = useMapStyle();

  // Utils
  const { open, onToggle, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  const contentRef = useRef(null);
  useClickOutside([triggerRef, contentRef], onClose);

  return (
    <PopoverRoot open={open} positioning={{ placement: "top" }}>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <Tooltip content={l.basemap}>
            <Center
              ref={triggerRef}
              w={"40px"}
              aspectRatio={1}
              onClick={onToggle}
            >
              <Image
                src={mapStyle.img[colorMode as keyof typeof mapStyle.img]}
                w={"36px"}
                borderRadius={themeConfig.radii.component}
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
                <Text fontWeight={"bold"}>{l.basemap}</Text>
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
                        <Image
                          src={item.img[colorMode as keyof typeof item.img]}
                          borderRadius={"md"}
                          aspectRatio={1}
                          w={"full"}
                        />
                      </Box>

                      <Text
                        fontSize={"xs"}
                        textAlign={"center"}
                        color={active ? themeConfig.primaryColor : ""}
                      >
                        {pluck(l, item.labelKey)}
                      </Text>
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

const ZoomControl = () => {
  const { mapZoomPercent, setMapZoomPercent } = useMapsZoom();

  return (
    <OverlayItemContainer>
      <Group>
        <Tooltip content={"Zoom out"}>
          <BButton
            iconButton
            unclicky
            variant={"ghost"}
            onClick={() => {
              if (mapZoomPercent > 10) {
                setMapZoomPercent(mapZoomPercent - 10);
              } else {
                setMapZoomPercent(0);
              }
            }}
          >
            <Icon>
              <IconMinus />
            </Icon>
          </BButton>
        </Tooltip>

        <HStack gap={0} justify={"center"}>
          <NumberInput
            integer
            minW={"30px"}
            maxW={"30px"}
            border={"none"}
            px={0}
            onChangeSetter={(input) => {
              setMapZoomPercent(input);
            }}
            inputValue={mapZoomPercent}
            textAlign={"center"}
            max={100}
            fontWeight={"semibold"}
          />
          <Text>%</Text>
        </HStack>

        <Tooltip content={"Zoom in"}>
          <BButton
            iconButton
            unclicky
            variant={"ghost"}
            onClick={() => {
              if (mapZoomPercent < 90) {
                setMapZoomPercent(mapZoomPercent + 10);
              } else {
                setMapZoomPercent(100);
              }
            }}
          >
            <Icon>
              <IconPlus />
            </Icon>
          </BButton>
        </Tooltip>
      </Group>
    </OverlayItemContainer>
  );
};

const CurrentLocation = () => {
  // Contexts
  const { l } = useLang();
  const { currentLocation, setCurrentLocation } = useCurrentLocation();
  const { themeConfig } = useThemeConfig();

  // States, Refs
  const [loading, setLoading] = useState<boolean>(false);

  // Utils
  function handleOnClick() {
    if (currentLocation) {
      setCurrentLocation(undefined);
    } else {
      setLoading(true);
      getLocation()
        .then((loc) => {
          setCurrentLocation({
            lat: loc.coords.latitude,
            lon: loc.coords.longitude,
          });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <OverlayItemContainer>
      <Tooltip content={l.current_location}>
        <BButton
          iconButton
          unclicky
          variant={"ghost"}
          onClick={handleOnClick}
          loading={loading}
        >
          {currentLocation ? (
            <IconCurrentLocationFilled color={themeConfig.primaryColorHex} />
          ) : (
            <IconCurrentLocation stroke={1.5} />
          )}
        </BButton>
      </Tooltip>
    </OverlayItemContainer>
  );
};

const Compass = () => {
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
            <Text
              w={"38px"}
              ml={2}
              mt={"2px"}
              textAlign={"center"}
              fontWeight={"semibold"}
            >
              {Math.round(bearing)}°
            </Text>
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

const EditField = (props: any) => {
  // Props
  const { data, setData } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-${data?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud-field",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const updateWorkspace = useActiveLayers((s) => s.updateLayerData);

  // States
  const workspaceId = selectedPolygon?.data?.workspace?.id;
  const layerId = selectedPolygon?.data?.layer?.layer_id;
  const tableName = selectedPolygon?.data?.layer?.table_name;
  const propertiesId = selectedPolygon?.polygon?.properties?.id;
  const geojson = selectedPolygon?.data?.layer?.geojson;
  const featuresIndex =
    selectedPolygon?.data?.layer?.geojson?.features.findIndex(
      (f: any) => f.properties.id === propertiesId
    );
  const [existingDocs, setExistingDocs] = useState<any[]>(data?.thumbnail);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      propinsi: "",
      kabupaten: "",
      nib: "",
      su: "",
      hak: "",
      tipehak: "",
      luastertul: "",
      luaspeta: "",
      sk: "",
      tanggalsk: "",
      tglterbith: "",
      berakhirha: "",
      pemilik: "",
      tipepemili: "",
      gunatanahk: "",
      gunatanahu: "",
      terpetakan: "",
      keterangan: "",
      dtipehak: "",
      parapihakb: "",
      permasalah: "",
      tindaklanj: "",
      hasil: "",
      penggunaan: "",
      docs: undefined as any,
      deleted_docs: [],
    },
    validationSchema: yup.object().shape({
      docs: fileValidation({
        allowedExtensions: ["pdf", "doc", "docx"],
      }),
    }),
    onSubmit: (values) => {
      // console.log(values);
      back();

      const newProperties = {
        id: propertiesId,
        propinsi: values.propinsi,
        kabupaten: values.kabupaten,
        nib: values.nib,
        su: values.su,
        hak: values.hak,
        tipehak: values.tipehak,
        luastertul: values.luastertul,
        luaspeta: values.luaspeta,
        sk: values.sk,
        tanggalsk: values.tanggalsk,
        tglterbith: values.tglterbith,
        berakhirha: values.berakhirha,
        pemilik: values.pemilik,
        tipepemili: values.tipepemili,
        gunatanahk: values.gunatanahk,
        gunatanahu: values.gunatanahu,
        terpetakan: values.terpetakan,
        keterangan: values.keterangan,
        dtipehak: values.dtipehak,
        parapihakb: values.parapihakb,
        permasalah: values.permasalah,
        tindaklanj: values.tindaklanj,
        hasil: values.hasil,
        penggunaan: values.penggunaan,
      };
      const payload = new FormData();
      payload.append("layer_id", layerId);
      payload.append("table_name", tableName);
      if (Array.isArray(values.docs)) {
        values.docs.forEach((file) => {
          payload.append(`document`, file);
        });
      } else if (values.docs) {
        payload.append("document", values.docs);
      }
      payload.append("properties", JSON.stringify(newProperties));
      const url = `/api/gis-bpn/workspace-layers/shape-files/update`;
      const config = {
        url,
        method: "PUT",
        data: payload,
      };

      // new geojson
      const newGeojson = {
        ...geojson,
        features: geojson.features.map((feature: any, index: number) => {
          if (index === featuresIndex) {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                ...newProperties,
              },
            };
          }
          return feature;
        }),
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            updateWorkspace(workspaceId, layerId, newGeojson);
            setData(newProperties);
          },
        },
      });
    },
  });

  // Handle initial values
  useEffect(() => {
    formik.setValues({
      propinsi: data?.propinsi,
      kabupaten: data?.kabupaten,
      nib: data?.nib,
      su: data?.su,
      hak: data?.hak,
      tipehak: data?.tipehak,
      luastertul: data?.luastertul,
      luaspeta: data?.luaspeta,
      sk: data?.sk,
      tanggalsk: data?.tanggalsk,
      tglterbith: data?.tglterbith,
      berakhirha: data?.berakhirha,
      pemilik: data?.pemilik,
      tipepemili: data?.tipepemili,
      gunatanahk: data?.gunatanahk,
      gunatanahu: data?.gunatanahu,
      terpetakan: data?.terpetakan,
      keterangan: data?.keterangan,
      dtipehak: data?.dtipehak,
      parapihakb: data?.parapihakb,
      permasalah: data?.permasalah,
      tindaklanj: data?.tindaklanj,
      hasil: data?.hasil,
      penggunaan: data?.penggunaan,
      docs: [],
      deleted_docs: [],
    });
  }, [data]);

  return (
    <>
      <BButton
        iconButton
        unclicky
        size={"sm"}
        variant={"ghost"}
        onClick={onOpen}
      >
        <Icon boxSize={5}>
          <IconEdit stroke={1.5} />
        </Icon>
      </BButton>

      <DisclosureRoot
        open={open}
        lazyLoad
        size={"sm"}
        scrollBehavior={"inside"}
      >
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`Edit ${capsFirstLetterEachWord(l.field_data)}`}
            />
          </DisclosureHeader>

          <DisclosureBody pt={0} px={0} pos={"relative"}>
            <Tabs.Root
              defaultValue="information"
              top={0}
              colorPalette={themeConfig.colorPalette}
            >
              <Tabs.List
                bg={"body"}
                w={"full"}
                pos={"sticky"}
                top={0}
                zIndex={2}
              >
                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="information"
                >
                  {l.information}
                </Tabs.Trigger>

                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="explanation"
                >
                  {l.explanation}
                </Tabs.Trigger>

                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="document"
                >
                  {l.document}
                </Tabs.Trigger>
              </Tabs.List>

              {/* information content */}
              <Tabs.Content value="information" pl={4} pr={3}>
                {/* owner */}
                <Field
                  readOnly
                  label={l.owner}
                  invalid={!!formik.errors.pemilik}
                  errorText={formik.errors.pemilik as string}
                  mb={4}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("pemilik", input);
                    }}
                    inputValue={formik.values.pemilik}
                  />
                </Field>

                {/* owner type */}
                <Field
                  readOnly
                  label={l.owner_type}
                  invalid={!!formik.errors.tipepemili}
                  errorText={formik.errors.tipepemili as string}
                  mb={4}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("tipepemili", input);
                    }}
                    inputValue={formik.values.tipepemili}
                  />
                </Field>

                {/* usage */}
                <Field
                  readOnly
                  label={l.usage}
                  invalid={!!formik.errors.penggunaan}
                  errorText={formik.errors.penggunaan as string}
                  mb={4}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("penggunaan", input);
                    }}
                    inputValue={formik.values.penggunaan}
                  />
                </Field>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* no sertif */}
                  <Field
                    readOnly
                    label={l.sertificate_number}
                    invalid={!!formik.errors.hak}
                    errorText={formik.errors.hak as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("hak", input);
                      }}
                      inputValue={formik.values.hak}
                    />
                  </Field>

                  {/* nib */}
                  <Field
                    readOnly
                    label={"NIB"}
                    invalid={!!formik.errors.nib}
                    errorText={formik.errors.nib as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("nib", input);
                      }}
                      inputValue={formik.values.nib}
                    />
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* rights publish date */}
                  <Field
                    readOnly
                    label={l.rights_published_date}
                    invalid={!!formik.errors.tglterbith}
                    errorText={formik.errors.tglterbith as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("tglterbith", input);
                      }}
                      inputValue={formik.values.tglterbith}
                    />
                  </Field>

                  {/* rights expired date */}
                  <Field
                    readOnly
                    label={l.rights_expired_date}
                    invalid={!!formik.errors.berakhirha}
                    errorText={formik.errors.berakhirha as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("berakhirha", input);
                      }}
                      inputValue={formik.values.berakhirha}
                    />
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* map area */}
                  <Field
                    readOnly
                    label={l.map_area}
                    invalid={!!formik.errors.luaspeta}
                    errorText={formik.errors.luaspeta as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("luaspeta", input);
                      }}
                      inputValue={formik.values.luaspeta}
                    />
                  </Field>

                  {/* written area */}
                  <Field
                    readOnly
                    label={l.written_area}
                    invalid={!!formik.errors.luastertul}
                    errorText={formik.errors.luastertul as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("luastertul", input);
                      }}
                      inputValue={formik.values.luastertul}
                    />
                    {/* written area */}
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* sk */}
                  <Field
                    readOnly
                    label={l.sk}
                    invalid={!!formik.errors.sk}
                    errorText={formik.errors.sk as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("sk", input);
                      }}
                      inputValue={formik.values.sk}
                    />
                  </Field>

                  {/* sk date */}
                  <Field
                    readOnly
                    label={l.sk_date}
                    invalid={!!formik.errors.tanggalsk}
                    errorText={formik.errors.tanggalsk as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("tanggalsk", input);
                      }}
                      inputValue={formik.values.tanggalsk}
                    />
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4}>
                  {/* city */}
                  <Field
                    readOnly
                    label={l.city}
                    invalid={!!formik.errors.kabupaten}
                    errorText={formik.errors.kabupaten as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("kabupaten", input);
                      }}
                      inputValue={formik.values.kabupaten}
                    />
                  </Field>

                  {/* province */}
                  <Field
                    readOnly
                    label={l.province}
                    invalid={!!formik.errors.propinsi}
                    errorText={formik.errors.propinsi as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("propinsi", input);
                      }}
                      inputValue={formik.values.propinsi}
                    />
                  </Field>
                </SimpleGrid>
              </Tabs.Content>

              {/* explanation content */}
              <Tabs.Content value="explanation" px={4}>
                <Field
                  label={l.dispute_parties}
                  invalid={!!formik.errors.parapihakb}
                  errorText={formik.errors.parapihakb as string}
                  mb={4}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("parapihakb", input);
                    }}
                    inputValue={formik.values.parapihakb}
                  />
                </Field>

                <Field
                  label={l.problems}
                  invalid={!!formik.errors.permasalah}
                  errorText={formik.errors.permasalah as string}
                  mb={4}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("permasalah", input);
                    }}
                    inputValue={formik.values.permasalah}
                  />
                </Field>

                <Field
                  label={l.handling_and_follow_up}
                  invalid={!!formik.errors.tindaklanj}
                  errorText={formik.errors.tindaklanj as string}
                  mb={4}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("tindaklanj", input);
                    }}
                    inputValue={formik.values.tindaklanj}
                  />
                </Field>

                <Field
                  label={l.result}
                  invalid={!!formik.errors.hasil}
                  errorText={formik.errors.hasil as string}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("hasil", input);
                    }}
                    inputValue={formik.values.hasil}
                  />
                </Field>
              </Tabs.Content>

              {/* document content */}
              <Tabs.Content value="document" px={4}>
                <Field
                  label={l.document}
                  invalid={!!formik.errors.docs}
                  errorText={formik.errors.docs as string}
                >
                  {!empty(existingDocs) && (
                    <CContainer>
                      {existingDocs?.map((item: any, i: number) => {
                        return (
                          <ExistingFileItem
                            key={i}
                            data={item}
                            onDelete={() => {
                              setExistingDocs((prev) =>
                                prev.filter((f) => f !== item)
                              );
                              formik.setFieldValue("deleted_docs", [
                                ...formik.values.deleted_docs,
                                item,
                              ]);
                            }}
                          />
                        );
                      })}
                    </CContainer>
                  )}

                  {empty(existingDocs) && (
                    <FileInput
                      dropzone
                      name="docs"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("docs", input);
                      }}
                      inputValue={formik.values.docs}
                      accept=".pdf, .doc, .docx"
                      maxFiles={5}
                    />
                  )}

                  {!empty(formik.values.deleted_docs) && (
                    <CContainer gap={2} mt={2}>
                      <P color={"fg.muted"}>{l.deleted_docs}</P>

                      {formik.values.deleted_docs?.map(
                        (item: any, i: number) => {
                          return (
                            <ExistingFileItem
                              key={i}
                              data={item}
                              withDeleteButton={false}
                              withUndobutton
                              onUndo={() => {
                                setExistingDocs((prev) => [...prev, item]);

                                formik.setFieldValue(
                                  "deleted_docs",
                                  formik.values.deleted_docs.filter(
                                    (f: any) => f !== item
                                  )
                                );

                                formik.setFieldValue("icon", undefined);
                              }}
                            />
                          );
                        }
                      )}
                    </CContainer>
                  )}
                </Field>
              </Tabs.Content>
            </Tabs.Root>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              colorPalette={themeConfig.colorPalette}
              onClick={formik.submitForm}
            >
              {l.save}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

const FieldData = () => {
  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  const iss = useIsSmScreenWidth();

  // Contexts
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const halfPanel = useLayout((s) => s.halfPanel);

  // States
  const [data, setData] = useState<any>(selectedPolygon?.polygon?.properties);

  // Handle open
  useEffect(() => {
    if (selectedPolygon) {
      onOpen();
      setData(selectedPolygon?.polygon?.properties);
    } else {
      onClose();
    }
  }, [selectedPolygon]);

  const ItemContainer = (props: any) => {
    const { children, last } = props;

    return (
      <CContainer
        borderBottom={last ? "" : "1px solid"}
        borderColor={"border.muted"}
        px={3}
        pt={2}
        pb={last ? 0 : 2}
      >
        {children}
      </CContainer>
    );
  };

  return (
    <FloatingContainer
      open={open}
      containerProps={{
        position: "absolute",
        right: "8px",
        top: "66px",
        pointerEvents: "auto",
        w: iss ? "calc(100vw - 16px)" : "300px",
        pb: 2,
        maxH: iss
          ? halfPanel
            ? "calc(50dvh - 174px)"
            : "35dvh"
          : "calc(100dvh - 134px)",
      }}
      animationEntrance="top"
    >
      <MenuHeaderContainer>
        <HStack h={"20px"}>
          <IconInfoCircle stroke={1.5} size={20} />
          <Text fontWeight={"bold"}>
            {capsFirstLetterEachWord(l.field_data)}
          </Text>

          <HStack gap={1} ml={"auto"} mr={-1}>
            <EditField data={data} setData={setData} />

            <BButton
              iconButton
              unclicky
              size={"sm"}
              variant={"ghost"}
              onClick={() => {
                clearSelectedPolygon();
                onClose();
              }}
            >
              <Icon boxSize={5}>
                <IconX />
              </Icon>
            </BButton>
          </HStack>
        </HStack>
      </MenuHeaderContainer>

      <CContainer px={1} overflowY={"auto"} className="scrollY">
        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.owner}
          </P>
          <P>{`${data?.pemilik || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.owner_type}
          </P>
          <P>{`${data?.tipepemili || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.usage}
          </P>
          <P>{`${data?.penggunaan || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.sertificate_number}
          </P>
          <P>{`${data?.hak || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            NIB
          </P>
          <P>{`${data?.nib || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.rights_type}
          </P>
          <P>{`${data?.tipehak || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.rights_published_date}
          </P>
          <P>{`${data?.tglterbith || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.rights_expired_date}
          </P>
          <P>{`${data?.berakhirha || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.map_area}
          </P>
          <P>{`${data?.luaspeta || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.written_area}
          </P>
          <P>{`${data?.luastertul || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.sk}
          </P>
          <P>{`${data?.sk || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.sk_date}
          </P>
          <P>{`${data?.tanggalsk || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.city}
          </P>
          <P>{`${data?.kabupaten || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.province}
          </P>
          <P>{`${data?.propinsi || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.problems}
          </P>
          <P>{`${data?.permasalah || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.dispute_parties}
          </P>
          <P>{`${data?.parapihakb || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.handling_and_follow_up}
          </P>
          <P>{`${data?.tindaklanj || "-"}`}</P>
        </ItemContainer>

        <ItemContainer last>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.result}
          </P>
          <P>{`${data?.hasil || "-"}`}</P>
        </ItemContainer>
      </CContainer>
    </FloatingContainer>
  );
};

const AdminMapOverlay = () => {
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
      <FieldData />

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
            <HStack align={"start"} w={"full"} zIndex={2}>
              <Legend />
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
