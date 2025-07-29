import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import P from "@/components/ui-custom/P";
import { Tooltip } from "@/components/ui/tooltip";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useLegend from "@/context/useLegend";
import useDataState from "@/hooks/useDataState";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import empty from "@/utils/empty";
import { Circle, HStack, Portal, SimpleGrid } from "@chakra-ui/react";
import { IconFlag } from "@tabler/icons-react";
import chroma from "chroma-js";
import { useEffect, useRef } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { OverlayItemContainer } from "../OverlayItemContainer";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";

export const LegendTrigger = () => {
  // Hooks
  const iss = useIsSmScreenWidth();

  // Contexts
  const { l } = useLang();
  const onToggle = useLegend((s) => s.onToggle);

  // Refs
  const containerRef = useRef<any>(null);

  return (
    <>
      <CContainer
        fRef={containerRef}
        w={"fit"}
        zIndex={1}
        position={"relative"}
      >
        <Portal container={containerRef}>
          {!iss && (
            <LegendContent
              containerProps={{
                bottom: "58px",
                left: "",
              }}
            />
          )}
        </Portal>

        <OverlayItemContainer>
          <Tooltip content={l.legend}>
            <BButton iconButton unclicky variant={"ghost"} onClick={onToggle}>
              <IconFlag stroke={1.5} />
            </BButton>
          </Tooltip>
        </OverlayItemContainer>
      </CContainer>
    </>
  );
};

export const LegendContent = (props: any) => {
  // Props
  const { containerProps } = props;

  // Hooks
  const { l } = useLang();
  const iss = useIsSmScreenWidth();

  // Contexts
  const halfPanel = useLayout((s) => s.halfPanel);
  const open = useLegend((s) => s.open);
  const onClose = useLegend((s) => s.onClose);
  const legends = useLegend((s) => s.legends);
  const setLegends = useLegend((s) => s.setLegends);

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
      <SimpleGrid gapX={4} gapY={1} px={"2px"} columns={[1, null, 2]}>
        {legends.map((item) => {
          return (
            <HStack key={item?.label}>
              <Circle w={"10px"} h={"10px"} bg={item?.color} opacity={0.8} />
              <P>{item?.label}</P>
            </HStack>
          );
        })}
      </SimpleGrid>
    ),
  };

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
    <FloatingContainer
      open={open}
      containerProps={{
        position: "absolute",
        left: "8px",
        pointerEvents: "auto",
        w: iss ? "calc(50vw - 14px)" : "298px",
        pb: 2,
        maxH: iss
          ? halfPanel
            ? "calc(50dvh - 174px)"
            : "35dvh"
          : "calc(100dvh - 134px)",
        ...containerProps,
      }}
      animationEntrance="left"
    >
      <MenuHeaderContainer>
        <HStack h={"20px"}>
          <IconFlag stroke={1.5} size={20} />
          <P fontWeight={"bold"}>{l.legend}</P>

          <FloatingContainerCloseButton onClick={onClose} />
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
  );
};
