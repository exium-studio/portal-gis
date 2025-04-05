import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { Tooltip } from "@/components/ui/tooltip";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, Icon, StackProps, Text } from "@chakra-ui/react";
import { IconHome2, IconMapPin } from "@tabler/icons-react";

const CurrentFacility = ({ ...props }: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const data = [
    { label: "Lapangan" },
    { label: "Balai Desa" },
    { label: "Gor" },
    { label: "Masjid Al-Hidayah" },
  ];

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <Icon mb={"2px"}>
            <IconHome2 size={20} />
          </Icon>

          <ItemHeaderTitle>{l.current_facility}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} minH={ITEM_BODY_H}>
        <CContainer px={3} overflowY={"auto"} className="scrollY" mr={"-6px"}>
          {data.map((item, i) => {
            return (
              <HStack
                key={i}
                borderBottom={"1px solid {colors.gray.muted}"}
                px={2}
                py={2}
              >
                <Text fontWeight={"medium"}>{item.label}</Text>

                <Tooltip content={l.see_on_map}>
                  <BButton
                    iconButton
                    borderRadius={"full"}
                    ml={"auto"}
                    mr={-1}
                    variant={"ghost"}
                    colorPalette={themeConfig.colorPalette}
                  >
                    <IconMapPin stroke={1.5} />
                  </BButton>
                </Tooltip>
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default CurrentFacility;
