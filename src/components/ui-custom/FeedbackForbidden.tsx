import { Icon, StackProps } from "@chakra-ui/react";
import { IconBan } from "@tabler/icons-react";
import { EmptyState } from "../ui/empty-state";
import CContainer from "./CContainer";
import useLang from "@/context/useLang";

interface Props extends StackProps {
  title?: string;
  description?: string;
}

export default function FeedbackForbidden({
  title,
  description,
  ...props
}: Props) {
  // Hooks
  const { l } = useLang();

  return (
    <CContainer
      w={"fit"}
      m={"auto"}
      align={"center"}
      minH={"300px"}
      justify={"center"}
      {...props}
    >
      <EmptyState
        icon={
          <Icon>
            <IconBan />
          </Icon>
        }
        title={title || l.forbidden_feedback.title}
        description={description || l.forbidden_feedback.description}
        maxW={"300px"}
      />
    </CContainer>
  );
}
