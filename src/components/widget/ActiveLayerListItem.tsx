import { Interface__ActiveLayer } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import capsFirstLetter from "@/utils/capsFirstLetter";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import {
  IconEye,
  IconEyeOff,
  IconLine,
  IconPolygon,
} from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import P from "../ui-custom/P";
import { Tooltip } from "../ui/tooltip";
import SimplePopover from "./SimplePopover";

interface Props extends StackProps {
  activeLayer: Interface__ActiveLayer;
}

const ActiveLayerUtils = (props: any) => {
  // Props
  const { activeLayer, ...restProps } = props;

  // TODO dev control zindex for workspace layer

  return (
    <HStack gap={1} {...restProps}>
      {/* <DecreaseLayerLevel activeLayer={activeLayer} /> */}

      {/* <IncreaseLayerLevel activeLayer={activeLayer} /> */}

      <ToggleVisibility activeLayer={activeLayer} />
    </HStack>
  );
};
// const DecreaseLayerLevel = (props: any) => {
//   // Props
//   const { activeLayer } = props;

//   // Hooks
//   const { l } = useLang();

//   // Contexts
//   const decreaseLayerLevel = useActiveWorkspaces((s) => s.moveLayerDown);

//   return (
//     <Tooltip content={l.move_down_layer_level}>
//       <BButton
//         iconButton
//         unclicky
//         size={"xs"}
//         variant={"ghost"}
//         onClick={() => {
//           decreaseLayerLevel(activeLayer?.workspace?.id, activeLayer?.id);
//         }}
//       >
//         <Icon boxSize={5}>
//           <IconStackPush stroke={1.5} />
//         </Icon>
//       </BButton>
//     </Tooltip>
//   );
// };
// const IncreaseLayerLevel = (props: any) => {
//   // Props
//   const { activeLayer } = props;

//   // Hooks
//   const { l } = useLang();

//   // Contexts
//   const increaseLayerLevel = useActiveWorkspaces((s) => s.moveLayerUp);

//   return (
//     <Tooltip content={l.move_up_layer_level}>
//       <BButton
//         iconButton
//         unclicky
//         size={"xs"}
//         variant={"ghost"}
//         onClick={() => {
//           increaseLayerLevel(activeLayer?.workspace?.id, activeLayer?.id);
//         }}
//       >
//         <Icon boxSize={5}>
//           <IconStackPop stroke={1.5} />
//         </Icon>
//       </BButton>
//     </Tooltip>
//   );
// };
const ToggleVisibility = (props: any) => {
  // Props
  const { activeLayer } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const toggleVisibility = useActiveWorkspaces((s) => s.toggleLayerVisibility);

  return (
    <Tooltip content={l.toggle_visibility}>
      <BButton
        iconButton
        unclicky
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
    </Tooltip>
  );
};

const ActiveLayerListItem = (props: Props) => {
  // Props
  const { activeLayer, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <HStack
      borderRadius={themeConfig.radii.container}
      transition={"200ms"}
      gap={0}
      {...restProps}
    >
      <HStack borderRadius={themeConfig.radii.component} w={"full"}>
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

        <ActiveLayerUtils activeLayer={activeLayer} ml={"auto"} />
      </HStack>
    </HStack>
  );
};

export default ActiveLayerListItem;
