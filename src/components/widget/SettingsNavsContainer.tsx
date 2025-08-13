import { SETTINGS_NAVS } from "@/constants/navs";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { useSettingsContent } from "@/hooks/useSettingsContent";
import pluck from "@/utils/pluck";
import {
  Circle,
  CircleProps,
  HStack,
  Icon,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import PageContainer from "./PageContainer";
import P from "../ui-custom/P";

interface Props extends StackProps {
  children?: any;
  activePath?: string;
}

const SettingsNavsContainer = ({ children, activePath, ...props }: Props) => {
  // Hooks
  const { l } = useLang();
  // const { sw } = useScreen();
  const iss = useIsSmScreenWidth();
  const { settingsRoute } = useSettingsContent();

  // Contexts
  const { themeConfig } = useThemeConfig();
  const { layout } = useLayout();

  // States
  // const ciss = sw < 1440;
  const compact = layout.id !== 2 || iss;

  // Components
  const ActiveNavIndicator = ({ ...props }: CircleProps) => {
    return (
      <Circle
        w={"2px"}
        h={"12px"}
        bg={themeConfig.primaryColor}
        position={"absolute"}
        left={0}
        {...props}
      />
    );
  };

  return (
    <HStack
      id="settingsNavsContainer"
      w={"full"}
      h={"full"}
      pl={!compact ? 4 : ""}
      align={"start"}
      gap={0}
      {...props}
    >
      {/* Settings Navs */}
      {(!compact || settingsRoute) && (
        <CContainer
          pl={compact && settingsRoute ? 4 : 0}
          pr={compact && settingsRoute ? 3 : 0}
          pt={4}
          pb={4}
          w={compact ? "full" : "240px"}
          flexShrink={0}
          overflowY={"auto"}
          h={"full"}
          maxH={"full"}
          gap={4}
        >
          <CContainer
            bg={"body"}
            borderRadius={themeConfig.radii.container}
            pt={3}
            pb={2}
            border={"1px solid"}
            borderColor={"border.subtle"}
            h={"fit"}
            overflowY={"auto"}
            maxH={"full"}
          >
            <CContainer className="scrollY" pl={2} pr={"2px"} gap={4}>
              {SETTINGS_NAVS.map((item, i) => {
                return (
                  <CContainer key={i}>
                    <Text fontWeight={"bold"} color={"fg.subtle"} mx={2} mb={2}>
                      {pluck(l, item.groupLabelKey)}
                    </Text>

                    {item.list.map((nav, ii) => {
                      const active = activePath === nav.path;

                      return (
                        <Link key={ii} to={nav.path}>
                          <BButton
                            unclicky
                            variant={"ghost"}
                            w={"full"}
                            justifyContent={"start"}
                            px={2}
                            position={"relative"}
                          >
                            {active && <ActiveNavIndicator />}

                            <Icon>
                              <nav.icon stroke={1.5} />
                            </Icon>

                            {pluck(l, nav.labelKey)}

                            {compact && (
                              <Icon ml={"auto"} boxSize={4}>
                                <IconChevronRight stroke={1.5} />
                              </Icon>
                            )}
                          </BButton>
                        </Link>
                      );
                    })}
                  </CContainer>
                );
              })}
            </CContainer>
          </CContainer>

          <P
            fontWeight={"semibold"}
            fontSize={"xs"}
            textAlign={"center"}
            color={"fg.subtle"}
            mt={"auto"}
          >
            Powered by Exium
          </P>
        </CContainer>
      )}

      {/* Content */}
      <PageContainer
        display={compact && settingsRoute ? "none" : "flex"}
        h={"full"}
      >
        {children}
      </PageContainer>
    </HStack>
  );
};

export default SettingsNavsContainer;
