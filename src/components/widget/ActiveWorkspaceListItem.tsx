import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import { FIT_BOUNDS_PADDING } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import { Box, HStack, Icon } from "@chakra-ui/react";
import {
  IconEye,
  IconEyeOff,
  IconFolders,
  IconStackPop,
  IconZoomInArea,
} from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
} from "../ui/accordion";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { Tooltip } from "../ui/tooltip";
import ActiveLayerListItem from "./ActiveLayerListItem";

interface Props {
  workspace: Interface__ActiveWorkspace;
  index: number;
  workspacesLength: number;
  last?: boolean;
}

const ActiveWorkspaceUtils = (props: any) => {
  // Props
  const { workspace, index, workspacesLength, ...restProps } = props;

  return (
    <HStack
      ml={"auto"}
      gap={1}
      onClick={(e) => e.stopPropagation()}
      {...restProps}
    >
      <Rearange
        workspace={workspace}
        index={index}
        workspacesLength={workspacesLength}
      />

      <ViewWorkspace workspace={workspace} />

      <ToggleVisibility workspace={workspace} />
    </HStack>
  );
};
const Rearange = (props: any) => {
  // Props
  const { workspace, index, workspacesLength } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const rearrangeWorkspace = useActiveWorkspaces((s) => s.rearrangeWorkspace);

  // States
  const workspaceCategoryId = workspace.workspace_category.id;
  const workspaceId = workspace.id;
  const first = index === 0;
  const last = index === workspacesLength - 1;

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
          disabled={first}
          onClick={() => {
            rearrangeWorkspace(workspaceCategoryId, workspaceId, "front");
          }}
        >
          {l.bring_to_front_layer_level}
        </MenuItem>
        <MenuItem
          value="back"
          disabled={last}
          onClick={() => {
            rearrangeWorkspace(workspaceCategoryId, workspaceId, "back");
          }}
        >
          {l.send_to_back_layer_level}
        </MenuItem>
        <MenuItem
          value="up"
          disabled={first}
          onClick={() => {
            rearrangeWorkspace(workspaceCategoryId, workspaceId, "up");
          }}
        >
          {l.move_up_layer_level}
        </MenuItem>
        <MenuItem
          value="down"
          disabled={last}
          onClick={() => {
            rearrangeWorkspace(workspaceCategoryId, workspaceId, "down");
          }}
        >
          {l.move_down_layer_level}
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
const ViewWorkspace = (props: any) => {
  // Props
  const { workspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const mapRef = useMapViewState((s) => s.mapRef);

  // Utils
  function onFitBounds() {
    if (mapRef.current && workspace?.bbox) {
      const [minLng, minLat, maxLng, maxLat] = workspace.bbox;

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
  const { workspace } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const toggleWorkspaceVisibility = useActiveWorkspaces(
    (s) => s.toggleWorkspaceVisibility
  );

  return (
    <Tooltip content={l.toggle_visibility}>
      <BButton
        iconButton
        unclicky
        size={"xs"}
        variant={"ghost"}
        onClick={() => {
          toggleWorkspaceVisibility(
            workspace.workspace_category.id,
            workspace?.id
          );
        }}
      >
        <Icon boxSize={5}>
          {workspace?.visible ? (
            <IconEye stroke={1.5} />
          ) : (
            <IconEyeOff stroke={1.5} />
          )}
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const ActiveWorkspaceListItem = (props: Props) => {
  // Props
  const { workspace, index, workspacesLength, last } = props;

  return (
    <AccordionItem value={`${workspace.id}`} border={"none"}>
      <AccordionItemTrigger indicatorPlacement="none" pr={1} py={1}>
        <HStack w={"full"} gap={4} justify={"space-between"}>
          <HStack truncate gap={1}>
            <HStack w={"28px"} h={"40px"} flexShrink={0} gap={0} pl={4}>
              <Box
                w={"1px"}
                h={last ? "50%" : "full"}
                borderLeft={"1px solid"}
                borderColor={"border.emphasized"}
                mb={"auto"}
              />

              <Box w={"8px"} h={"1px"} bg={"border.emphasized"} />
            </HStack>

            <HStack>
              <Icon boxSize={5} color={"fg.subtle"}>
                <IconFolders stroke={1.5} />
              </Icon>

              <P fontWeight={"semibold"} lineClamp={1} lineHeight={1}>
                {workspace.title}
              </P>
            </HStack>
          </HStack>

          <CContainer w={"fit"} gap={1}>
            <ActiveWorkspaceUtils
              workspace={workspace}
              index={index}
              workspacesLength={workspacesLength}
              ml={"auto"}
            />
          </CContainer>
        </HStack>
      </AccordionItemTrigger>

      <AccordionItemContent p={0}>
        <CContainer borderColor={"border.muted"} pl={6}>
          {workspace?.layers
            ?.slice()
            ?.reverse()
            ?.map((layer, i) => {
              const last = i === workspace?.layers?.length - 1;

              return (
                <HStack w={"full"} gap={1}>
                  <HStack w={"28px"} h={"40px"} flexShrink={0} gap={0} pl={4}>
                    <Box
                      w={"1px"}
                      h={last ? "50%" : "full"}
                      borderLeft={"1px solid"}
                      borderColor={"border.emphasized"}
                      mb={"auto"}
                    />

                    <Box w={"8px"} h={"1px"} bg={"border.emphasized"} />
                  </HStack>

                  <ActiveLayerListItem
                    key={layer.id}
                    index={i}
                    layer={layer}
                    workspace={workspace}
                  />
                </HStack>
              );
            })}
        </CContainer>
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default ActiveWorkspaceListItem;
