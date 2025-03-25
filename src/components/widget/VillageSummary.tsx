import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import { Tooltip } from "@/components/ui/tooltip";
import CostOfLivingStatus from "@/components/widget/CostOfLivingStatus";
import PopulationDensityStatus from "@/components/widget/PopulationDensityStatus";
import { IMAGES_PATH } from "@/constants/paths";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, Icon, Image, StackProps, Text } from "@chakra-ui/react";
import { IconBrandGoogleMaps } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const VillageSummary = ({ ...props }: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const data = {
    image_file: {
      path: `${IMAGES_PATH}/tembalang.jpg`,
    },
    name: "Temcy, Tembalang City Babyyy",
    summary:
      "Kelurahan Tembalang adalah kawasan pendidikan di Semarang, dikenal dengan Universitas Diponegoro (UNDIP) serta berkembang dengan banyaknya kos, kuliner, dan pusat bisnis.",
    gmaps_link:
      "https://www.google.com/maps/place/Tembalang,+Semarang+City,+Central+Java/@-7.0457892,110.4234427,13z/data=!3m1!4b1!4m6!3m5!1s0x2e708c2fca675267:0x6cf025f6beb40590!8m2!3d-7.024944!4d110.459866!16s%2Fg%2F11b_2kvl3w?entry=ttu&g_ep=EgoyMDI1MDMxOC4wIKXMDSoJLDEwMjExNDU1SAFQAw%3D%3D",
    population_density: {
      id: 4,
      label: "Padat",
    },
    cost_of_living: {
      id: 3,
      label: "Menengah",
    },
  };

  console.log("Village summary", data);

  return (
    <ItemContainer {...props}>
      <HStack wrap={"wrap"} align={"stretch"} flex={1}>
        <CContainer flex={"1 1 300px"} position={"relative"}>
          <Image src={data.image_file.path} objectFit={"cover"} h={"full"} />
          <Tooltip content={"Google maps"}>
            <Link to={data.gmaps_link} target="_blank">
              <BButton
                iconButton
                position={"absolute"}
                right={4}
                bottom={4}
                borderRadius={"full"}
                colorPalette={themeConfig.colorPalette}
                size={"sm"}
              >
                <Icon w={"20px"} h={"20px"} viewBox="0 0 24 24">
                  <IconBrandGoogleMaps />
                </Icon>
              </BButton>
            </Link>
          </Tooltip>
        </CContainer>

        <CContainer flex={"1 0 300px"} gap={4} my={2} p={4} justify={"center"}>
          <Text fontSize={"2xl"} fontWeight={"bold"} lineHeight={1.4}>
            {data.name}
          </Text>
          <Text>{data.summary}</Text>

          <HStack>
            <CContainer>
              <Text color={"fg.muted"}>{l.population_density}</Text>
              <PopulationDensityStatus
                data={data.population_density}
                textProps={{ fontWeight: "semibold" }}
              />
            </CContainer>

            <CContainer>
              <Text color={"fg.muted"}>{l.cost_of_living}</Text>
              <CostOfLivingStatus
                data={data.cost_of_living}
                textProps={{ fontWeight: "semibold" }}
              />
            </CContainer>
          </HStack>
        </CContainer>
      </HStack>
    </ItemContainer>
  );
};

export default VillageSummary;
