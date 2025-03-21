import { LAYOUT_OPTIONS } from "@/constant/layoutOptions";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon, PopoverPositioner, Portal } from "@chakra-ui/react";
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

  // States, Refs

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <BButton iconButton unclicky variant={"ghost"}>
          <IconLayoutColumns stroke={1.5} />
        </BButton>
      </PopoverTrigger>

      <Portal>
        <PopoverPositioner>
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
