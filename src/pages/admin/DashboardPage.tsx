import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ConfirmationDisclosure from "@/components/ui-custom/ConfirmationDisclosure";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FileInput from "@/components/ui-custom/FileInput";
import HelperText from "@/components/ui-custom/HelperText";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import RequiredIndicator from "@/components/ui-custom/RequiredIndicator";
import StringInput from "@/components/ui-custom/StringInput";
import Textarea from "@/components/ui-custom/Textarea";
import { Field } from "@/components/ui/field";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import ItemButton from "@/components/widget/ItemButton";
import PageContainer from "@/components/widget/PageContainer";
import { SVGS_PATH } from "@/constant/path";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import {
  FieldLabel,
  GridItem,
  HStack,
  Image,
  MenuPositioner,
  Portal,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconDotsVertical,
  IconPlus,
  IconSparkles,
  IconSpeakerphone,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import * as yup from "yup";

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
    <SimpleGrid columns={[1, 2]} gap={"10px"}>
      <TotalContainer>
        <HStack gap={4}>
          <Image src={`${SVGS_PATH}/people.svg`} h={"30px"} />
          <CContainer gap={1}>
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
        <HStack gap={4}>
          <Image src={`${SVGS_PATH}/funds.svg`} h={"30px"} />

          <CContainer gap={1}>
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
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Jadwal Posyandu Bulan Ini",
      description:
        "Posyandu balita akan diadakan pada 28 Maret 2025 di Balai Desa pukul 08:00 WIB.",
      updated_at: new Date().toISOString(),
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
      updated_at: new Date().toISOString(),
    },
    {
      id: 4,
      title: "Kerja Bakti Bersama",
      description:
        "Kerja bakti membersihkan lingkungan desa akan diadakan pada 31 Maret 2025 pukul 07:00 WIB. Semua warga diharapkan ikut berpartisipasi.",
      updated_at: new Date().toISOString(),
    },
    {
      id: 5,
      title: "Rapat Musyawarah Desa",
      description:
        "Rapat musyawarah desa akan diadakan pada 1 April 2025 di Balai Desa untuk membahas rencana pembangunan desa tahun depan.",
      updated_at: new Date().toISOString(),
    },
  ];

  console.log("Pengumuman", data);

  // Components
  const AnnouncementCreate = () => {
    // States, Refs
    const formik = useFormik({
      validateOnChange: false,
      initialValues: {
        title: "",
        description: "",
        file: undefined as any,
      },
      validationSchema: yup.object().shape({}),
      onSubmit: (values) => {
        console.log(values);
      },
    });

    // Utils
    const { open, onOpen, onClose } = useDisclosure();
    useBackOnClose(`create-announcement`, open, onOpen, onClose);

    return (
      <>
        <ItemButton pl={2} onClick={onOpen}>
          <IconPlus />
          {l.create}
        </ItemButton>

        <DisclosureRoot open={open} lazyLoad size={"sm"}>
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent
                title={`${l.create} ${l.announcement.toLowerCase()}`}
              />
            </DisclosureHeader>

            <DisclosureBody>
              <form id="announcement_create" onSubmit={formik.handleSubmit}>
                <Field required>
                  <FieldLabel>
                    {l.title}
                    <RequiredIndicator />
                  </FieldLabel>
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("title", input);
                    }}
                    inputValue={formik.values.title}
                  />
                </Field>

                <Field mt={4}>
                  <FieldLabel>
                    {l.description}
                    <RequiredIndicator />
                  </FieldLabel>
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("description", input);
                    }}
                    inputValue={formik.values.description}
                  />
                </Field>

                <Field mt={4}>
                  <FieldLabel>Attachment</FieldLabel>
                  <FileInput maxFiles={4} />
                </Field>
              </form>
            </DisclosureBody>

            <DisclosureFooter>
              <BackButton />
              <BButton
                colorPalette={themeConfig.colorPalette}
                type="submit"
                form="announcement_create"
              >
                {l.create}
              </BButton>
            </DisclosureFooter>
          </DisclosureContent>
        </DisclosureRoot>
      </>
    );
  };
  const AnnouncementEdit = ({ item }: any) => {
    // States, Refs
    const formik = useFormik({
      validateOnChange: false,
      initialValues: {
        title: item.title,
        description: item.description,
        file: item.file,
      },
      validationSchema: yup.object().shape({}),
      onSubmit: (values) => {
        console.log(values);
      },
    });

    // Utils
    const { open, onOpen, onClose } = useDisclosure();
    useBackOnClose(`edit-announcement-${item.id}`, open, onOpen, onClose);

    return (
      <>
        <MenuItem value="edit" onClick={onOpen}>
          Edit
        </MenuItem>

        <DisclosureRoot open={open} lazyLoad size={"sm"}>
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent title={"Edit"} />
            </DisclosureHeader>

            <DisclosureBody>
              <form id="announcement_edit" onSubmit={formik.handleSubmit}>
                <Field>
                  <FieldLabel>
                    {l.title}
                    <RequiredIndicator />
                  </FieldLabel>
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("title", input);
                    }}
                    inputValue={formik.values.title}
                  />
                </Field>

                <Field mt={4}>
                  <FieldLabel>
                    {l.description}
                    <RequiredIndicator />
                  </FieldLabel>
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("description", input);
                    }}
                    inputValue={formik.values.description}
                  />
                </Field>

                <Field mt={4}>
                  <FieldLabel>Attachment</FieldLabel>
                  <FileInput maxFiles={4} />
                </Field>
              </form>
            </DisclosureBody>

            <DisclosureFooter>
              <BackButton />
              <BButton
                colorPalette={themeConfig.colorPalette}
                type="submit"
                form="announcement_edit"
              >
                Update
              </BButton>
            </DisclosureFooter>
          </DisclosureContent>
        </DisclosureRoot>
      </>
    );
  };
  const AnnouncementOptions = ({ item }: any) => {
    const { l } = useLang();

    return (
      <MenuRoot>
        <MenuTrigger asChild>
          <BButton
            iconButton
            size={"xs"}
            borderRadius={"full"}
            variant={"ghost"}
          >
            <IconDotsVertical />
          </BButton>
        </MenuTrigger>

        <Portal>
          <MenuPositioner>
            <MenuContent>
              <AnnouncementEdit item={item} />
              <ConfirmationDisclosure
                id={`delete-announcement-${item.id}`}
                title="Delete?"
                description={l.perma_delete_confirmation}
                confirmCallback={() => {}}
                confirmLabel="Delete"
                confirmButtonProps={{
                  colorPalette: "red",
                }}
              >
                <MenuItem value="delete" color={"red.400"}>
                  Delete...
                </MenuItem>
              </ConfirmationDisclosure>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    );
  };
  const AnnouncementItem = ({ item }: any) => {
    return (
      <>
        <CContainer px={2}>
          <CContainer
            gap={1}
            p={3}
            pr={0}
            borderRadius={themeConfig.radii.component}
          >
            <HStack>
              <CContainer truncate gap={1}>
                <Text fontWeight={"medium"} truncate>
                  {item.title}
                </Text>
                <Text color={"fg.muted"} truncate>
                  {item.description}
                </Text>
                <HelperText>{formatDate(item.updated_at)}</HelperText>
              </CContainer>

              <AnnouncementOptions item={item} />
            </HStack>
          </CContainer>
        </CContainer>
      </>
    );
  };

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <IconSpeakerphone size={20} />
          <ItemHeaderTitle>{l.announcement}</ItemHeaderTitle>
        </HStack>

        <AnnouncementCreate />
      </ItemHeaderContainer>

      <CContainer pb={2} h={"450px"}>
        <CContainer pt={2} overflowY={"auto"} className="scrollY">
          {data.map((item, i) => {
            return <AnnouncementItem key={i} item={item} />;
          })}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

