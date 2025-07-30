import { TextProps } from "@chakra-ui/react";
import P from "../ui-custom/P";

interface Props extends TextProps {}

const PropertyValue = (props: Props) => {
  // Props
  const { children: value, ...restProps } = props;

  // States
  const formattedValue = value;

  return <P {...restProps}>{`${formattedValue}`}</P>;
};

export default PropertyValue;
