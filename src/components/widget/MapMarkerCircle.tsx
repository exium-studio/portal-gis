import { useThemeConfig } from "@/context/useThemeConfig";
import { Center, Circle, CircleProps } from "@chakra-ui/react";

interface Props extends CircleProps {
  color?: string;
}

const MapMarkerCircle = (props: Props) => {
  // Props
  const { color } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const finalColor = color ?? themeConfig.primaryColor;

  return (
    <Center
      bg={finalColor}
      borderRadius={"full"}
      border={"2px solid"}
      borderColor={finalColor}
    >
      <Circle
        bg={finalColor}
        w={"24px"}
        h={"24px"}
        border={"4px solid"}
        borderColor={"body"}
        {...props}
      />
    </Center>
  );
};

export default MapMarkerCircle;
