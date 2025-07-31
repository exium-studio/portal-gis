import { Interface__ActiveLayer } from "@/constants/interfaces";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import capsFirstLetter from "@/utils/capsFirstLetter";
import { HStack, Icon } from "@chakra-ui/react";
import {
  IconEye,
  IconGripVertical,
  IconLine,
  IconPolygon,
} from "@tabler/icons-react";
import { useState } from "react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import SimplePopover from "./SimplePopover";

interface Props {
  activeLayer: Interface__ActiveLayer;
}

const ActiveLayerUtils = () => {
  // Hooks
  const iss = useIsSmScreenWidth();
  const halfPanel = useLayout((s) => s.halfPanel);

  return (
    <HStack ml={"auto"}>
      <BButton iconButton size={"xs"} variant={"ghost"}>
        <Icon boxSize={5}>
          <IconEye stroke={1.5} />
        </Icon>
      </BButton>
    </HStack>
  );
};

const ActiveLayerListItem = (props: Props) => {
  // Props
  const { activeLayer } = props;

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
      <BButton
        iconButton
        unclicky
        variant={"ghost"}
        size={"xs"}
        minW={"28px"}
        opacity={hover ? 1 : 0}
        pointerEvents={hover ? "auto" : "none"}
      >
        <Icon boxSize={5}>
          <IconGripVertical />
        </Icon>
      </BButton>

      <HStack
        bg={hover ? "d1" : ""}
        borderRadius={themeConfig.radii.container}
        p={1}
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
          <HStack cursor={"pointer"}>
            <Icon boxSize={5} color={"fg.subtle"}>
              {activeLayer?.layer_type === "fill" ? (
                <IconPolygon stroke={1.5} />
              ) : (
                <IconLine stroke={1.5} />
              )}
            </Icon>

            <P>{activeLayer?.name}</P>
          </HStack>
        </SimplePopover>

        <ActiveLayerUtils />
      </HStack>
    </HStack>
  );
};

export default ActiveLayerListItem;
