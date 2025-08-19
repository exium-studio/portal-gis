import { Span, Text, TextProps } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface Props extends TextProps {}

const ExiumWatermark = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // States
  const currentYear = new Date().getFullYear();

  return (
    <Text textAlign={"center"} fontSize={"sm"} {...restProps}>
      © {currentYear} powered by{" "}
      <Span fontWeight={"bold"}>
        <Link to={"https://exium.id"} target="_blank">
          Exium.id
        </Link>
      </Span>
    </Text>
  );
};

export default ExiumWatermark;
