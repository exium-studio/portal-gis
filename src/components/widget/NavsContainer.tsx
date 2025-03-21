import { NAVS } from "@/constant/navs";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useCallBackOnNavigate from "@/hooks/useCallBackOnNavigate";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import pluck from "@/utils/pluck";
import {
  Circle,
  CircleProps,
  HStack,
  Icon,
  Stack,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import BackButton from "../ui-custom/BackButton";
import BnwLogo from "../ui-custom/BnwLogo";
import CContainer from "../ui-custom/CContainer";
import FloatCounter from "../ui-custom/FloatCounter";
import Heading6 from "../ui-custom/Heading6";
import HelperText from "../ui-custom/HelperText";
import Logo from "../ui-custom/Logo";
import { Avatar } from "../ui/avatar";
import { Tooltip } from "../ui/tooltip";
import CurrentUserTimeZone from "./CurrentUserTimeZone";
import MerchantInbox from "./Inbox";
import LayoutMenu from "./LayoutMenu";
import useLayout from "@/context/useLayout";

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
const NavContainer = ({
  children,
  title,
  backPath,
  activePath,
  withMaps = false,
}: Props) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();
  const { layout } = useLayout();

  // States, Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Utils
  useCallBackOnNavigate(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  });
  const iss = useIsSmScreenWidth();

  // Components
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
        w={"40px"}
        h={"40px"}
        justify={"center"}
        position={"relative"}
        color={active ? "fg" : "fg.muted"}
        _hover={{ bg: "bg.muted" }}
        borderRadius={themeConfig.radii.component}
        transition={"200ms"}
        {...props}
      >
        {active && <ActiveNavIndicator bottom={[-2, null, 0]} />}

        {children}
      </VStack>
    );
  };
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
  const NavList = () => {
    return (
      <>
        {NAVS.map((nav: any, i) => {
          const active = activePath === nav.path;

          return (
            <Link key={i} to={nav.path}>
              <Tooltip
                content={pluck(l, nav.labelKey)}
                positioning={{ placement: "right" }}
                contentProps={{ ml: 2 }}
              >
                <NavItemContainer active={active}>
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
            </Link>
          );
        })}
      </>
    );
  };
  const NavList2 = () => {
    return (
      <>
        <Link to={"/profile"}>
          <Tooltip
            content={pluck(l, "navs.profile")}
            positioning={{ placement: "right" }}
            contentProps={{ ml: 2 }}
          >
            <NavItemContainer active={activePath === "/profile"}>
              <Avatar
                name="Jolitos Kurniawan"
                cursor={"pointer"}
                size={"xs"}
                w={["24px", null, "28px"]}
                h={["24px", null, "28px"]}
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
        </Link>
      </>
    );
  };

  return (
    <Stack flexDir={iss ? "column" : "row"} h={"100dvh"} gap={0}>
      {/* Lg screen nav */}
      {!iss && (
        <VStack
          w={"fit"}
          align={"center"}
          px={2}
          pt={5}
          pb={4}
          overflowY={"auto"}
          overflowX={"hidden"}
          className="scrollY"
          bg={"body"}
          borderRight={"1px solid"}
          borderColor={"border.muted"}
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
      >
        {/* Main Panel */}
        {(layout.id === 1 || layout.id === 2) && (
          <CContainer
            fRef={containerRef}
            position={"relative"}
            flex={1}
            overflowY={"auto"}
            overflowX={"clip"}
            bg={"bgContent"}
            w={layout.id === 1 && !iss ? "50%" : ""}
            h={layout.id === 1 && iss ? "50%" : ""}
          >
            <HStack
              justify={"space-between"}
              p={2}
              px={4}
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

              <HStack flexShrink={0} gap={0}>
                {withMaps && <LayoutMenu />}

                <CurrentUserTimeZone />

                <MerchantInbox />
              </HStack>
            </HStack>

            {children}
          </CContainer>
        )}

        {/* Maps */}
        {(layout.id === 1 || layout.id === 3) && (
          <CContainer
            w={layout.id === 1 && !iss ? "50%" : ""}
            h={layout.id === 1 && iss ? "50%" : ""}
            p={2}
          >
            {layout.id === 3 && <LayoutMenu />}
          </CContainer>
        )}
      </Stack>

      {/* Sm screen nav */}
      {iss && (
        <HStack
          h={"80px"}
          justify={"space-around"}
          pt={1}
          pb={6}
          px={4}
          borderTop={"1px solid"}
          borderColor={"d2"}
          overflowX={"auto"}
          flexShrink={0}
          position={"sticky"}
          bottom={0}
          bg={"body"}
        >
          <NavList />

          <NavList2 />
        </HStack>
      )}
    </Stack>
  );
};

export default NavContainer;
