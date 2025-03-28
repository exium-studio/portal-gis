import { LAYOUT_OPTIONS } from "@/constants/layoutOptions";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import {
  Icon,
  PopoverContentProps,
  PopoverPositioner,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IconCheck, IconLayoutColumns } from "@tabler/icons-react";
import { useRef } from "react";
import BButton, { BButtonProps } from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import HelperText from "../ui-custom/HelperText";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import MenuHeaderContainer from "./MenuHeaderContainer";

interface Props extends BButtonProps {
  popoverContentProps?: PopoverContentProps;
}
const LayoutMenu = ({ popoverContentProps, ...props }: Props) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { layout, setLayout } = useLayout();
  const { l } = useLang();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  const contentRef = useRef(null);

  // Close on clicking outside
  useClickOutside(contentRef, onClose);

  return (
    <PopoverRoot open={open}>
      <PopoverTrigger asChild>
        <BButton
          iconButton
          unclicky
          variant={"ghost"}
          w={"fit"}
          onClick={onOpen}
          {...props}
        >
          <IconLayoutColumns stroke={1.5} />
        </BButton>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
          <PopoverContent
            ref={contentRef}
            p={1}
            w={"180px"}
            {...popoverContentProps}
          >
            <MenuHeaderContainer>
              <Text fontWeight={"bold"}>Layout</Text>
            </MenuHeaderContainer>

            <CContainer py={1}>
              {LAYOUT_OPTIONS.map((item, i) => {
                const active = layout.id === item.id;

                return (
                  <BButton
                    key={i}
                    unclicky
                    variant={"ghost"}
                    justifyContent={"start"}
                    px={2}
                    size={"md"}
                    onClick={() => {
                      setLayout(item);
                      onClose();
                    }}
                  >
                    {item.label}

                    {active && (
                      <Icon ml={"auto"} color={themeConfig.primaryColor}>
                        <IconCheck size={20} />
                      </Icon>
                    )}
                  </BButton>
                );
              })}
            </CContainer>

            <CContainer px={2} pb={"6px"} pt={2}>
              <HelperText lineHeight={1.4}>{l.layout_menu_helper}</HelperText>
            </CContainer>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

export default LayoutMenu;
