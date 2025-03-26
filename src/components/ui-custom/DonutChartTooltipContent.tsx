import { Text } from "@chakra-ui/react";
import CContainer from "./CContainer";
import formatNumber from "@/utils/formatNumber";

const DoughnutChartTooltipContent = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <CContainer
        bg={"darktrans"}
        backdropFilter={"blur(5px)"}
        p={3}
        borderRadius={6}
      >
        {payload.map((item: any, index: number) => {
          return (
            <Text
              key={index}
              color={"white"}
              // color={item.payload.fill}
            >
              {`${item.name}: ${formatNumber(item.value)} ${
                item.payload.percentage ? `(${item.payload.percentage})` : ""
              }`}
            </Text>
          );
        })}
      </CContainer>
    );
  }

  return null;
};

export default DoughnutChartTooltipContent;
