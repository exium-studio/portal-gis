import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import P from "@/components/ui-custom/P";
import SelectInput from "@/components/ui-custom/SelectInput";
import { Tooltip } from "@/components/ui/tooltip";
import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useLegend from "@/context/useLegend";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import empty from "@/utils/empty";
import { Circle, HStack, Portal, SimpleGrid } from "@chakra-ui/react";
import { IconFlag } from "@tabler/icons-react";
import chroma from "chroma-js";
import { useEffect, useRef, useState } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { OverlayItemContainer } from "../OverlayItemContainer";
import SimplePopover from "../SimplePopover";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";

interface LegendEntry {
  label: string;
  color: string;
}
interface PropertyLegend {
  propertyKey: string;
  legends: LegendEntry[];
}

function generateLegendsFromWorkspaces(
  workspaces: Interface__ActiveWorkspace[]
): PropertyLegend[] {
  const valueMap: Record<string, Set<string>> = {};

  for (const ws of workspaces) {
    for (const layer of ws.layers || []) {
      const features = layer.data?.geojson.features || [];

      for (const feature of features) {
        const props = feature.properties || {};

        for (const key in props) {
          if (!valueMap[key]) valueMap[key] = new Set();
          const val = props[key];
          if (val != null && val !== "") valueMap[key].add(String(val));
        }
      }
    }
  }

  const result: PropertyLegend[] = [];

  for (const key in valueMap) {
    const labels = Array.from(valueMap[key]);
    const colors = chroma.scale("Set2").colors(labels.length);

    const legends: LegendEntry[] = labels.map((label, i) => ({
      label,
      color: colors[i],
    }));

    result.push({ propertyKey: key, legends });
  }

  return result;
}

const EXCLUDED_KEYS = [
  "id",
  "layer_id",
  "document_ids",
  "docs",
  "deleted_docs",
];

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

const LegendOptions = () => {
  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const legend = useLegend((s) => s.legend);
  const setLegend = useLegend((s) => s.setLegend);

  // States
  const [legendOptions, setLegendOptions] = useState<any[]>([]);

  // Utils
  function fetch(setOptions: any) {
    setOptions(legendOptions);
  }

  useEffect(() => {
    const newLegendOptions = generateLegendsFromWorkspaces(activeWorkspaces)
      ?.filter((item) => !EXCLUDED_KEYS.includes(item.propertyKey))
      .map((item) => ({
        id: item.propertyKey,
        label: item.propertyKey,
        legends: item.legends,
      }));

    setLegendOptions(newLegendOptions);
  }, [activeWorkspaces]);

  useEffect(() => {
    if (empty(legend?.list) && !empty(legendOptions)) {
      setLegend({
        label: legendOptions[0]?.label,
        list: legendOptions[0]?.legends,
      });
    }
  }, [legendOptions]);

  return (
    <SelectInput
      title={l.legend}
      initialOptions={legendOptions}
      fetch={fetch}
      onConfirm={(input: any) => {
        setLegend({
          label: input?.[0]?.label,
          list: input?.[0]?.legends,
        });
      }}
      inputValue={[legend as any]}
      // border={"none"}
      // borderRadius={"0"}
      // borderBottom={"1px solid {colors.border.muted}"}
    />
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
  const legend = useLegend((s) => s.legend);

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

      <CContainer px={3} mt={"14px"}>
        <LegendOptions />
      </CContainer>

      <CContainer mt={3} px={3} mb={1} className="scrollY">
        {empty(legend.list) && <FeedbackNoData />}

        {!empty(legend.list) && (
          <SimpleGrid gapX={4} gapY={1} px={"2px"} columns={[1, null, 2]}>
            {legend.list.map((item) => {
              return (
                <SimplePopover key={item?.label} content={item?.label}>
                  <HStack cursor={"pointer"}>
                    <Circle
                      w={"10px"}
                      h={"10px"}
                      bg={item?.color}
                      opacity={0.6}
                    />
                    <P lineClamp={1}>{item?.label}</P>
                  </HStack>
                </SimplePopover>
              );
            })}
          </SimpleGrid>
        )}
      </CContainer>
    </FloatingContainer>
  );
};
