import { Presence, PresenceProps, StackProps } from "@chakra-ui/react";
import CContainer from "./CContainer";
import { useThemeConfig } from "@/context/useThemeConfig";
import useSelectedPolygon from "@/context/useSelectedPolygon";

interface Props extends PresenceProps {
  fRef?: any;
  children?: any;
  open?: boolean;
  containerProps?: StackProps;
  animationEntrance?: "top" | "bottom" | "left" | "right" | "center";
}

const FloatingContainer = (props: Props) => {
  // Props
  const {
    fRef,
    children,
    open,
    containerProps,
    animationEntrance = "top",
    ...restProps
  } = props;

  // Context
  const { themeConfig } = useThemeConfig();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);

  const animationName = {
    top: {
      _open: "slide-from-top, fade-in",
      _closed: "slide-to-top, fade-out",
    },
    center: {
      _open: "scale-in, fade-in",
      _closed: "scale-out, fade-out",
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
      key={`${selectedPolygon?.polygon?.properties?.id}-${selectedPolygon?.clickedLngLat?.lon}-${selectedPolygon?.clickedLngLat?.lat}`}
      lazyMount
      unmountOnExit
      present={open}
      animationName={animationName[animationEntrance]}
      animationDuration="moderate"
      {...restProps}
    >
      <CContainer
        fRef={fRef}
        bg={"body"}
        border={"1px solid"}
        borderColor={"border.muted"}
        borderRadius={themeConfig.radii.container}
        pointerEvents={open ? "auto" : "none"}
        {...containerProps}
      >
        {children}
      </CContainer>
    </Presence>
  );
};

export default FloatingContainer;
