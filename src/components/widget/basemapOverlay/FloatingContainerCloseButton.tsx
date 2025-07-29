import BButton, { BButtonProps } from "@/components/ui-custom/BButton";
import { Icon } from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";

interface Props extends BButtonProps {}

const FloatingContainerCloseButton = (props: Props) => {
  // Props
  const { ...restProps } = props;

  return (
    <BButton
      iconButton
      unclicky
      size={["xs", null, "sm"]}
      variant={"ghost"}
      ml={"auto"}
      mr={-1}
      {...restProps}
    >
      <Icon boxSize={5}>
        <IconX />
      </Icon>
    </BButton>
  );
};

export default FloatingContainerCloseButton;
