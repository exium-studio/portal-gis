import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import { Interface__ActiveWorkspacesByWorkspaceCategory } from "@/constants/interfaces";
import { FIT_BOUNDS_PADDING } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import { useThemeConfig } from "@/context/useThemeConfig";
import { computeCombinedBboxAndCenterFromActiveWorkspace } from "@/utils/geospatial";
import { HStack, Icon } from "@chakra-ui/react";
import {
  IconCategory2,
  IconEye,
  IconEyeOff,
  IconZoomInArea,
} from "@tabler/icons-react";
import { useState } from "react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "../ui/accordion";
import { Tooltip } from "../ui/tooltip";
import ActiveWorkspaceListItem from "./ActiveWorkspaceListItem";

interface Props {
  activeWorkspace: Interface__ActiveWorkspacesByWorkspaceCategory;
  index?: number;
}

const ActiveWorkspaceByCategoryUtils = (props: any) => {
  // Props
  const { activeWorkspace, index, ...restProps } = props;

  return (
    <HStack
      ml={"auto"}
      gap={1}
      onClick={(e) => e.stopPropagation()}
      {...restProps}
    >
      <ViewWorkspaceByCategory activeWorkspace={activeWorkspace} />

      <ToggleVisibility activeWorkspace={activeWorkspace} />
    </HStack>
  );
};
const ViewWorkspaceByCategory = (props: any) => {
  // Props
  const { activeWorkspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const mapRef = useMapViewState((s) => s.mapRef);

  // Utils
  function onFitBounds() {
    const { bbox } =
      computeCombinedBboxAndCenterFromActiveWorkspace(activeWorkspace);

    if (mapRef.current && bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox;

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: FIT_BOUNDS_PADDING,
          duration: MAP_TRANSITION_DURATION,
          essential: true,
        }
      );
    }
  }

  return (
    <Tooltip content={l.view_workspace}>
      <BButton
        unclicky
        iconButton
        variant={"ghost"}
        onClick={onFitBounds}
        size={"xs"}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconZoomInArea stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const ToggleVisibility = (props: any) => {
  // Props
  const { activeWorkspace } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const toggleCategoryVisibility = useActiveWorkspaces(
    (s) => s.toggleCategoryVisibility
  );

  return (
    <Tooltip content={l.toggle_visibility}>
      <BButton
        iconButton
        unclicky
        size={"xs"}
        variant={"ghost"}
        onClick={() => {
          toggleCategoryVisibility(activeWorkspace.workspace_category.id);
        }}
      >
        <Icon boxSize={5}>
          {activeWorkspace?.visible ? (
            <IconEye stroke={1.5} />
          ) : (
            <IconEyeOff stroke={1.5} />
          )}
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const ActiveWorkspaceByCategoryListItem = (props: Props) => {
  // Props
  const { activeWorkspace, index } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const [value, setValue] = useState<string[]>([]);

  return (
    <AccordionItem
      value={`${activeWorkspace?.workspace_category.id}`}
      bg={"body"}
      borderRadius={themeConfig.radii.component}
      border={"1px solid"}
      borderColor={"border.subtle"}
    >
      <AccordionItemTrigger indicatorPlacement="none" px={2} py={1}>
        <HStack w={"full"} gap={4} justify={"space-between"}>
          <HStack truncate>
            <Icon boxSize={5} color={"fg.subtle"}>
              <IconCategory2 stroke={1.5} />
            </Icon>

            <P fontWeight={"semibold"} lineClamp={1} lineHeight={1}>
              {activeWorkspace.workspace_category.label}
            </P>
          </HStack>

          <CContainer w={"fit"} gap={"2px"}>
            <ActiveWorkspaceByCategoryUtils
              activeWorkspace={activeWorkspace}
              index={index}
              ml={"auto"}
            />
          </CContainer>
        </HStack>
      </AccordionItemTrigger>

      <AccordionItemContent
        p={0}
        borderTop={"1px solid"}
        borderColor={"border.muted"}
      >
        <CContainer gap={2}>
          <AccordionRoot
            multiple
            value={value}
            onValueChange={(e) => setValue(e.value)}
          >
            {activeWorkspace?.workspaces?.map((workspace) => {
              return <ActiveWorkspaceListItem workspace={workspace} />;
            })}
          </AccordionRoot>
        </CContainer>
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default ActiveWorkspaceByCategoryListItem;
