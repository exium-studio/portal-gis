import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  borderless?: boolean;
  clearSpacing?: boolean;
}
const ItemHeaderContainer = ({
  children,
  borderless = false,
  ...restProps
}: Props) => {
  return (
    <HStack
      borderBottom={"1px solid"}
      borderColor={borderless ? "transparent" : "border.muted"}
      justify={"space-between"}
      minH={"50px"}
      wrap={"wrap"}
      p={4}
      gapX={4}
      gapY={4}
      {...restProps}
    >
      {children}
    </HStack>
  );
};

export default ItemHeaderContainer;
