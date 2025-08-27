import { LAYOUT_OPTIONS } from "@/constants/layoutOptions";
import { NAVS } from "@/constants/navs";
import { PANEL_WIDTH_NUMBER } from "@/constants/sizes";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import pluck from "@/utils/pluck";
import {
  Circle,
  CircleProps,
  HStack,
  Icon,
  Separator,
  Stack,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import {
  IconMaximize,
  IconMinimize,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import BackButton from "../ui-custom/BackButton";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import FloatCounter from "../ui-custom/FloatCounter";
import Heading6 from "../ui-custom/Heading6";
import HelperText from "../ui-custom/HelperText";
import HScroll from "../ui-custom/HScroll";
import Img from "../ui-custom/Img";
import { Avatar } from "../ui/avatar";
import { ColorModeButton } from "../ui/color-mode";
import { Tooltip } from "../ui/tooltip";
import BaseMap from "./admin/Basemap";
import BasemapMapOverlay from "./admin/BasemapMapOverlay";
import CurrentUserTimeZone from "./CurrentUserTimeZone";
import SimplePopover from "./SimplePopover";
import Trivia from "./Trivia";

interface Interface__NavItemContainer extends StackProps {
  active?: boolean;
}
interface Props {
  children?: any;
  title?: string;
  backPath?: string;
  activePath?: string;
  withMaps?: boolean;
}

const MainPanelUtils = () => {
  // Hooks
  const { l } = useLang();

  // Contexts
  const fullPanel = useLayout((s) => s.fullPanel);
  const setLayout = useLayout((s) => s.setLayout);

  function toggleFullMainPanel() {
    if (!fullPanel) {
      setLayout(LAYOUT_OPTIONS[1]);
    } else if (fullPanel) {
      setLayout(LAYOUT_OPTIONS[0]);
    }
  }

  return (
    <HStack flexShrink={0} gap={0}>
      <ColorModeButton size={"md"} />

      <CurrentUserTimeZone />

      <Tooltip content={fullPanel ? l.half_main_panel : l.full_main_panel}>
        <BButton iconButton variant={"ghost"} onClick={toggleFullMainPanel}>
          <Icon>
            {fullPanel ? (
              <IconMinimize stroke={1.5} />
            ) : (
              <IconMaximize stroke={1.5} />
            )}
          </Icon>
        </BButton>
      </Tooltip>

      {/* <LayoutMenu /> */}

      <Tooltip content={l.close_main_panel}>
        <BButton
          iconButton
          variant={"ghost"}
          color={"fg.error"}
          onClick={() => {
            setLayout(LAYOUT_OPTIONS[2]);
          }}
        >
          <Icon>
            <IconX />
          </Icon>
        </BButton>
      </Tooltip>
    </HStack>
  );
};
const ActiveNavIndicator = ({ ...props }: CircleProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Circle
      w={"12px"}
      h={"2px"}
      bg={themeConfig.primaryColor}
      position={"absolute"}
      bottom={0}
      {...props}
    />
  );
};
const NavLinkContainer = (props: any) => {
  // Props
  const { children, to, ...restProps } = props;

  // Contexts
  const halfPanel = useLayout((s) => s.halfPanel);
  const closedPanel = useLayout((s) => s.closedPanel);
  const setLayout = useLayout((s) => s.setLayout);

  // States
  const location = useLocation();
  const cp = location.pathname;

  return (
    <Link
      to={to}
      onClick={() => {
        if (closedPanel) setLayout(LAYOUT_OPTIONS[0]);
        if (halfPanel && cp === to) setLayout(LAYOUT_OPTIONS[2]);
      }}
      {...restProps}
    >
      {children}
    </Link>
  );
};
const NavItemContainer = (props: Interface__NavItemContainer) => {
  // Props
  const { children, active, ...restProps } = props;
  // Contexts
  const { themeConfig } = useThemeConfig();
  const closedPanel = useLayout((s) => s.closedPanel);

  return (
    <VStack
      gap={0}
      h={["60px", null, "40px"]}
      justify={"center"}
      position={"relative"}
      color={active && !closedPanel ? "fg" : "fg.muted"}
      _hover={{ bg: "bg.muted" }}
      borderRadius={themeConfig.radii.component}
      transition={"200ms"}
      {...restProps}
    >
      {children}

      {active && !closedPanel && <ActiveNavIndicator bottom={[0, null, 0]} />}
    </VStack>
  );
};
const NavList = (props: any) => {
  // Props
  const { activePath } = props;

  // Hooks
  const { l } = useLang();
  const iss = useIsSmScreenWidth();

  return (
    <>
      {NAVS.map((nav: any, i) => {
        const active = activePath === nav.path;

        return (
          <NavLinkContainer key={i} to={nav.path}>
            <Tooltip
              content={pluck(l, nav.labelKey)}
              positioning={{ placement: "right" }}
              contentProps={{ ml: 2 }}
            >
              <NavItemContainer active={active} w={["64px", null, "40px"]}>
                <FloatCounter
                  circleProps={{
                    h: "18px",
                    fontSize: "xs",
                    mt: "18px",
                    mr: "18px",
                  }}
                  display={"none"}
                >
                  2
                </FloatCounter>

                <Icon {...nav?.iconProps}>
                  <nav.icon strokeWidth={1.5} size={iss ? 24 : 20} />
                </Icon>

                {iss && (
                  <HelperText
                    color={active ? "" : "fg.muted"}
                    lineHeight={1}
                    mt={1}
                    maxW={"50px"}
                    truncate
                  >
                    {pluck(l, nav.labelKey)}
                  </HelperText>
                )}
              </NavItemContainer>
            </Tooltip>
          </NavLinkContainer>
        );
      })}
    </>
  );
};
const NavList2 = (props: any) => {
  // Props
  const { activePath } = props;

  // Hooks
  const { l } = useLang();
  const iss = useIsSmScreenWidth();

  return (
    <>
      <NavLinkContainer to={"/settings"}>
        <Tooltip
          content={pluck(l, "navs.settings")}
          positioning={{ placement: "right" }}
          contentProps={{ ml: 2 }}
        >
          <NavItemContainer
            active={activePath === "/settings"}
            w={["60px", null, "40px"]}
          >
            <Icon>
              <IconSettings stroke={1.5} size={iss ? 24 : 20} />
            </Icon>

            {iss && (
              <HelperText
                color={activePath === "/settings" ? "" : "fg.muted"}
                lineHeight={1}
                mt={1}
                truncate
              >
                {pluck(l, "navs.settings")}
              </HelperText>
            )}
          </NavItemContainer>
        </Tooltip>
      </NavLinkContainer>

      {!iss && <Separator w={"full"} my={1} borderColor={"border.muted"} />}

      <NavLinkContainer to={"/profile"}>
        <Tooltip
          content={pluck(l, "navs.profile")}
          positioning={{ placement: "right" }}
          contentProps={{ ml: 2 }}
        >
          <NavItemContainer
            active={activePath === "/profile"}
            w={["60px", null, "40px"]}
          >
            <Avatar
              name="Jolitos Kurniawan"
              cursor={"pointer"}
              size={"xs"}
              w={"24px"}
              h={"24px"}
            />

            {iss && (
              <HelperText
                color={activePath === "/profile" ? "" : "fg.muted"}
                lineHeight={1}
                mt={1}
                truncate
              >
                {pluck(l, "navs.profile")}
              </HelperText>
            )}
          </NavItemContainer>
        </Tooltip>
      </NavLinkContainer>
    </>
  );
};

const NavContainer = ({
  children,
  title,
  backPath,
  activePath,
  withMaps = false,
}: Props) => {
  // Hooks
  const iss = useIsSmScreenWidth();

  // Contexts
  const { themeConfig } = useThemeConfig();
  const halfPanel = useLayout((s) => s.halfPanel);
  const fullPanel = useLayout((s) => s.fullPanel);
  const closedPanel = useLayout((s) => s.closedPanel);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CContainer position={"relative"}>
      <Stack
        flexDir={iss ? "column" : "row"}
        h={"100dvh"}
        gap={0}
        overflow={"clip"}
        pos={"relative"}
      >
        {/* Lg screen nav */}
        {!iss && (
          <VStack
            w={"fit"}
            align={"center"}
            px={2}
            py={"22px"}
            overflowX={"clip"}
            className="scrollY"
            overflowY={"auto"}
            bg={"body"}
            // borderRight={"1px solid"}
            // borderColor={"border.muted"}
            flexShrink={0}
          >
            <Link to={"/"}>
              <Img src="/logo.png" w={"24px"} />
            </Link>

            <VStack justify={"center"} flex={1}>
              <NavList activePath={activePath} />
            </VStack>

            <VStack mt={"auto"}>
              <NavList2 activePath={activePath} />
            </VStack>
          </VStack>
        )}

        {/* Content */}
        <Stack
          flex={1}
          flexDir={iss ? "column-reverse" : "row"}
          w={iss ? "full" : "calc(100vw - 76px)"}
          h={iss ? "calc(100dvh - 80px)" : "100dvh"}
          align={"stretch"}
          gap={0}
        >
          {/* Main Panel */}
          {(halfPanel || fullPanel) && (
            <CContainer
              fRef={containerRef}
              position={"relative"}
              flex={1}
              className="scrollY"
              overflowX={"clip"}
              bg={"bgContent"}
              w={halfPanel && !iss && withMaps ? `${PANEL_WIDTH_NUMBER}px` : ""}
              h={halfPanel && iss && withMaps ? "50%" : ""}
              zIndex={3}
              borderRight={iss ? "" : "1px solid"}
              borderTop={iss ? "1px solid" : ""}
              borderColor={"border.muted"}
            >
              <HStack
                justify={"space-between"}
                pl={3}
                pr={[0, null, 1]}
                py={"9px"}
                flexShrink={0}
                position={"sticky"}
                top={0}
                zIndex={2}
                bg={iss ? "body" : "bgContent"}
                borderBottom={iss ? "1px solid {colors.border.subtle}" : ""}
              >
                <HStack>
                  {backPath && (
                    <BackButton
                      iconButton
                      backPath={backPath}
                      borderRadius={themeConfig.radii.component}
                    />
                  )}

                  <SimplePopover content={title}>
                    <Heading6
                      fontWeight={"bold"}
                      lineClamp={1}
                      cursor={"pointer"}
                    >
                      {title}
                    </Heading6>
                  </SimplePopover>
                </HStack>

                <MainPanelUtils />
              </HStack>

              {children}
            </CContainer>
          )}

          {/* Maps */}
          {(halfPanel || closedPanel) && withMaps && (
            <CContainer
              w={
                halfPanel && !iss
                  ? `calc(100% - ${PANEL_WIDTH_NUMBER}px)`
                  : "full"
              }
              h={halfPanel && iss ? "50%" : "full"}
              position={"relative"}
            >
              <Trivia />

              <BaseMap />

              <BasemapMapOverlay />
            </CContainer>
          )}
        </Stack>

        {/* Sm screen nav */}
        {iss && (
          <HScroll
            h={"80px"}
            justify={"space-between"}
            pt={1}
            pb={2}
            px={4}
            borderTop={"1px solid"}
            borderColor={"d2"}
            overflowX={"auto"}
            flexShrink={0}
            position={"sticky"}
            bottom={0}
            bg={"body"}
            gap={2}
          >
            <NavList activePath={activePath} />

            <NavList2 activePath={activePath} />
          </HScroll>
        )}
      </Stack>
    </CContainer>
  );
};

export default NavContainer;
