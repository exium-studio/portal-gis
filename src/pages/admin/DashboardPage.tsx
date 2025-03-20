import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import ItemButton from "@/components/widget/ItemButton";
import PageContainer from "@/components/widget/PageContainer";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import formatNumber from "@/utils/formatNumber";
import { HStack, Icon, SimpleGrid, Text } from "@chakra-ui/react";
import {
  IconFriends,
  IconPlus,
  IconSpeakerphone,
  IconTipJar,
} from "@tabler/icons-react";

const TotalCounter = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States, Refs
  const data = {
    total_population: 243,
    population_growth: 2.4,
    total_village_funds: 877088000,
  };

  console.log("Total", data);

  // Components
  const TotalContainer = ({ children, ...props }: any) => {
    return (
      <CContainer
        px={4}
        py={3}
        borderRadius={themeConfig.radii.container}
        bg={"body"}
        h={"full"}
        {...props}
      >
        {children}
      </CContainer>
    );
  };

  return (
    <SimpleGrid columns={[1, 2]} gap={4}>
      <TotalContainer>
        <HStack gap={3}>
          <Icon color={"green.500"}>
            <IconFriends size={30} />
          </Icon>
          <CContainer>
            <Text>{l.total_population}</Text>
            <HStack justify={"space-between"} align={"end"}>
              <Text fontWeight={"bold"} fontSize={"xl"}>
                {formatNumber(data.total_population)}
              </Text>
              <PopoverRoot>
                <PopoverTrigger>
                  <Text
                    color={data.population_growth > 0 ? "green.500" : "red.400"}
                    fontSize={"xs"}
                  >
                    {data.population_growth > 0 ? "+" : ""}
                    {data.population_growth}%
                  </Text>
                </PopoverTrigger>

                <PopoverContent>{l.population_grow}</PopoverContent>
              </PopoverRoot>
            </HStack>
          </CContainer>
        </HStack>
      </TotalContainer>

      <TotalContainer>
        <HStack gap={3}>
          <Icon color={"cyan.500"}>
            <IconTipJar size={30} />
          </Icon>
          <CContainer>
            <Text>{l.total_village_funds}</Text>
            <HStack justify={"space-between"} align={"end"}>
              <Text fontWeight={"bold"} fontSize={"xl"}>
                {formatNumber(data.total_village_funds)}
              </Text>
            </HStack>
          </CContainer>
        </HStack>
      </TotalContainer>
    </SimpleGrid>
  );
};

const Announcement = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States, Refs
  const data = [
    {
      title: "Pemberitahuan Pemadaman Listrik",
      description:
        "Akan ada pemadaman listrik di wilayah desa pada 25 Maret 2025 mulai pukul 10:00 - 14:00 WIB.",
    },
    {
      title: "Jadwal Posyandu Bulan Ini",
      description:
        "Posyandu balita akan diadakan pada 28 Maret 2025 di Balai Desa pukul 08:00 WIB.",
    },
    {
      title: "Pembagian Bantuan Langsung Tunai (BLT)",
      description:
        "Pembagian BLT Dana Desa akan dilakukan pada 30 Maret 2025. Warga yang berhak diharapkan membawa KTP dan KK.",
      file: "",
    },
    {
      title: "Kerja Bakti Bersama",
      description:
        "Kerja bakti membersihkan lingkungan desa akan diadakan pada 31 Maret 2025 pukul 07:00 WIB. Semua warga diharapkan ikut berpartisipasi.",
    },
    {
      title: "Rapat Musyawarah Desa",
      description:
        "Rapat musyawarah desa akan diadakan pada 1 April 2025 di Balai Desa untuk membahas rencana pembangunan desa tahun depan.",
    },
  ];

  // Components
  const AnnouncementItem = ({ data }: any) => {
    return (
      <>
        <CContainer px={"6px"}>
          <CContainer
            gap={1}
            p={3}
            transition={"200ms"}
            cursor={"pointer"}
            borderRadius={themeConfig.radii.component}
            _hover={{ bg: "gray.subtle" }}
          >
            <Text fontWeight={"medium"}>{data.title}</Text>
            <Text color={"fg.subtle"}>{data.description}</Text>
          </CContainer>
        </CContainer>
      </>
    );
  };

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <IconSpeakerphone size={20} stroke={1.5} />
          <ItemHeaderTitle>{l.announcement}</ItemHeaderTitle>
        </HStack>

        <ItemButton pl={2}>
          <IconPlus />
          {l.create}
        </ItemButton>
      </ItemHeaderContainer>

      <CContainer py={"6px"}>
        {data.map((item, i) => {
          return <AnnouncementItem key={i} data={item} />;
        })}
      </CContainer>
    </ItemContainer>
  );
};

const OfficialContact = () => {
  return <></>;
};

const IncomeExpenses = () => {
  return <></>;
};

const DashboardPage = () => {
  return (
    <PageContainer>
      <SimpleGrid columns={[1, null, null, 2]} gap={4}>
        <CContainer gap={4}>
          <TotalCounter />

          <Announcement />
        </CContainer>

        <CContainer>
          <OfficialContact />

          <IncomeExpenses />
        </CContainer>
      </SimpleGrid>
    </PageContainer>
  );
};

export default DashboardPage;
