import { TooltipContentProps } from "@chakra-ui/react";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import { ReactNode } from "react";

interface Props extends Omit<TooltipContentProps, "content"> {
  children: ReactNode;
  content?: ReactNode;
}

const SimplePopover = (props: Props) => {
  // Props
  const { children, content, ...restProps } = props;

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent p={3} w={"full"} maxW={"280px !important"} {...restProps}>
        {content}
      </PopoverContent>
    </PopoverRoot>
  );
};

export default SimplePopover;
