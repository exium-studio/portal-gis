import { HStack, StackProps } from "@chakra-ui/react";
import CContainer from "./CContainer";

interface Props extends StackProps {
  borderless?: boolean;
  clearSpacing?: boolean;
}
const ItemHeaderContainer = ({
  children,
  borderless = false,
  clearSpacing = false,
  ...restProps
}: Props) => {
  return (
    <CContainer
      px={3}
      pt={"10px"}
      pb={0}
      p={clearSpacing ? 0 : ""}
      {...restProps}
    >
      <HStack
        borderBottom={"1px solid"}
        borderColor={borderless ? "transparent" : "border.muted"}
        justify={"space-between"}
        pb={2}
        pl={1}
        // gap={4}
        minH={clearSpacing ? "" : "50px"}
        wrap={"wrap"}
        p={clearSpacing ? 0 : ""}
      >
        {children}
      </HStack>
    </CContainer>
  );
};

export default ItemHeaderContainer;
