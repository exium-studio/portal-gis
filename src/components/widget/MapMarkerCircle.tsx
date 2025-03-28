import { useThemeConfig } from "@/context/useThemeConfig";
import { Circle, CircleProps } from "@chakra-ui/react";

interface Props extends CircleProps {}
const MapMarkerCircle = ({ ...props }: Props) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Circle
      bg={themeConfig.primaryColor}
      w={"20px"}
      h={"20px"}
      border={"2px solid white"}
      {...props}
    />
  );
};

export default MapMarkerCircle;
