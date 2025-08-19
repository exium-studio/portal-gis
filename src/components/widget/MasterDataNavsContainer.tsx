import { MASTER_DATA_NAVS } from "@/constants/navs";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { useMasterDataContent } from "@/hooks/useMasterDataContent";
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

const MasterDataNavsContainer = ({ children, activePath, ...props }: Props) => {
  // Hooks
  const { l } = useLang();
  // const { sw } = useScreen();
  const iss = useIsSmScreenWidth();
  const { masterDataRoute } = useMasterDataContent();

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
      id="masterDataNavsContainer"
      w={"full"}
      h={"full"}
      pl={!compact ? 4 : ""}
      align={"start"}
      gap={0}
      overflowY={"auto"}
      {...props}
    >
      {/* Settings Navs */}
      {(!compact || masterDataRoute) && (
        <CContainer
          pl={compact && masterDataRoute ? 4 : 0}
          pr={compact && masterDataRoute ? 3 : 0}
          pt={4}
          pb={4}
          w={compact ? "full" : "240px"}
          flexShrink={0}
          overflowY={"auto"}
          maxH={"full"}
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
            <CContainer className="scrollY" pl={2} pr={1} gap={4}>
              {MASTER_DATA_NAVS.map((item, i) => {
                return (
                  <CContainer key={i} gap={1}>
                    <Text fontWeight={"bold"} color={"fg.subtle"} mx={2} mb={1}>
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

                            <P lineClamp={1} textAlign={"left"}>
                              {pluck(l, nav.labelKey)}
                            </P>

                            {compact && (
                              <Icon ml={"auto"} mr={-1}>
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
        </CContainer>
      )}

      {/* Content */}
      <PageContainer
        display={compact && masterDataRoute ? "none" : "flex"}
        h={"full"}
      >
        {children}
      </PageContainer>
    </HStack>
  );
};

export default MasterDataNavsContainer;
