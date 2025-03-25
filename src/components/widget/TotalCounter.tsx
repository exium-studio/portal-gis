import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import { R_GAP } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import formatNumber from "@/utils/formatNumber";
import interpolate from "@/utils/interpolate";
import {
  HStack,
  Icon,
  PopoverPositioner,
  Portal,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { IconCoins, IconFriends, IconUserHeart } from "@tabler/icons-react";

const TotalCounter = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States, Refs
  const data = {
    total_population: 438,
    total_family: 243,
    population_growth: -2.4,
    family_growth: 4.2,
    total_village_fund: 877088000,
  };

  console.log("Total", data);

  return (
    <CContainer gap={R_GAP} {...props}>
      <ItemContainer p={4} flex={1} justify={"center"} position={"relative"}>
        <HStack gap={4} h={"full"}>
          <Icon color={themeConfig.primaryColor}>
            <IconFriends size={40} stroke={1.8} />
          </Icon>

          <CContainer gap={1}>
            <Text>{l.total_population}</Text>
            <HStack justify={"space-between"} align={"end"}>
              <Text fontWeight={"bold"} fontSize={"2xl"}>
                {formatNumber(data.total_population)}
              </Text>

              <PopoverRoot>
                <PopoverTrigger>
                  <Text
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    color={data.population_growth > 0 ? "green.500" : "red.400"}
                    fontSize={"xs"}
                  >
                    {data.population_growth > 0 ? "+" : ""}
                    {data.population_growth}%
                  </Text>
                </PopoverTrigger>

                <Portal>
                  <PopoverPositioner>
                    <PopoverContent mt={4}>
                      {data.population_growth > 0
                        ? interpolate(l.grow, {
                            value: `${data.population_growth}%`,
                          })
                        : interpolate(l.shrink, {
                            value: `${data.population_growth}%`,
                          })}
                    </PopoverContent>
                  </PopoverPositioner>
                </Portal>
              </PopoverRoot>
            </HStack>
          </CContainer>
        </HStack>
      </ItemContainer>

      <ItemContainer p={4} flex={1} justify={"center"} position={"relative"}>
        <HStack gap={4}>
          <Icon color={themeConfig.primaryColor}>
            <IconUserHeart size={40} stroke={1.8} />
          </Icon>

          <CContainer gap={1}>
            <Text>{l.total_family}</Text>
            <HStack justify={"space-between"} align={"end"}>
              <Text fontWeight={"bold"} fontSize={"2xl"}>
                {formatNumber(data.total_family)}
              </Text>

              <PopoverRoot>
                <PopoverTrigger>
                  <Text
                    position={"absolute"}
                    right={4}
                    bottom={4}
                    color={data.family_growth > 0 ? "green.500" : "red.400"}
                    fontSize={"xs"}
                  >
                    {data.family_growth > 0 ? "+" : ""}
                    {data.family_growth}%
                  </Text>
                </PopoverTrigger>

                <Portal>
                  <PopoverPositioner>
                    <PopoverContent mt={4}>
                      {data.family_growth > 0
                        ? interpolate(l.grow, {
                            value: `${data.family_growth}%`,
                          })
                        : interpolate(l.shrink, {
                            value: `${data.family_growth}%`,
                          })}
                    </PopoverContent>
                  </PopoverPositioner>
                </Portal>
              </PopoverRoot>
            </HStack>
          </CContainer>
        </HStack>
      </ItemContainer>

      <ItemContainer p={4} flex={1} justify={"center"}>
        <HStack gap={4}>
          <Icon color={themeConfig.primaryColor}>
            <IconCoins size={40} stroke={1.8} />
          </Icon>

          <CContainer gap={1}>
            <Text>{l.total_village_fund}</Text>
            <HStack justify={"space-between"} align={"end"}>
              <Text fontWeight={"bold"} fontSize={"2xl"}>
                {formatNumber(data.total_village_fund)}
              </Text>
            </HStack>
          </CContainer>
        </HStack>
      </ItemContainer>
    </CContainer>
  );
};

export default TotalCounter;
