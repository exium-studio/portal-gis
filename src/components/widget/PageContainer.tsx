import { StackProps } from "@chakra-ui/react";
import CContainer from "../ui-custom/CContainer";

interface Props extends StackProps {}
const PageContainer = ({ children, ...props }: Props) => {
  return (
    <CContainer
      pt={4}
      pb={4}
      px={4}
      // pl={[2, null, 4]}
      // pr={["2px", null, "10px"]}
      {...props}
    >
      {children}
    </CContainer>
  );
};

export default PageContainer;
