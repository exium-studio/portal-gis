import formatDate from "@/utils/formatDate";
import {
  HStack,
  StackProps,
  StatusIndicator,
  StatusRoot,
} from "@chakra-ui/react";
import P from "../ui-custom/P";

interface Props extends StackProps {
  deletedAt: string;
}

const DeleteStatus = (props: Props) => {
  // Props
  const { deletedAt, ...restProps } = props;

  return (
    <HStack {...restProps}>
      <StatusRoot colorPalette={"red"} size={"sm"}>
        <StatusIndicator />
      </StatusRoot>

      <P color={"fg.subtle"}>{formatDate(deletedAt)}</P>
    </HStack>
  );
};

export default DeleteStatus;
