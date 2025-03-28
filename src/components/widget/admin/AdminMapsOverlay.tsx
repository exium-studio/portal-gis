import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";
import SearchInput from "@/components/ui-custom/SearchInput";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import useAdminSearchAddress from "@/constants/useSearchAddress";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import DISPLAYED_DATA_LIST from "@/static/displayedDataList";
import {
  Box,
  Center,
  HStack,
  Icon,
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
  IconMapPin,
  IconMapPin2,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import TheLayoutMenu from "../LayoutMenu";
import useSearchMode from "./useSearchMode";
import useDisplayedData from "@/context/useDisplayedData";
import { Interface__Gens } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import MenuHeaderContainer from "../MenuHeaderContainer";

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
      maxW={iss ? "full" : "300px"}
      zIndex={4}
      pointerEvents={"auto"}
    >
      <OverlayItemContainer
        id="search-trigger"
        w={searchMode ? "" : "50px"}
        flexDir={"row"}
        overflow={"clip"}
      >
        <BButton
          iconButton
          variant="ghost"
          onClick={() => {
            toggleSearchMode();
          }}
        >
          <IconSearch />
        </BButton>

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

const DataDisplayed = ({ popoverContentProps, ...props }: any) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { displayedData, setDisplayedData } = useDisplayedData();
  const { l } = useLang();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  // Close on clicking outside
  useClickOutside([contentRef], onClose);

  return (
    <PopoverRoot open={open}>
      <PopoverTrigger asChild>
        <OverlayItemContainer>
          <BButton
            iconButton
            unclicky
            variant={"ghost"}
            w={"fit"}
            onClick={onOpen}
            {...props}
          >
            <IconMapPin2 stroke={1.5} />
          </BButton>
        </OverlayItemContainer>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            w={"250px"}
            pointerEvents={"auto"}
            {...popoverContentProps}
          >
            <MenuHeaderContainer>
              <Text fontWeight={"bold"}>{l.displayed_data}</Text>
            </MenuHeaderContainer>

            <CContainer py={1}>
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
                  <HStack
                    key={i}
                    justifyContent={"space-between"}
                    px={2}
                    onClick={() => toggleItem(item)}
                    h={"40px"}
                    cursor={"pointer"}
                  >
                    {item.label}

                    <Switch
                      checked={active}
                      pointerEvents={"none"}
                      colorPalette={themeConfig.colorPalette}
                    />
                  </HStack>
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

const AdminMapsOverlay = () => {
  // Contexts
  const { layout } = useLayout();

  return (
    <CContainer
      id="map_overlay"
      w={"full"}
      pointerEvents={"none"}
      justify={"space-between"}
      zIndex={1}
      position={"absolute"}
      top={0}
    >
      <Box p={2}>
        <HStack align={"start"} justify={"space-between"} position={"relative"}>
          <HStack align={"start"} w={"full"} zIndex={2}>
            <SearchAddress />
          </HStack>

          <HStack position={"absolute"} right={0}>
            <DataDisplayed />

            {layout.id === 3 && <LayoutMenu />}
          </HStack>
        </HStack>
      </Box>
    </CContainer>
  );
};

export default AdminMapsOverlay;
