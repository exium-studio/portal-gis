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
  IconStackPop,
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
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
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
      <Rearange activeWorkspace={activeWorkspace} />

      <ViewWorkspaceByCategory activeWorkspace={activeWorkspace} />

      <ToggleVisibility activeWorkspace={activeWorkspace} />
    </HStack>
  );
};
const Rearange = (props: any) => {
  // Props
  const { activeWorkspace } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const rearrangeCategory = useActiveWorkspaces((s) => s.rearrangeCategory);

  // States
  const workspaceCategoryId = activeWorkspace.workspace_category.id;
  const first =
    activeWorkspaces[0]?.workspace_category?.id ===
    activeWorkspace?.workspace_category?.id;
  const last =
    activeWorkspaces[activeWorkspaces.length - 1]?.workspace_category?.id ===
    activeWorkspace?.workspace_category?.id;

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <BButton
          iconButton
          unclicky
          variant={"ghost"}
          size={"xs"}
          disabled={first && last}
          {...props}
        >
          <Icon boxSize={5}>
            <IconStackPop stroke={1.5} />
          </Icon>
        </BButton>
      </MenuTrigger>

      <MenuContent>
        <MenuItem
          value="front"
          disabled={last}
          onClick={() => {
            rearrangeCategory(workspaceCategoryId, "front");
          }}
        >
          {l.bring_to_front_layer_level}
        </MenuItem>
        <MenuItem
          value="back"
          disabled={first}
          onClick={() => {
            rearrangeCategory(workspaceCategoryId, "back");
          }}
        >
          {l.send_to_back_layer_level}
        </MenuItem>
        <MenuItem
          value="up"
          disabled={last}
          onClick={() => {
            rearrangeCategory(workspaceCategoryId, "up");
          }}
        >
          {l.move_up_layer_level}
        </MenuItem>
        <MenuItem
          value="down"
          disabled={first}
          onClick={() => {
            rearrangeCategory(workspaceCategoryId, "down");
          }}
        >
          {l.move_down_layer_level}
        </MenuItem>
      </MenuContent>
    </MenuRoot>
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
    <Tooltip content={l.fit_bounds}>
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
      <AccordionItemTrigger indicatorPlacement="none" pl={2} pr={1} py={1}>
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
            {activeWorkspace?.workspaces
              ?.slice()
              ?.reverse()
              ?.map((workspace, i) => {
                return (
                  <ActiveWorkspaceListItem
                    workspace={workspace}
                    index={i}
                    workspacesLength={activeWorkspace.workspaces.length}
                  />
                );
              })}
          </AccordionRoot>
        </CContainer>
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default ActiveWorkspaceByCategoryListItem;
