import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import { Interface__ActiveLayer } from "@/constants/interfaces";
import { FIT_BOUNDS_PADDING } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import { useThemeConfig } from "@/context/useThemeConfig";
import capsFirstLetter from "@/utils/capsFirstLetter";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import {
  IconEye,
  IconEyeOff,
  IconLine,
  IconPolygon,
  IconZoomInArea,
} from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import { Tooltip } from "../ui/tooltip";
import SimplePopover from "./SimplePopover";

interface Props extends StackProps {
  layer: Interface__ActiveLayer;
}

const ActiveLayerUtils = (props: any) => {
  // Props
  const { activeLayer, ...restProps } = props;

  return (
    <HStack gap={1} {...restProps}>
      <ViewWorkspace activeLayer={activeLayer} />

      <ToggleVisibility activeLayer={activeLayer} />
    </HStack>
  );
};
const ViewWorkspace = (props: any) => {
  // Props
  const { activeLayer, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const mapRef = useMapViewState((s) => s.mapRef);

  // Utils
  function onFitBounds() {
    if (mapRef.current && activeLayer.data.bbox) {
      const [minLng, minLat, maxLng, maxLat] = activeLayer.data.bbox;

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
  const { activeLayer } = props;

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
          toggleLayerVisibility(activeLayer?.workspace?.id, activeLayer?.id);
        }}
      >
        <Icon boxSize={5}>
          {activeLayer?.visible ? (
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
  const { layer, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <HStack
      w={"full"}
      pr={2}
      borderRadius={themeConfig.radii.container}
      transition={"200ms"}
      gap={0}
      {...restProps}
    >
      <HStack borderRadius={themeConfig.radii.component} w={"full"}>
        <SimplePopover
          content={
            <CContainer gap={1}>
              <P w={"full"}>{layer?.name}</P>

              <P w={"full"} color={"fg.subtle"}>
                {layer?.description}
              </P>

              <HStack color={"fg.subtle"} mt={1}>
                <Icon boxSize={5}>
                  {layer?.layer_type === "fill" ? (
                    <IconPolygon stroke={1.5} />
                  ) : (
                    <IconLine stroke={1.5} />
                  )}
                </Icon>

                <P lineClamp={1}>{capsFirstLetter(layer?.layer_type)}</P>
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

        <ActiveLayerUtils activeLayer={layer} ml={"auto"} />
      </HStack>
    </HStack>
  );
};

export default ActiveLayerListItem;
