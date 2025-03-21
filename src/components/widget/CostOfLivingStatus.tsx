import { Interface__Gens } from "@/constant/interfaces";
import { Circle, HStack, StackProps, Text, TextProps } from "@chakra-ui/react";

interface Props extends StackProps {
  data: Interface__Gens;
  textProps?: TextProps;
}
const CostOfLivingStatus = ({ data, textProps, ...props }: Props) => {
  const color = () => {
    switch (data.id) {
      case 1:
        return "#A3E635";
      case 2:
        return "#4ADE80";
      case 3:
        return "#FACC15";
      case 4:
        return "#FB923C";
      case 5:
        return "#EF4444";
    }
  };
  return (
    <HStack {...props}>
      <Circle w={"8px"} h={"8px"} bg={color()} />
      <Text {...textProps}>{data.label}</Text>
    </HStack>
  );
};

export default CostOfLivingStatus;
