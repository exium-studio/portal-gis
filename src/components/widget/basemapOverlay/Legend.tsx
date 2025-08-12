import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import P from "@/components/ui-custom/P";
import { Tooltip } from "@/components/ui/tooltip";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useLegend from "@/context/useLegend";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import empty from "@/utils/empty";
import { Circle, HStack, Portal, SimpleGrid } from "@chakra-ui/react";
import { IconFlag, IconFoldersOff } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { OverlayItemContainer } from "../OverlayItemContainer";
import SimplePopover from "../SimplePopover";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";

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

  // TODO generate legend from active workspaces and render

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
  const legend = useLegend((s) => s.legend);

  const [legends, setLegends] = useState<string[]>([]);

  useEffect(() => {}, []);

  // console.log("activeWorkspacesByCategory", activeWorkspacesByCategory);

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
        {empty(activeWorkspaces) && (
          <FeedbackNoData
            icon={<IconFoldersOff />}
            title={l.no_active_workspaces.title}
            description={l.no_active_workspaces.description}
          />
        )}

        {!empty(legend.list) && (
          <>
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
