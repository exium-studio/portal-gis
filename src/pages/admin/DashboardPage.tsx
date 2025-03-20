import BackButton from "@/components/ui-custom/BackButton";
import CContainer from "@/components/ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FileIcon from "@/components/ui-custom/FileIcon";
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
import useBackOnClose from "@/hooks/useBackOnClose";
import formatNumber from "@/utils/formatNumber";
import {
  Center,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconEdit,
  IconFriends,
  IconPlus,
  IconSpeakerphone,
  IconTipJar,
} from "@tabler/icons-react";
import { useState } from "react";

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
        border={"1px solid {colors.border.subtle}"}
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
      id: 1,
      title: "Pemberitahuan Pemadaman Listrik",
      description:
        "Akan ada pemadaman listrik di wilayah desa pada 25 Maret 2025 mulai pukul 10:00 - 14:00 WIB.",
    },
    {
      id: 2,
      title: "Jadwal Posyandu Bulan Ini",
      description:
        "Posyandu balita akan diadakan pada 28 Maret 2025 di Balai Desa pukul 08:00 WIB.",
    },
    {
      id: 3,
      title: "Pembagian Bantuan Langsung Tunai (BLT)",
      description:
        "Pembagian BLT Dana Desa akan dilakukan pada 30 Maret 2025. Warga yang berhak diharapkan membawa KTP dan KK.",
      file: [
        {
          name: "Surat edaran",
          size: 8911,
          ext: "pdf",
        },
      ],
    },
    {
      id: 4,
      title: "Kerja Bakti Bersama",
      description:
        "Kerja bakti membersihkan lingkungan desa akan diadakan pada 31 Maret 2025 pukul 07:00 WIB. Semua warga diharapkan ikut berpartisipasi.",
    },
    {
      id: 5,
      title: "Rapat Musyawarah Desa",
      description:
        "Rapat musyawarah desa akan diadakan pada 1 April 2025 di Balai Desa untuk membahas rencana pembangunan desa tahun depan.",
    },
  ];

  // Components
  const AnnouncementItem = ({ data }: any) => {
    // States, Refs
    const [hover, setHover] = useState(false);

    // Utils
    const { open, onOpen, onClose } = useDisclosure();
    useBackOnClose(data.id, open, onOpen, onClose);

    return (
      <>
        <CContainer px={2}>
          <CContainer
            onClick={onOpen}
            gap={1}
            p={3}
            transition={"200ms"}
            cursor={"pointer"}
            borderRadius={themeConfig.radii.component}
            _hover={{ bg: "gray.subtle" }}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
            position={"relative"}
          >
            <HStack transition={"0"} pr={hover ? 10 : 0}>
              <CContainer truncate>
                <Text fontWeight={"medium"} truncate>
                  {data.title}
                </Text>
                <Text color={"fg.subtle"} truncate>
                  {data.description}
                </Text>
              </CContainer>

              <Center
                opacity={hover ? 1 : 0}
                transition={"200ms"}
                position={"absolute"}
                right={2}
                p={2}
                aspectRatio={1}
                borderRadius={"full"}
              >
                <Icon mx={1} color={themeConfig.primaryColor}>
                  <IconEdit />
                </Icon>
              </Center>
            </HStack>
          </CContainer>
        </CContainer>

        <DisclosureRoot open={open} lazyLoad size={"sm"}>
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent title={data.title} />
            </DisclosureHeader>

            <DisclosureBody>
              <Text>{data.description}</Text>

              {data.file && (
                <HStack wrap={"wrap"} mt={4}>
                  {data.file.map((item: any, i: number) => {
                    return (
                      <CContainer
                        key={i}
                        w={"fit"}
                        aspectRatio={1}
                        p={4}
                        align={"center"}
                        borderRadius={themeConfig.radii.component}
                        border={"1px solid {colors.border.muted}"}
                      >
                        <FileIcon
                          type={item.ext}
                          iconProps={{ size: 50, stroke: 1 }}
                        />
                        <Text mt={2}>{item.name}</Text>
                      </CContainer>
                    );
                  })}
                </HStack>
              )}
            </DisclosureBody>

            <DisclosureFooter>
              <BackButton />
            </DisclosureFooter>
          </DisclosureContent>
        </DisclosureRoot>
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

      <CContainer pb={2}>
        <CContainer pt={2} h={"400px"} overflowY={"auto"} className="scrollY">
          {data.map((item, i) => {
            return <AnnouncementItem key={i} data={item} />;
          })}
        </CContainer>
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
