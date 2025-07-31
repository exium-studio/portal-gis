import { Interface__ActiveLayer } from "@/constants/interfaces";
import { HStack } from "@chakra-ui/react";
import P from "../ui-custom/P";

interface Props {
  activeLayer: Interface__ActiveLayer;
}

const ActiveLayerListItem = (props: Props) => {
  // Props
  const { activeLayer } = props;

  return (
    <HStack>
      <P>{activeLayer?.name}</P>
    </HStack>
  );
};

export default ActiveLayerListItem;
