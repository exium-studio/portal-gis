import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { HStack, Icon, StackProps, Text } from "@chakra-ui/react";
import { IconHome2 } from "@tabler/icons-react";

const CurrentFacilityDonutChart = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = [
    { label: "Lapangan", count: 1 },
    { label: "Balai Desa", count: 1 },
    { label: "Gor", count: 1 },
    { label: "Mic", count: 8 },
    { label: "Speaker", count: 2 },
  ];

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <Icon mb={"2px"}>
            <IconHome2 size={20} />
          </Icon>

          <ItemHeaderTitle>
            {l.facility} & {l.inventory.toLowerCase()}
          </ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} minH={ITEM_BODY_H}>
        <CContainer px={3} overflowY={"auto"} className="scrollY" mr={"-6px"}>
          {data.map((item, i) => {
            return (
              <HStack
                key={i}
                align={"start"}
                borderBottom={"1px solid {colors.gray.muted}"}
                px={2}
                py={3}
              >
                <Text fontWeight={"medium"}>{item.label}</Text>
                <Text ml={"auto"}>{item.count}</Text>
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default CurrentFacilityDonutChart;
