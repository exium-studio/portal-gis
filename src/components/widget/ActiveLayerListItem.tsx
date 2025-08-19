import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import {
  Interface__ActiveLayer,
  Interface__ActiveWorkspace,
} from "@/constants/interfaces";
import { FIT_BOUNDS_PADDING } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import { useThemeConfig } from "@/context/useThemeConfig";
import capsFirstLetter from "@/utils/capsFirstLetter";
import { Badge, HStack, Icon, StackProps } from "@chakra-ui/react";
import {
  IconEye,
  IconEyeOff,
  IconLine,
  IconPolygon,
  IconStackPop,
  IconZoomInArea,
} from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import { Tooltip } from "../ui/tooltip";
import SimplePopover from "./SimplePopover";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";

interface Props extends StackProps {
  index: number;
  layer: Interface__ActiveLayer;
  workspace: Interface__ActiveWorkspace;
}

const ActiveLayerUtils = (props: any) => {
  // Props
  const { index, layer, workspace, ...restProps } = props;

  return (
    <HStack gap={1} {...restProps}>
      <Rearange
        index={index}
        layer={layer}
        workspace={workspace}
        length={workspace?.layers?.length}
      />

      <ViewWorkspace layer={layer} />

      <ToggleVisibility layer={layer} />
    </HStack>
  );
};
const Rearange = (props: any) => {
  // Props
  const { index, layer, workspace, length } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const rearrangeLayer = useActiveWorkspaces((s) => s.rearrangeLayer);

  // States
  const workspaceId = workspace.id;
  const layerId = layer.id;
  const first = index === 0;
  const last = index === length - 1;

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
            rearrangeLayer(workspaceId, layerId, "front");
          }}
        >
          {l.bring_to_front_layer_level}
        </MenuItem>
        <MenuItem
          value="back"
          disabled={last}
          onClick={() => {
            rearrangeLayer(workspaceId, layerId, "back");
          }}
        >
          {l.send_to_back_layer_level}
        </MenuItem>
        <MenuItem
          value="up"
          disabled={first}
          onClick={() => {
            rearrangeLayer(workspaceId, layerId, "up");
          }}
        >
          {l.move_up_layer_level}
        </MenuItem>
        <MenuItem
          value="down"
          disabled={last}
          onClick={() => {
            rearrangeLayer(workspaceId, layerId, "down");
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
  const { layer, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const mapRef = useMapViewState((s) => s.mapRef);

  // Utils
  function onFitBounds() {
    if (mapRef.current && layer.data.bbox) {
      const [minLng, minLat, maxLng, maxLat] = layer.data.bbox;

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
  const { layer } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const toggleLayerVisibility = useActiveWorkspaces(
    (s) => s.toggleLayerVisibility
  );

  return (
    <Tooltip content={l.toggle_visibility}>
      <BButton
        iconButton
        unclicky
        size={"xs"}
        variant={"ghost"}
        onClick={() => {
          toggleLayerVisibility(layer?.workspace?.id, layer?.id);
        }}
      >
        <Icon boxSize={5}>
          {layer?.visible ? (
            <IconEye stroke={1.5} />
          ) : (
            <IconEyeOff stroke={1.5} />
          )}
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const ActiveLayerListItem = (props: Props) => {
  // Props
  const { layer, workspace, index, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <HStack
      w={"full"}
      pr={1}
      borderRadius={themeConfig.radii.container}
      transition={"200ms"}
      gap={0}
      {...restProps}
    >
      <HStack borderRadius={themeConfig.radii.component} w={"full"}>
        <SimplePopover
          content={
            <CContainer gap={1}>
              <CContainer>
                <P w={"full"}>{layer?.name}</P>

                <P w={"full"} color={"fg.subtle"}>
                  {layer?.description}
                </P>
              </CContainer>

              <HStack wrap={"wrap"} mt={2}>
                <Badge color={"fg.muted"}>
                  <Icon boxSize={4}>
                    {layer?.layer_type === "fill" ? (
                      <IconPolygon stroke={1.5} />
                    ) : (
                      <IconLine stroke={1.5} />
                    )}
                  </Icon>

                  <P lineClamp={1} fontSize={"xs"}>
                    {capsFirstLetter(layer?.layer_type)}
                  </P>
                </Badge>

                <Badge color={"fg.muted"}>
                  <P lineClamp={1} fontSize={"xs"}>
                    {capsFirstLetter(
                      layer?.with_explanation
                        ? l.with_explanation
                        : l.without_explanation
                    )}
                  </P>
                </Badge>
              </HStack>
            </CContainer>
          }
        >
          <HStack cursor={"pointer"} pl={1}>
            <Icon boxSize={5} color={"fg.subtle"}>
              {layer?.layer_type === "fill" ? (
                <IconPolygon stroke={1.5} />
              ) : (
                <IconLine stroke={1.5} />
              )}
            </Icon>

            <P lineClamp={1}>{layer?.name}</P>
          </HStack>
        </SimplePopover>

        <ActiveLayerUtils
          index={index}
          layer={layer}
          workspace={workspace}
          ml={"auto"}
        />
      </HStack>
    </HStack>
  );
};

export default ActiveLayerListItem;
