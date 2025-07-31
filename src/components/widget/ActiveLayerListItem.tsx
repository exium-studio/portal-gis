import { Interface__ActiveLayer } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import capsFirstLetter from "@/utils/capsFirstLetter";
import { HStack, Icon } from "@chakra-ui/react";
import {
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconLine,
  IconPolygon,
  IconStackPop,
  IconStackPush,
} from "@tabler/icons-react";
import { useState } from "react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import SimplePopover from "./SimplePopover";

interface Props {
  activeLayer: Interface__ActiveLayer;
}

const ActiveLayerUtils = (props: any) => {
  // Props
  const { activeLayer } = props;

  // Hooks
  // const iss = useIsSmScreenWidth();
  // const halfPanel = useLayout((s) => s.halfPanel);

  return (
    <HStack ml={"auto"} gap={1}>
      <BButton iconButton size={"xs"} variant={"ghost"}>
        <Icon boxSize={5}>
          <IconStackPush stroke={1.5} />
        </Icon>
      </BButton>

      <BButton iconButton size={"xs"} variant={"ghost"}>
        <Icon boxSize={5}>
          <IconStackPop stroke={1.5} />
        </Icon>
      </BButton>

      <ToggleVisibility activeLayer={activeLayer} />
    </HStack>
  );
};
const ToggleVisibility = (props: any) => {
  // Props
  const { activeLayer } = props;

  // Contexts
  const toggleVisibility = useActiveWorkspaces((s) => s.toggleLayerVisibility);

  return (
    <BButton
      iconButton
      size={"xs"}
      variant={"ghost"}
      onClick={() => {
        toggleVisibility(activeLayer?.workspace?.id, activeLayer?.id);
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
  );
};

const ActiveLayerListItem = (props: Props) => {
  // Props
  const { activeLayer } = props;

  // Hooks
  const iss = useIsSmScreenWidth();

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const [hover, setHover] = useState<boolean>(false);

  return (
    <HStack
      borderRadius={themeConfig.radii.container}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      transition={"200ms"}
      gap={1}
    >
      {/* Dnd button */}
      {!iss && (
        <BButton
          iconButton
          unclicky
          variant={"ghost"}
          // size={"xs"}
          minW={"28px"}
          opacity={hover ? 1 : 0}
          pointerEvents={hover ? "auto" : "none"}
        >
          <Icon boxSize={"18px"}>
            <IconGripVertical />
          </Icon>
        </BButton>
      )}

      <HStack
        bg={hover ? "d1" : ""}
        borderRadius={themeConfig.radii.component}
        p={1}
        pl={iss ? 6 : 1}
        w={"full"}
      >
        <SimplePopover
          content={
            <CContainer gap={1}>
              <P w={"full"}>{activeLayer?.name}</P>

              <P w={"full"} color={"fg.subtle"}>
                {activeLayer?.description}
              </P>

              <HStack color={"fg.subtle"} mt={1}>
                <Icon boxSize={5}>
                  {activeLayer?.layer_type === "fill" ? (
                    <IconPolygon stroke={1.5} />
                  ) : (
                    <IconLine stroke={1.5} />
                  )}
                </Icon>

                <P lineClamp={1}>{capsFirstLetter(activeLayer?.layer_type)}</P>
              </HStack>
            </CContainer>
          }
        >
          <HStack cursor={"pointer"} pl={1}>
            <Icon boxSize={5} color={"fg.subtle"}>
              {activeLayer?.layer_type === "fill" ? (
                <IconPolygon stroke={1.5} />
              ) : (
                <IconLine stroke={1.5} />
              )}
            </Icon>

            <P lineClamp={1}>{activeLayer?.name}</P>
          </HStack>
        </SimplePopover>

        <ActiveLayerUtils activeLayer={activeLayer} />
      </HStack>
    </HStack>
  );
};

export default ActiveLayerListItem;
