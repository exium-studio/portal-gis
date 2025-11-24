import P from "@/components/ui-custom/P";
import useLang from "@/context/useLang";
import { StackProps } from "@chakra-ui/react";
import CContainer from "./CContainer";

interface Props extends StackProps {
  children?: any;
}

export default function FeedbackNotFound({ children, ...props }: Props) {
  // Hooks
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      minH={"100px"}
      justify={"center"}
      {...props}
    >
      <P color={"fg.subtle"}>{l.not_found_feedback.title}</P>
      {children}
    </CContainer>
  );
}
