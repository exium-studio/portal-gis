import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import P from "@/components/ui-custom/P";
import SelectInput from "@/components/ui-custom/SelectInput";
import { Tooltip } from "@/components/ui/tooltip";
import { LEGEND_COLOR_OPTIONS } from "@/constants/colors";
import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useLegend from "@/context/useLegend";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import empty from "@/utils/empty";
import {
  Box,
  Circle,
  HStack,
  Icon,
  Portal,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { IconCaretDownFilled, IconFlag } from "@tabler/icons-react";
import chroma from "chroma-js";
import { useEffect, useRef, useState } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { OverlayItemContainer } from "../OverlayItemContainer";
import SimplePopover from "../SimplePopover";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";
import back from "@/utils/back";

interface LegendEntry {
  label: string;
  color: string;
}
interface PropertyLegend {
  propertyKey: string;
  legends: LegendEntry[];
}

function generateLegendsFromWorkspaces(
  workspaces: Interface__ActiveWorkspace[],
  colorway?: string[]
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
    const colors = chroma.scale(colorway).colors(labels.length);

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

const LegendOptions = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const legend = useLegend((s) => s.legend);
  const colorway = useLegend((s) => s.colorway);
  const setLegend = useLegend((s) => s.setLegend);

  // States
  const [legendOptions, setLegendOptions] = useState<any[]>([]);

  // Utils
  function fetch(setOptions: any) {
    setOptions(legendOptions);
  }

  useEffect(() => {
    const newLegendOptions = generateLegendsFromWorkspaces(
      activeWorkspaces,
      colorway?.colors
    )
      ?.filter((item) => !EXCLUDED_KEYS.includes(item.propertyKey))
      .map((item) => ({
        id: item.propertyKey,
        label: item.propertyKey,
        legends: item.legends,
      }));

    setLegendOptions(newLegendOptions);
  }, [activeWorkspaces, colorway]);

  // useEffect(() => {
  //   if (empty(legend?.list) && !empty(legendOptions)) {
  //     setLegend({
  //       label: legendOptions[0]?.label,
  //       list: legendOptions[0]?.legends,
  //     });
  //   }
  // }, [legendOptions]);

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
      inputValue={[
        {
          id: legend?.label,
          label: legend?.label,
          list: legend?.list,
        } as any,
      ]}
      {...restProps}
      // border={"none"}
      // borderRadius={"0"}
      // borderBottom={"1px solid {colors.border.muted}"}
    />
  );
};
const ColorwayOptions = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`select-legend-colorway`, open, onOpen, onClose);

  // Contexts
  const { themeConfig } = useThemeConfig();
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const colorway = useLegend((s) => s.colorway);
  const setColorway = useLegend((s) => s.setColorway);
  const legend = useLegend((s) => s.legend);
  const setLegend = useLegend((s) => s.setLegend);

  // States
  const [localColorway, setLocalColorway] = useState<any>(colorway);

  return (
    <>
      <BButton
        unclicky
        variant={"outline"}
        pl={1}
        onClick={onOpen}
        {...restProps}
      >
        <HStack
          w={"full"}
          borderRadius={4}
          overflow={"clip"}
          gap={0}
          h={"30px"}
          mr={2}
        >
          {colorway?.colors?.map((color: string) => {
            return (
              <Box
                key={color}
                bg={color}
                flex={"1 1 20px"}
                h={"full"}
                opacity={0.8}
              />
            );
          })}
        </HStack>

        <Icon boxSize={"14px"} color={"fg.subtle"} ml={"auto"}>
          <IconCaretDownFilled />
        </Icon>
      </BButton>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Colorway`} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer gap={4}>
              {LEGEND_COLOR_OPTIONS?.map((item) => {
                const active = item?.label === localColorway?.label;

                return (
                  <HStack
                    key={item?.label}
                    w={"full"}
                    h={"40px"}
                    borderRadius={5}
                    overflow={"clip"}
                    gap={0}
                    _hover={{ bg: "bg,subtle" }}
                    cursor={"pointer"}
                    border={active ? "1px solid" : ""}
                    borderColor={themeConfig.primaryColor}
                    p={active ? 1 : 0}
                    onClick={() => setLocalColorway(item)}
                  >
                    <HStack
                      h={"full"}
                      w={"full"}
                      gap={0}
                      borderRadius={3}
                      overflow={"clip"}
                    >
                      {item?.colors?.map((color: string) => {
                        return (
                          <Box
                            key={color}
                            bg={color}
                            flex={"1 1 20px"}
                            h={"full"}
                            opacity={0.8}
                          />
                        );
                      })}
                    </HStack>
                  </HStack>
                );
              })}
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              colorPalette={themeConfig.colorPalette}
              onClick={() => {
                setColorway(localColorway);
                const newLegendOptions = generateLegendsFromWorkspaces(
                  activeWorkspaces,
                  colorway?.colors
                )
                  ?.filter((item) => !EXCLUDED_KEYS.includes(item.propertyKey))
                  .map((item) => ({
                    id: item.propertyKey,
                    label: item.propertyKey,
                    legends: item.legends,
                  }));

                const legendIndex = newLegendOptions.findIndex(
                  (item) => item.label === legend?.label
                );
                setLegend({
                  label: newLegendOptions[legendIndex]?.label,
                  list: newLegendOptions[legendIndex]?.legends,
                });
                back();
              }}
            >
              {l.confirm}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
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
      <MenuHeaderContainer borderless>
        <HStack h={"20px"}>
          <IconFlag stroke={1.5} size={20} />
          <P fontWeight={"bold"}>{l.legend}</P>

          <FloatingContainerCloseButton onClick={onClose} />
        </HStack>
      </MenuHeaderContainer>

      <CContainer px={3} mb={1} className="scrollY" gap={3}>
        <CContainer gap={2}>
          <LegendOptions />

          <ColorwayOptions />
        </CContainer>

        {empty(legend.list) && <FeedbackNoData />}

        {!empty(legend.list) && (
          <>
            {/* <Checkbox mb={3}>1 Line</Checkbox> */}

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
          </>
        )}
      </CContainer>
    </FloatingContainer>
  );
};
