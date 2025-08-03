import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import { Badge, HStack, Icon } from "@chakra-ui/react";
import {
  IconEye,
  IconEyeOff,
  IconFolders,
  IconStackPop,
  IconStackPush,
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
import { Tooltip } from "../ui/tooltip";
import ActiveLayerListItem from "./ActiveLayerListItem";
import useMapViewState from "@/context/useMapViewState";
import { MAP_TRANSITION_DURATION } from "@/constants/duration";

interface Props {
  activeWorkspace: Interface__ActiveWorkspace;
  index?: number;
}

const ActiveWorkspaceUtils = (props: any) => {
  // Props
  const { activeWorkspace, index, ...restProps } = props;

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);

  const first = index === 0;
  const last = index === activeWorkspaces?.length - 1;

  return (
    <HStack
      ml={"auto"}
      gap={1}
      onClick={(e) => e.stopPropagation()}
      {...restProps}
    >
      <DecreaseLayerLevel activeWorkspace={activeWorkspace} disabled={last} />

      <IncreaseLayerLevel activeWorkspace={activeWorkspace} disabled={first} />

      <ViewWorkspace activeWorkspace={activeWorkspace} />

      <ToggleVisibility activeWorkspace={activeWorkspace} />
    </HStack>
  );
};
const DecreaseLayerLevel = (props: any) => {
  // Props
  const { activeWorkspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const decreaseLayerLevel = useActiveWorkspaces((s) => s.moveWorkspaceDown);

  return (
    <Tooltip content={l.move_down_layer_level}>
      <BButton
        iconButton
        unclicky
        size={"xs"}
        variant={"ghost"}
        onClick={() => {
          decreaseLayerLevel(activeWorkspace?.id);
        }}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconStackPush stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const IncreaseLayerLevel = (props: any) => {
  // Props
  const { activeWorkspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  const increaseLayerLevel = useActiveWorkspaces((s) => s.moveWorkspaceUp);

  return (
    <Tooltip content={l.move_up_layer_level}>
      <BButton
        iconButton
        unclicky
        size={"xs"}
        variant={"ghost"}
        onClick={() => increaseLayerLevel(activeWorkspace?.id)}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconStackPop stroke={1.5} />
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
  const toggleVisibility = useActiveWorkspaces(
    (s) => s.toggleActiveWorkspaceVisibility
  );

  return (
    <Tooltip content={l.toggle_visibility}>
      <BButton
        iconButton
        unclicky
        size={"xs"}
        variant={"ghost"}
        onClick={() => {
          toggleVisibility(activeWorkspace?.id);
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
const ViewWorkspace = (props: any) => {
  // Props
  const { activeWorkspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const mapRef = useMapViewState((s) => s.mapRef);

  // Utils
  function onViewLayers() {
    if (mapRef.current && activeWorkspace?.bbox) {
      const [minLng, minLat, maxLng, maxLat] = activeWorkspace.bbox;

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 20, // px
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
        onClick={onViewLayers}
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

const ActiveWorkspaceListItem = (props: Props) => {
  // Props
  const { activeWorkspace, index } = props;

  return (
    <AccordionItem value={`${activeWorkspace.id}`} py={2}>
      <AccordionItemTrigger indicatorPlacement="none" py={0}>
        <HStack pl={1} w={"full"}>
          <CContainer cursor={"pointer"} gap={1}>
            <Badge w={"fit"} ml={-1} mb={"2px"}>
              {activeWorkspace?.workspace_category?.label}
            </Badge>

            <HStack truncate>
              <Icon boxSize={5}>
                <IconFolders stroke={1.5} />
              </Icon>

              <P fontWeight={"semibold"} lineHeight={1.4} lineClamp={1}>
                {activeWorkspace.title}
              </P>
            </HStack>
          </CContainer>

          <ActiveWorkspaceUtils
            activeWorkspace={activeWorkspace}
            index={index}
            ml={"auto"}
          />
        </HStack>
      </AccordionItemTrigger>

      <AccordionItemContent py={0} pt={1}>
        <CContainer gap={1}>
          {activeWorkspace?.layers &&
            [...activeWorkspace?.layers]?.reverse()?.map((activeLayer) => {
              return (
                <ActiveLayerListItem
                  key={activeLayer.id}
                  activeLayer={activeLayer}
                />
              );
            })}
        </CContainer>
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default ActiveWorkspaceListItem;
