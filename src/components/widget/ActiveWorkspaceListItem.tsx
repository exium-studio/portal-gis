import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import { HStack, Icon } from "@chakra-ui/react";
import {
  IconEye,
  IconEyeOff,
  IconFolders,
  IconStackPop,
  IconStackPush,
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

interface Props {
  activeWorkspace: Interface__ActiveWorkspace;
}

const ActiveWorkspaceUtils = (props: any) => {
  // Props
  const { activeWorkspace, ...restProps } = props;

  // Hooks
  // const iss = useIsSmScreenWidth();
  // const halfPanel = useLayout((s) => s.halfPanel);

  return (
    <HStack
      ml={"auto"}
      gap={1}
      onClick={(e) => e.stopPropagation()}
      {...restProps}
    >
      <DecreaseLayerLevel activeWorkspace={activeWorkspace} />

      <IncreaseLayerLevel activeWorkspace={activeWorkspace} />

      <ToggleVisibility activeWorkspace={activeWorkspace} />
    </HStack>
  );
};
const DecreaseLayerLevel = (props: any) => {
  // Props
  const { activeWorkspace } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const decreaseLayerLevel = useActiveWorkspaces((s) => s.moveWorkspaceDown);

  return (
    <Tooltip content={l.move_down_layer_level}>
      <BButton
        iconButton
        size={"xs"}
        variant={"ghost"}
        onClick={() => {
          decreaseLayerLevel(activeWorkspace?.id);
        }}
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
  const { activeWorkspace } = props;

  // Hooks
  const { l } = useLang();

  const increaseLayerLevel = useActiveWorkspaces((s) => s.moveWorkspaceUp);

  return (
    <Tooltip content={l.move_up_layer_level}>
      <BButton
        iconButton
        size={"xs"}
        variant={"ghost"}
        onClick={() => increaseLayerLevel(activeWorkspace?.id)}
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

const ActiveWorkspaceListItem = (props: Props) => {
  // Props
  const { activeWorkspace } = props;

  return (
    <AccordionItem value={`${activeWorkspace.id}`}>
      <AccordionItemTrigger indicatorPlacement="none">
        <HStack pl={1} w={"full"}>
          <HStack cursor={"pointer"}>
            <Icon boxSize={5}>
              <IconFolders stroke={1.5} />
            </Icon>

            <P fontWeight={"semibold"} lineClamp={1}>
              {activeWorkspace.title}
            </P>
          </HStack>

          <ActiveWorkspaceUtils activeWorkspace={activeWorkspace} ml={"auto"} />
        </HStack>
      </AccordionItemTrigger>

      <AccordionItemContent py={1}>
        <CContainer gap={1}>
          {activeWorkspace?.layers?.map((activeLayer) => {
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
