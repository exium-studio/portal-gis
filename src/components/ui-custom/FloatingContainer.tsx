import { Presence, PresenceProps, StackProps } from "@chakra-ui/react";
import CContainer from "./CContainer";
import { useThemeConfig } from "@/context/useThemeConfig";

interface Props extends PresenceProps {
  children?: any;
  open?: boolean;
  containerProps?: StackProps;
  animationEntrance?: "top" | "bottom" | "left" | "right" | "center";
}

const FloatingContainer = ({
  children,
  open,
  containerProps,
  animationEntrance = "top",
  ...props
}: Props) => {
  // Components
  const { themeConfig } = useThemeConfig();

  const animationName = {
    top: {
      _open: "slide-from-top, fade-in",
      _closed: "slide-to-top, fade-out",
    },
    center: {
      _open: "scale-up, fade-in",
      _closed: "scale-down, fade-out",
    },
    left: {
      _open: "slide-from-left, fade-in",
      _closed: "slide-to-left, fade-out",
    },
    right: {
      _open: "slide-from-right, fade-in",
      _closed: "slide-to-right, fade-out",
    },
    bottom: {
      _open: "slide-from-bottom, fade-in",
      _closed: "slide-to-bottom, fade-out",
    },
  };

  return (
    <Presence
      lazyMount
      present={open}
      animationName={animationName[animationEntrance]}
      animationDuration="moderate"
      {...props}
    >
      <CContainer
        bg={"body"}
        border={"1px solid"}
        borderColor={"border.muted"}
        borderRadius={themeConfig.radii.container}
        p={1}
        transition={"140ms"}
        pointerEvents={open ? "auto" : "none"}
        {...containerProps}
      >
        {children}
      </CContainer>
    </Presence>
  );
};

export default FloatingContainer;
