import { LAYOUT_OPTIONS } from "@/constants/layoutOptions";
import { NAVS } from "@/constants/navs";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import { useThemeConfig } from "@/context/useThemeConfig";
import useCallBackOnNavigate from "@/hooks/useCallBackOnNavigate";
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
import BnwLogo from "../ui-custom/BnwLogo";
import CContainer from "../ui-custom/CContainer";
import FloatCounter from "../ui-custom/FloatCounter";
import Heading6 from "../ui-custom/Heading6";
import HelperText from "../ui-custom/HelperText";
import HScroll from "../ui-custom/HScroll";
import Logo from "../ui-custom/Logo";
import { Avatar } from "../ui/avatar";
import { ColorModeButton } from "../ui/color-mode";
import { Tooltip } from "../ui/tooltip";
import AdminMap from "./admin/AdminMap";
import AdminMapOverlay from "./admin/AdminMapOverlay";
import CurrentUserTimeZone from "./CurrentUserTimeZone";

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
  const { layout, setLayout } = useLayout();

  // States
  const layoutFullMainPanel = layout.id === 2;

  function toggleFullMainPanel() {
    if (!layoutFullMainPanel) {
      setLayout(LAYOUT_OPTIONS[1]);
    } else if (layoutFullMainPanel) {
      setLayout(LAYOUT_OPTIONS[0]);
    }
  }

  return (
    <HStack flexShrink={0} gap={0}>
      <ColorModeButton />

      <CurrentUserTimeZone size={"sm"} />

      <Tooltip
        content={layoutFullMainPanel ? l.half_main_panel : l.full_main_panel}
      >
        <BButton
          iconButton
          variant={"ghost"}
          onClick={toggleFullMainPanel}
          size={"sm"}
        >
          <Icon>
            {layoutFullMainPanel ? (
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
          size={"sm"}
        >
          <Icon>
            <IconX />
          </Icon>
        </BButton>
      </Tooltip>
    </HStack>
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
  const { l } = useLang();

  // Contexts
  const { themeConfig } = useThemeConfig();
  const { layout, setLayout } = useLayout();
  const location = useLocation();
  const cp = location.pathname;

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const layoutFullMap = layout.id === 3;
  const layoutHalfMap = layout.id === 1;

  // Utils
  useCallBackOnNavigate(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  });
  const iss = useIsSmScreenWidth();

  // Components
  const ActiveNavIndicator = ({ ...props }: CircleProps) => {
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

    return (
      <Link
        to={to}
        onClick={() => {
          if (layoutFullMap) setLayout(LAYOUT_OPTIONS[0]);
          if (layoutHalfMap && cp === to) setLayout(LAYOUT_OPTIONS[2]);
        }}
        {...restProps}
      >
        {children}
      </Link>
    );
  };
  const NavItemContainer = ({
    children,
    active,
    ...props
  }: Interface__NavItemContainer) => {
    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <VStack
        gap={0}
        h={["60px", null, "40px"]}
        justify={"center"}
        position={"relative"}
        color={active && !layoutFullMap ? "fg" : "fg.muted"}
        _hover={{ bg: "bg.muted" }}
        borderRadius={themeConfig.radii.component}
        transition={"200ms"}
        {...props}
      >
        {children}

        {active && !layoutFullMap && (
          <ActiveNavIndicator bottom={[0, null, 0]} />
        )}
      </VStack>
    );
  };
  const NavList = () => {
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
  const NavList2 = () => {
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

  return (
    <Stack
      flexDir={iss ? "column" : "row"}
      h={"100dvh"}
      gap={0}
      overflow={"clip"}
    >
      {/* Lg screen nav */}
      {!iss && (
        <VStack
          w={"fit"}
          align={"center"}
          px={2}
          py={"26px"}
          overflowX={"clip"}
          className="scrollY"
          overflowY={"auto"}
          bg={"body"}
          // borderRight={"1px solid"}
          // borderColor={"border.muted"}
          flexShrink={0}
        >
          <Link to={"/"}>
            {themeConfig.colorPalette === "gray" ? (
              <BnwLogo />
            ) : (
              <Logo size={16} color={themeConfig.primaryColorHex} />
            )}
          </Link>

          <VStack justify={"center"} flex={1}>
            <NavList />
          </VStack>

          <VStack mt={"auto"}>
            <NavList2 />
          </VStack>
        </VStack>
      )}

      {/* Content */}
      <Stack
        flex={1}
        h={iss ? "calc(100dvh - 80px)" : "100dvh"}
        align={"stretch"}
        gap={0}
        flexDir={iss ? "column-reverse" : "row"}
        w={iss ? "full" : "calc(100vw - 76px)"}
      >
        {/* Main Panel */}
        {(layout.id === 1 || layout.id === 2) && (
          <CContainer
            fRef={containerRef}
            position={"relative"}
            flex={1}
            className="scrollY"
            overflowX={"clip"}
            bg={"bgContent"}
            w={layout.id === 1 && !iss && withMaps ? "50%" : ""}
            h={layout.id === 1 && iss && withMaps ? "50%" : ""}
            zIndex={3}
            borderRight={iss ? "" : "1px solid"}
            borderTop={iss ? "1px solid" : ""}
            borderColor={"border.muted"}
          >
            <HStack
              h={"67px"}
              justify={"space-between"}
              px={4}
              pr={3}
              py={5}
              flexShrink={0}
              position={"sticky"}
              top={0}
              zIndex={2}
              bg={iss ? "body" : "bgContent"}
              borderBottom={iss ? "1px solid {colors.border.subtle}" : ""}
            >
              <HStack>
                {backPath && <BackButton iconButton backPath={backPath} />}

                <Heading6 fontWeight={"bold"} truncate>
                  {title}
                </Heading6>
              </HStack>

              <MainPanelUtils />
            </HStack>

            {children}
          </CContainer>
        )}

        {/* Maps */}
        {(layout.id === 1 || layout.id === 3) && withMaps && (
          <CContainer
            w={layout.id === 1 && !iss ? "50%" : "full"}
            h={layout.id === 1 && iss ? "50%" : "full"}
            position={"relative"}
          >
            <AdminMap />

            <AdminMapOverlay />
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
          <NavList />

          <NavList2 />
        </HScroll>
      )}
    </Stack>
  );
};

export default NavContainer;
