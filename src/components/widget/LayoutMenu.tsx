import { useEffect, useRef } from "react";
import { LAYOUT_OPTIONS } from "@/constants/layoutOptions";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import {
  Icon,
  PopoverPositioner,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { IconCheck, IconLayoutColumns } from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import HelperText from "../ui-custom/HelperText";
import CContainer from "../ui-custom/CContainer";
import useLang from "@/context/useLang";

const LayoutMenu = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { layout, setLayout } = useLayout();
  const { l } = useLang();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  const popoverRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !(popoverRef.current as HTMLElement).contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <PopoverRoot open={open}>
      <PopoverTrigger asChild>
        <BButton
          iconButton
          unclicky
          variant={"ghost"}
          w={"fit"}
          onClick={onOpen}
        >
          <IconLayoutColumns stroke={1.5} />
        </BButton>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner ref={popoverRef}>
          <PopoverContent
            p={1}
            borderRadius={themeConfig.radii.container}
            w={"180px"}
          >
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

            <CContainer px={2} pb={1} pt={2}>
              <HelperText lineHeight={1.4}>{l.layout_menu_helper}</HelperText>
            </CContainer>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

export default LayoutMenu;
