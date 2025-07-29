import useMapsZoom from "@/context/useMapZoom";
import { OverlayItemContainer } from "../OverlayItemContainer";
import { Group, HStack, Icon } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import BButton from "@/components/ui-custom/BButton";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import NumberInput from "@/components/ui-custom/NumberInput";
import P from "@/components/ui-custom/P";

export const ZoomControl = () => {
  const { mapZoomPercent, setMapZoomPercent } = useMapsZoom();

  return (
    <OverlayItemContainer>
      <Group>
        <Tooltip content={"Zoom out"}>
          <BButton
            iconButton
            unclicky
            variant={"ghost"}
            onClick={() => {
              if (mapZoomPercent > 10) {
                setMapZoomPercent(mapZoomPercent - 10);
              } else {
                setMapZoomPercent(0);
              }
            }}
          >
            <Icon>
              <IconMinus />
            </Icon>
          </BButton>
        </Tooltip>

        <HStack gap={0} justify={"center"}>
          <NumberInput
            integer
            minW={"30px"}
            maxW={"30px"}
            border={"none"}
            px={0}
            onChangeSetter={(input) => {
              setMapZoomPercent(input);
            }}
            inputValue={mapZoomPercent}
            textAlign={"center"}
            max={100}
            fontWeight={"semibold"}
          />
          <P>%</P>
        </HStack>

        <Tooltip content={"Zoom in"}>
          <BButton
            iconButton
            unclicky
            variant={"ghost"}
            onClick={() => {
              if (mapZoomPercent < 90) {
                setMapZoomPercent(mapZoomPercent + 10);
              } else {
                setMapZoomPercent(100);
              }
            }}
          >
            <Icon>
              <IconPlus />
            </Icon>
          </BButton>
        </Tooltip>
      </Group>
    </OverlayItemContainer>
  );
};
