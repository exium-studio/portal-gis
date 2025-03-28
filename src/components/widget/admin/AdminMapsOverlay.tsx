import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import HelperText from "@/components/ui-custom/HelperText";
import HScroll from "@/components/ui-custom/HScroll";
import NumberInput from "@/components/ui-custom/NumberInput";
import SearchInput from "@/components/ui-custom/SearchInput";
import { useColorMode } from "@/components/ui/color-mode";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { Interface__Gens } from "@/constants/interfaces";
import MAPS_STYLES_OPTIONS from "@/constants/mapsStylesOptions";
import useAdminSearchAddress from "@/constants/useSearchAddress";
import useCurrentLocation from "@/context/useCurrentLocation";
import useDisplayedData from "@/context/useDisplayedData";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useMapStyle from "@/context/useMapsStyle";
import useMapsViewState from "@/context/useMapsViewState";
import useMapsZoom from "@/context/useMapsZoom";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import DISPLAYED_DATA_LIST from "@/static/displayedDataList";
import getLocation from "@/utils/getLocation";
import pluck from "@/utils/pluck";
import {
  Box,
  Center,
  Group,
  HStack,
  Icon,
  Image,
  PopoverPositioner,
  Portal,
  Spinner,
  Stack,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconClock,
  IconCurrentLocation,
  IconCurrentLocationFilled,
  IconFlag,
  IconMapPin,
  IconMapPin2,
  IconMinus,
  IconNavigationFilled,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import TheLayoutMenu from "../LayoutMenu";
import MenuHeaderContainer from "../MenuHeaderContainer";
import useSearchMode from "./useSearchMode";

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

const LayoutMenu = () => {
  return (
    <OverlayItemContainer>
      <TheLayoutMenu
        pointerEvents={"auto"}
        popoverContentProps={{
          mt: 1,
        }}
      />
    </OverlayItemContainer>
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
              {loading && (
                <Center p={4}>
                  <Spinner size={"sm"} />
                </Center>
              )}

              {/* Render result */}
              {!loading && (
                <>
                  {searchAddress && (
                    <>
                      {/* Render Not Found */}
                      {searchResult.length === 0 && (
                        <CContainer p={5}>
                          <FeedbackNotFound />
                        </CContainer>
                      )}

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

const DataDisplayed = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { displayedData, setDisplayedData } = useDisplayedData();
  const { l } = useLang();

  // Utils
  const contentRef = useRef(null);

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <Tooltip content={l.displayed_data}>
            <BButton iconButton unclicky variant={"ghost"} w={"fit"}>
              <IconMapPin2 stroke={1.5} />
            </BButton>
          </Tooltip>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            w={"250px"}
            pointerEvents={"auto"}
          >
            <MenuHeaderContainer>
              <HStack>
                <IconMapPin2 stroke={1.5} size={20} />
                <Text fontWeight={"bold"}>{l.displayed_data}</Text>
              </HStack>
            </MenuHeaderContainer>

            <CContainer pt={1}>
              {DISPLAYED_DATA_LIST.map((item, i) => {
                const active = displayedData.some(
                  (data) => data.id === item.id
                );

                const toggleItem = (item: Interface__Gens) => {
                  let newDisplayedData: Interface__Gens[];

                  if (displayedData.some((data) => data.id === item.id)) {
                    newDisplayedData = displayedData.filter(
                      (data) => data.id !== item.id
                    );
                  } else {
                    newDisplayedData = [...displayedData, item];
                  }

                  setDisplayedData(newDisplayedData);
                };

                return (
                  <BButton
                    key={i}
                    unclicky
                    justifyContent={"space-between"}
                    px={2}
                    onClick={() => toggleItem(item)}
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

            {/* <CContainer px={2} pb={1} pt={2}>
              <HelperText lineHeight={1.4}>{l.layout_menu_helper}</HelperText>
            </CContainer> */}
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

const Legend = () => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Utils
  const { open, onToggle, onClose } = useDisclosure();
  const iss = useIsSmScreenWidth();

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
            p: 1,
          }}
          animationEntrance="bottom"
        >
          <HStack px={2} pb={1} justify={"space-between"}>
            <HStack>
              <IconFlag stroke={1.5} size={20} />
              <Text fontWeight={"bold"}>{l.legend}</Text>
            </HStack>

            <BButton
              iconButton
              size={"xs"}
              borderRadius={"full"}
              variant={"ghost"}
              mr={-2}
              onClick={onClose}
            >
              <Icon>
                <IconX />
              </Icon>
            </BButton>
          </HStack>

          <CContainer p={2}>
            <HelperText>
              {l.legend_helper}{" "}
              <Icon>
                <IconMapPin2 size={20} stroke={1.5} />
              </Icon>
            </HelperText>
          </CContainer>
        </FloatingContainer>
      </Portal>

      <OverlayItemContainer>
        <Tooltip content={l.legend}>
          <BButton iconButton variant={"ghost"} onClick={onToggle}>
            <IconFlag stroke={1.5} />
          </BButton>
        </Tooltip>
      </OverlayItemContainer>
    </CContainer>
  );
};

const MapStyle = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();
  const { mapsStyle, setMapsStyle } = useMapStyle();

  return (
    <PopoverRoot positioning={{ placement: "top" }}>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <Tooltip content={l.map_type}>
            <Center w={"40px"} aspectRatio={1}>
              <Image
                src={mapsStyle.img[colorMode as keyof typeof mapsStyle.img]}
                w={"36px"}
                borderRadius={"lg"}
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
          <PopoverContent p={1} w={"200px"} pointerEvents={"auto"}>
            <MenuHeaderContainer>
              <Text fontWeight={"bold"}>{l.map_type}</Text>
            </MenuHeaderContainer>

            <CContainer p={1} pt={2}>
              <HStack>
                {MAPS_STYLES_OPTIONS.map((item, i) => {
                  const active = mapsStyle.id === item.id;

                  return (
                    <CContainer
                      key={i}
                      gap={2}
                      cursor={!item.disabled ? "pointer" : "disabled"}
                      onClick={
                        !item.disabled
                          ? () => {
                              setMapsStyle(item);
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
                        textAlign={"center"}
                        color={active ? themeConfig.primaryColor : ""}
                      >
                        {item.label}
                      </Text>
                    </CContainer>
                  );
                })}
              </HStack>
            </CContainer>

            {/* <CContainer px={2} pb={1} pt={2}>
              <HelperText lineHeight={1.4}>{l.layout_menu_helper}</HelperText>
            </CContainer> */}
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

const ZoomControl = () => {
  const { zoomPercent, setZoomPercent } = useMapsZoom();

  return (
    <OverlayItemContainer>
      <Group>
        <Tooltip content={"Zoom out"}>
          <BButton
            iconButton
            variant={"ghost"}
            onClick={() => {
              if (zoomPercent > 10) {
                setZoomPercent(zoomPercent - 10);
              } else {
                setZoomPercent(0);
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
              setZoomPercent(input);
            }}
            inputValue={zoomPercent}
            textAlign={"center"}
            max={100}
            fontWeight={"semibold"}
          />
          <Text>%</Text>
        </HStack>

        <Tooltip content={"Zoom in"}>
          <BButton
            iconButton
            variant={"ghost"}
            onClick={() => {
              if (zoomPercent < 90) {
                setZoomPercent(zoomPercent + 10);
              } else {
                setZoomPercent(100);
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

const NorthDirection = () => {
  // Context
  const { l } = useLang();
  const { mapRef } = useMapsViewState();

  // States, Refs
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
              textAlign={"center"}
              fontWeight={"semibold"}
            >
              {Math.round(bearing)}°
            </Text>
          </CContainer>
        </Tooltip>

        <Tooltip content={`Reset ${l.angle_to_north.toLowerCase()}`}>
          <BButton iconButton onClick={handleReset} variant={"ghost"}>
            <Center
              transform={`rotate(${bearing * -1}deg)`}
              position={"relative"}
            >
              <Icon color={"red.500"}>
                <IconNavigationFilled />
              </Icon>
            </Center>
          </BButton>
        </Tooltip>
      </HStack>
    </OverlayItemContainer>
  );
};

const AdminMapsOverlay = () => {
  // Contexts
  const { layout } = useLayout();

  return (
    <CContainer
      id="map_overlay"
      w={"full"}
      h={"calc(100% - 4px)"}
      pointerEvents={"none"}
      justify={"space-between"}
      zIndex={1}
      position={"absolute"}
      top={0}
    >
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
            <DataDisplayed />

            {layout.id === 3 && <LayoutMenu />}
          </HStack>
        </HStack>
      </Box>

      <Box p={2}>
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
          >
            <MapStyle />

            <ZoomControl />

            <CurrentLocation />

            <NorthDirection />
          </HScroll>
        </HStack>
      </Box>
    </CContainer>
  );
};

export default AdminMapsOverlay;