const VisionMission = () => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = {
    name: "Desa Makmur Jaya",
    vision:
      "Mewujudkan Desa Makmur Jaya yang Mandiri, Sejahtera, dan Berbudaya Berbasis Kearifan Lokal.",
    mission: [
      "Meningkatkan kesejahteraan masyarakat melalui pengembangan ekonomi berbasis pertanian, peternakan, dan UMKM.",
      "Meningkatkan kualitas sumber daya manusia melalui pendidikan, pelatihan, dan pemberdayaan masyarakat.",
      "Meningkatkan infrastruktur desa guna menunjang aktivitas ekonomi dan kesejahteraan masyarakat.",
      "Mewujudkan tata kelola pemerintahan desa yang transparan, akuntabel, dan partisipatif.",
      "Melestarikan budaya dan kearifan lokal sebagai identitas desa yang berdaya saing.",
      "Mengembangkan potensi pariwisata desa berbasis alam dan budaya untuk meningkatkan pendapatan desa.",
      "Meningkatkan kualitas layanan kesehatan dan kebersihan lingkungan untuk masyarakat yang lebih sehat.",
    ],
  };

  console.log("Visi Misi", data);

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <IconSparkles size={20} />
          <ItemHeaderTitle>
            {l.vision} {l.and} {l.mission.toLowerCase()}
          </ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} h={"450px"}>
        <CContainer pt={2} pb={2} overflowY={"auto"} className="scrollY" px={4}>
          <Text color={"fg.muted"} mb={1}>
            {l.vision}
          </Text>
          <Text fontWeight={"medium"}>{data.vision}</Text>

          <Text color={"fg.muted"} mt={4} mb={1}>
            {l.mission}
          </Text>
          <CContainer as={"ol"} gap={4}>
            {data.mission.map((item, i) => {
              return (
                <HStack
                  key={i}
                  fontWeight={"medium"}
                  align={"start"}
                  borderBottom={
                    i !== data.mission.length - 1
                      ? "1px solid {colors.border.muted}"
                      : ""
                  }
                  pb={i !== data.mission.length - 1 ? 4 : 0}
                >
                  <Text>{i + 1}</Text>
                  <Text>{item}</Text>
                </HStack>
              );
            })}
          </CContainer>
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
      <SimpleGrid columns={[1, null, 3]} gap={"10px"}>
        <GridItem colSpan={[3, null, 2]}>
          <CContainer gap={"10px"}>
            <TotalCounter />

            <SimpleGrid columns={[1, 2]} gap={"10px"}>
              <Announcement />

              <VisionMission />
            </SimpleGrid>
          </CContainer>
        </GridItem>

        <GridItem colSpan={[3, null, 1]}>
          <CContainer>
            <OfficialContact />

            <IncomeExpenses />
          </CContainer>
        </GridItem>
      </SimpleGrid>
    </PageContainer>
  );
};

export default DashboardPage;
