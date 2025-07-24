import { StackProps } from "@chakra-ui/react";
import CContainer from "../ui-custom/CContainer";

interface Props extends StackProps {
  borderless?: boolean;
}
const MenuHeaderContainer = ({ children, borderless, ...props }: Props) => {
  return (
    <CContainer px={1}>
      <CContainer
        px={2}
        py={"14px"}
        borderBottom={borderless ? "" : "1px solid {colors.border.muted}"}
        {...props}
      >
        {children}
      </CContainer>
    </CContainer>
  );
};

export default MenuHeaderContainer;
