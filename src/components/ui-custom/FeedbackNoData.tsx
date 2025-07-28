import useLang from "@/context/useLang";
import { Icon, StackProps } from "@chakra-ui/react";
import { IconDatabaseOff } from "@tabler/icons-react";
import CContainer from "./CContainer";
import FeedbackState from "./FeedbackState";

interface Props extends StackProps {
  title?: string;
  description?: string;
  icon?: any;
}

export default function FeedbackNoData({
  title,
  description,
  icon,
  children,
  ...props
}: Props) {
  // Contexts
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      align={"center"}
      minH={"300px"}
      justify={"center"}
      gap={4}
      {...props}
    >
      <FeedbackState
        icon={<Icon mb={title ? -2 : 0}>{icon || <IconDatabaseOff />}</Icon>}
        title={title ?? l.no_data_feedback.title}
        description={description ?? l.no_data_feedback.description}
        maxW={"300px"}
      />

      {children}
    </CContainer>
  );
}
