import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";
import P from "@/components/ui-custom/P";
import SearchInput from "@/components/ui-custom/SearchInput";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip } from "@/components/ui/tooltip";
import useSearchAddress from "@/constants/useSearchAddress";
import useLang from "@/context/useLang";
import useSearchMode from "@/context/useSearchMode";
import useClickOutside from "@/hooks/useClickOutside";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { Icon, PopoverPositioner, Portal } from "@chakra-ui/react";
import { IconClock, IconMapPin, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { OverlayItemContainer } from "../OverlayItemContainer";

export const SearchAddress = () => {
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
  } = useSearchAddress();
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
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchAddress
        )}&format=json&addressdetails=1&limit=5`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            // Normalisasi biar mirip kayak Mapbox features
            const normalized = data.map((item: any) => ({
              place_name: item.display_name,
              center: [parseFloat(item.lon), parseFloat(item.lat)],
              raw: item,
            }));
            setSearchResult(normalized);
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
        <P truncate>{result.place_name}</P>
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
            pl: 2,
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
              {loading && <ComponentSpinner minH={"210px"} />}

              {/* Render result */}
              {!loading && (
                <>
                  {searchAddress && (
                    <>
                      {/* Render Not Found */}
                      {searchResult.length === 0 && (
                        <FeedbackNotFound minH={"210px"} />
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
