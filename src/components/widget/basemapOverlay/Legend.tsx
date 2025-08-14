import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import P from "@/components/ui-custom/P";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Tooltip } from "@/components/ui/tooltip";
import { LayerLegends } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useLegend from "@/context/useLegend";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import empty from "@/utils/empty";
import {
  Badge,
  Circle,
  HStack,
  Icon,
  Portal,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  IconCategory2,
  IconFlag,
  IconFlagOff,
  IconFolders,
  IconFoldersOff,
  IconLine,
  IconPolygon,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { OverlayItemContainer } from "../OverlayItemContainer";
import SimplePopover from "../SimplePopover";
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
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );
  const halfPanel = useLayout((s) => s.halfPanel);
  const open = useLegend((s) => s.open);
  const onClose = useLegend((s) => s.onClose);

  const [layerLegends, setLayerLegends] = useState<LayerLegends[]>([]);

  useEffect(() => {
    const legendsResult: LayerLegends[] = [];

    activeWorkspacesByCategory.forEach((category) => {
      category.workspaces.forEach((workspace) => {
        workspace.layers.forEach((layer) => {
          if (!layer.data?.geojson?.features) return;

          const uniqueMap = new Map<string, string>();

          layer.data.geojson.features.forEach((feature) => {
            const props = feature.properties as Record<string, any>;
            const key = layer.color_property_key || "";
            // const key = feature.properties?.color_property_key || "";
            const value = props[key];
            const color = props.color;

            if (value && color && !uniqueMap.has(value)) {
              uniqueMap.set(value, color);
            }
          });

          const legendsArray = Array.from(uniqueMap.entries()).map(
            ([value, color]) => ({ value, color })
          );

          legendsResult.push({
            layer,
            workspace,
            legends: legendsArray,
          });
        });
      });
    });

    setLayerLegends(legendsResult);
  }, [activeWorkspacesByCategory]);

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

      <CContainer className="scrollY" gap={3} pl={1}>
        {empty(activeWorkspaces) && (
          <FeedbackNoData
            icon={<IconFoldersOff />}
            title={l.no_active_workspaces.title}
            description={l.no_active_workspaces.description}
          />
        )}

        {!empty(layerLegends) && (
          <AccordionRoot multiple>
            {[...layerLegends]
              ?.reverse()
              ?.map(({ layer, workspace, legends }, i) => {
                const last = i === layerLegends.length - 1;

                return (
                  <AccordionItem
                    key={layer.id}
                    value={`${layer.id}`}
                    gap={2}
                    pl={3}
                    pr={"10px"}
                    py={1}
                    pb={last ? 0 : 1}
                    border={last ? "none" : ""}
                  >
                    <AccordionItemTrigger>
                      <HStack align={"start"}>
                        <Icon boxSize={5} color={"fg.subtle"}>
                          {layer?.layer_type === "fill" ? (
                            <IconPolygon stroke={1.5} />
                          ) : (
                            <IconLine stroke={1.5} />
                          )}
                        </Icon>

                        <CContainer truncate gap={"6px"}>
                          <HStack>
                            <Text lineClamp={1} lineHeight={1}>
                              {layer.name}
                            </Text>
                          </HStack>

                          <HStack>
                            <P
                              color={"fg.subtle"}
                              lineClamp={1}
                              fontSize={"xs"}
                              lineHeight={1}
                            >{`${layer.color_property_key}`}</P>
                          </HStack>
                        </CContainer>
                      </HStack>
                    </AccordionItemTrigger>

                    <AccordionItemContent p={0} py={1}>
                      {empty(legends) && (
                        <VStack py={4} color={"fg.subtle"}>
                          <Icon>
                            <IconFlagOff />
                          </Icon>

                          <P>{l.no_legends}</P>
                        </VStack>
                      )}

                      {!empty(legends) && (
                        <CContainer gap={3}>
                          <SimpleGrid columns={2} gapY={1} gapX={4}>
                            {legends.map(({ value, color }) => {
                              return (
                                <SimplePopover key={value} content={value}>
                                  <HStack cursor={"pointer"} w={"fit"}>
                                    <Circle
                                      w={"10px"}
                                      h={"10px"}
                                      bg={color}
                                      opacity={0.6}
                                    />
                                    <P lineClamp={1}>{value}</P>
                                  </HStack>
                                </SimplePopover>
                              );
                            })}
                          </SimpleGrid>

                          <HStack wrap={"wrap"}>
                            <Badge w={"fit"} color={"fg.subtle"} size={"xs"}>
                              <Icon boxSize={3}>
                                <IconCategory2 stroke={1.5} />
                              </Icon>

                              <P
                                fontSize={"2xs"}
                                lineHeight={1}
                              >{`${workspace.workspace_category.label}`}</P>
                            </Badge>

                            <Badge w={"fit"} color={"fg.subtle"} size={"xs"}>
                              <Icon boxSize={3}>
                                <IconFolders stroke={1.5} />
                              </Icon>

                              <P
                                fontSize={"2xs"}
                                lineHeight={1}
                              >{`${workspace.title}`}</P>
                            </Badge>
                          </HStack>

                          {/* 
                          <HStack color={"fg.subtle"}>
                            <Icon boxSize={4}>
                              <IconFolders stroke={1.5} />
                            </Icon>

                            <P
                              lineClamp={1}
                              fontSize={"xs"}
                              lineHeight={1}
                            >{`${workspace.title}`}</P>
                          </HStack> */}
                        </CContainer>
                      )}
                    </AccordionItemContent>
                  </AccordionItem>
                );
              })}
          </AccordionRoot>
        )}
      </CContainer>
    </FloatingContainer>
  );
};
