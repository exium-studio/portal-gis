import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
import CartesianGrid from "@/components/ui-custom/CartesianGrid";
import CContainer from "@/components/ui-custom/CContainer";
import ConfirmationDisclosure from "@/components/ui-custom/ConfirmationDisclosure";
import DateTimePicker from "@/components/ui-custom/DateTimePicker";
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
import { Avatar } from "@/components/ui/avatar";
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
import { Tooltip } from "@/components/ui/tooltip";
import CostOfLivingStatus from "@/components/widget/CostOfLivingStatus";
import ItemButton from "@/components/widget/ItemButton";
import PageContainer from "@/components/widget/PageContainer";
import PopulationDensityStatus from "@/components/widget/PopulationDensityStatus";
import { MONTHS } from "@/constants/months";
import { IMAGES_PATH } from "@/constants/paths";
import {
  PRESET_LINE_CHART,
  PRESET_LINE_CHART_TOOLTIP,
} from "@/constants/presetProps";
import { R_GAP } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import formatCount from "@/utils/formatCount";
import formatDate from "@/utils/formatDate";
import formatNumber from "@/utils/formatNumber";
import interpolate from "@/utils/interpolate";
import makeCall from "@/utils/makeCall";
import makeWA from "@/utils/makeWA";
import { fileValidation } from "@/utils/validationSchemas";
import {
  Circle,
  FieldErrorText,
  FieldLabel,
  HStack,
  Icon,
  Image,
  MenuPositioner,
  PopoverPositioner,
  Portal,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconAddressBook,
  IconBrandGoogleMaps,
  IconBrandWhatsapp,
  IconCoins,
  IconCurrencyDollar,
  IconDotsVertical,
  IconEdit,
  IconFriends,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconSparkles,
  IconSpeakerphone,
  IconTrash,
  IconUserHeart,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import {
  Tooltip as ChartTooltip,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import * as yup from "yup";

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
    total_village_funds: 877088000,
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
            <Text>{l.total_village_funds}</Text>
            <HStack justify={"space-between"} align={"end"}>
              <Text fontWeight={"bold"} fontSize={"2xl"}>
                {formatNumber(data.total_village_funds)}
              </Text>
            </HStack>
          </CContainer>
        </HStack>
      </ItemContainer>
    </CContainer>
  );
};

const Announcement = ({ ...props }: StackProps) => {
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
    {
      id: 6,
      title: "Rapat Pleno",
      description:
        "Rapat pleno akan diadakan pada 2 April 2025 di Balai Desa untuk membahas rencana pembangunan desa tahun depan.",
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
        startDateTime: undefined as any,
        endDateTime: undefined as any,
      },
      validationSchema: yup.object().shape({
        title: yup.string().required(l.required_form),
        description: yup.string().required(l.required_form),
        file: fileValidation({ allowedExtensions: ["pdf"] }),
        startDateTime: yup
          .string()
          .required(l.required_form)
          .test(
            "is-less",
            interpolate(l.must_be_before, {
              a: l.published_date,
              b: l.end_date,
            }),
            function (value) {
              const { endDateTime } = this.parent;
              return (
                !endDateTime ||
                !value ||
                new Date(value) < new Date(endDateTime)
              );
            }
          ),
        endDateTime: yup
          .string()
          .required(l.required_form)
          .test(
            "is-greater",
            interpolate(l.must_be_after, {
              a: l.end_date,
              b: l.published_date,
            }),
            function (value) {
              const { startDateTime } = this.parent;
              return (
                !startDateTime ||
                !value ||
                new Date(value) > new Date(startDateTime)
              );
            }
          ),
      }),
      onSubmit: (values) => {
        console.log(values);

        const payload = new FormData();
        payload.append("title", values.title);
        payload.append("description", values.description);
        payload.append("file", values.file);
        payload.append("startDateTime", values.startDateTime);
        payload.append("endDateTime", values.endDateTime);

        console.log(payload);
      },
    });

    // console.log(formik.values);

    // Utils
    const { open, onOpen, onClose } = useDisclosure();
    useBackOnClose(`create-announcement`, open, onOpen, onClose);

    return (
      <>
        <ItemButton iconButton onClick={onOpen} borderRadius={"full"}>
          <IconPlus />
        </ItemButton>

        <DisclosureRoot open={open} lazyLoad size={"xs"}>
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent
                title={`${l.create} ${l.announcement.toLowerCase()}`}
              />
            </DisclosureHeader>

            <DisclosureBody>
              <form id="announcement_create" onSubmit={formik.handleSubmit}>
                <Field invalid={!!formik.errors.title}>
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
                  <FieldErrorText>
                    {formik.errors.title as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4} invalid={!!formik.errors.description}>
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
                  <FieldErrorText>
                    {formik.errors.description as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4}>
                  <FieldLabel>Attachment</FieldLabel>
                  <FileInput maxFiles={3} />
                  <FieldErrorText>
                    {formik.errors.file as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4} invalid={!!formik.errors.startDateTime}>
                  <FieldLabel>
                    {l.published_date}
                    <RequiredIndicator />
                  </FieldLabel>
                  <DateTimePicker
                    id="start_datetime"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("startDateTime", input);
                    }}
                    inputValue={formik.values.startDateTime}
                  />
                  <FieldErrorText>
                    {formik.errors.startDateTime as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4} invalid={!!formik.errors.endDateTime}>
                  <FieldLabel>
                    {l.end_date}
                    <RequiredIndicator />
                  </FieldLabel>
                  <DateTimePicker
                    id="end_datetime"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("endDateTime", input);
                    }}
                    inputValue={formik.values.endDateTime}
                  />
                  <FieldErrorText>
                    {formik.errors.endDateTime as string}
                  </FieldErrorText>
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
        startDateTime: item.start_date_time,
        endDateTime: item.end_date_time,
      },
      validationSchema: yup.object().shape({
        title: yup.string().required(l.required_form),
        description: yup.string().required(l.required_form),
        file: fileValidation({ allowedExtensions: ["pdf"] }),
        startDateTime: yup
          .string()
          .required(l.required_form)
          .test(
            "is-less",
            interpolate(l.must_be_before, {
              a: l.published_date,
              b: l.end_date,
            }),
            function (value) {
              const { endDateTime } = this.parent;
              return (
                !endDateTime ||
                !value ||
                new Date(value) < new Date(endDateTime)
              );
            }
          ),
        endDateTime: yup
          .string()
          .required(l.required_form)
          .test(
            "is-greater",
            interpolate(l.must_be_after, {
              a: l.end_date,
              b: l.published_date,
            }),
            function (value) {
              const { startDateTime } = this.parent;
              return (
                !startDateTime ||
                !value ||
                new Date(value) > new Date(startDateTime)
              );
            }
          ),
      }),
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
          <Icon ml={"auto"}>
            <IconEdit stroke={1.5} size={16} />
          </Icon>
        </MenuItem>

        <DisclosureRoot open={open} lazyLoad size={"xs"}>
          <DisclosureContent>
            <DisclosureHeader>
              <DisclosureHeaderContent title={"Edit"} />
            </DisclosureHeader>

            <DisclosureBody>
              <form id="announcement_edit" onSubmit={formik.handleSubmit}>
                <Field invalid={!!formik.errors.title}>
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
                  <FieldErrorText>
                    {formik.errors.title as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4} invalid={!!formik.errors.description}>
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
                  <FieldErrorText>
                    {formik.errors.description as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4}>
                  <FieldLabel>Attachment</FieldLabel>
                  <FileInput maxFiles={3} />
                  <FieldErrorText>
                    {formik.errors.file as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4} invalid={!!formik.errors.startDateTime}>
                  <FieldLabel>
                    {l.published_date}
                    <RequiredIndicator />
                  </FieldLabel>
                  <DateTimePicker
                    id="start_datetime"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("startDateTime", input);
                    }}
                    inputValue={formik.values.startDateTime}
                  />
                  <FieldErrorText>
                    {formik.errors.startDateTime as string}
                  </FieldErrorText>
                </Field>

                <Field mt={4} invalid={!!formik.errors.endDateTime}>
                  <FieldLabel>
                    {l.end_date}
                    <RequiredIndicator />
                  </FieldLabel>
                  <DateTimePicker
                    id="end_datetime"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("endDateTime", input);
                    }}
                    inputValue={formik.values.endDateTime}
                  />
                  <FieldErrorText>
                    {formik.errors.endDateTime as string}
                  </FieldErrorText>
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
                title={`${l.delete_label}?`}
                description={l.perma_delete_confirmation}
                confirmCallback={() => {}}
                confirmLabel={l.delete_label}
                confirmButtonProps={{
                  colorPalette: "red",
                }}
              >
                <MenuItem value="delete" color={"red.400"}>
                  {l.delete_label}...
                  <Icon ml={"auto"}>
                    <IconTrash stroke={1.5} size={16} />
                  </Icon>
                </MenuItem>
              </ConfirmationDisclosure>
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    );
  };

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <IconSpeakerphone size={20} />
          <ItemHeaderTitle>{l.announcement}</ItemHeaderTitle>
        </HStack>

        <AnnouncementCreate />
      </ItemHeaderContainer>

      <CContainer pb={2} h={"500px"}>
        <CContainer overflowY={"scroll"} mr={"-6px"} className="scrollY">
          <CContainer px={3}>
            {data.map((item, i) => {
              return (
                <CContainer
                  pl={2}
                  py={4}
                  flex={1}
                  borderBottom={
                    i !== data.length - 1
                      ? "1px solid {colors.border.muted}"
                      : ""
                  }
                >
                  <HStack>
                    <CContainer gap={1}>
                      <Text fontWeight={"semibold"}>{item.title}</Text>

                      <Text>{item.description}</Text>

                      <HelperText>
                        {l.last_updated} {formatDate(item.updated_at)}
                      </HelperText>
                    </CContainer>

                    <AnnouncementOptions item={item} />
                  </HStack>
                </CContainer>
              );
            })}
          </CContainer>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

const VisionMission = ({ ...props }: StackProps) => {
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
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <IconSparkles size={20} />
          <ItemHeaderTitle>
            {l.vision} {l.and} {l.mission.toLowerCase()}
          </ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} h={"500px"}>
        <CContainer
          pt={4}
          pb={2}
          overflowY={"scroll"}
          mr={"-6px"}
          className="scrollY"
          px={3}
        >
          <CContainer px={2}>
            <Text color={"fg.muted"} mb={1}>
              {l.vision}
            </Text>
            <Text fontWeight={"medium"}>{data.vision}</Text>

            <Text color={"fg.muted"} mt={4} mb={1}>
              {l.mission}
            </Text>
          </CContainer>

          <CContainer as={"ol"} gap={4}>
            {data.mission.map((item, i) => {
              return (
                <HStack
                  key={i}
                  px={2}
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

const OfficialContact = ({ ...props }: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const data = [
    {
      id: 1,
      cp: {
        name: "Sendi Chicks",
        job_title: {
          name: "Lurah",
        },
      },
      title: "Urusan Kelurahan",
      description:
        "Bertanggung jawab atas administrasi dan pelayanan di tingkat kelurahan.",
      avatar: "https://bit.ly/sage-adebayo",
      wa: "+62 895-6221-89054",
      phone: "+62 895-6221-89054",
      address: "Jl. Merdeka No. 1, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/rudi.tabuti",
        x: "https://twitter.com/rudi_tabuti",
        ig: "https://instagram.com/rudi.tabuti",
      },
    },
    {
      id: 2,
      cp: {
        name: "Siti Marni",
        job_title: {
          name: "Sekretaris Desa",
        },
      },
      title: "Administrasi Desa",
      description: "Mengelola dokumen dan surat-menyurat desa.",
      avatar: "https://bit.ly/dummy-avatar",
      wa: "0819327483920",
      phone: "0819327483920",
      address: "Jl. Pahlawan No. 5, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/siti.marni",
        x: "https://twitter.com/siti_marni",
        ig: "https://instagram.com/siti.marni",
      },
    },
    {
      id: 3,
      cp: {
        name: "Budi Santoso",
        job_title: {
          name: "Kasi Pelayanan",
        },
      },
      title: "Pelayanan Masyarakat",
      description:
        "Membantu masyarakat dalam pengurusan surat-surat dan pelayanan lainnya.",
      avatar: "https://bit.ly/dummy-avatar",
      wa: "0819876543210",
      phone: "0819876543210",
      address: "Jl. Kemakmuran No. 10, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/budi.santoso",
        x: "https://twitter.com/budi_santoso",
        ig: "https://instagram.com/budi.santoso",
      },
    },
    {
      id: 4,
      cp: {
        name: "Yoyok Sip",
        job_title: {
          name: "Kasi Pelayanan",
        },
      },
      title: "Pelayanan Masyarakat",
      description:
        "Membantu masyarakat dalam pengurusan surat-surat dan pelayanan lainnya.",
      avatar: "https://bit.ly/dummy-avatar",
      wa: "0819876543210",
      phone: "0819876543210",
      address: "Jl. Kemakmuran No. 10, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/budi.santoso",
        x: "https://twitter.com/budi_santoso",
        ig: "https://instagram.com/budi.santoso",
      },
    },
  ];

  console.log("Official contat", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <IconAddressBook />
          <ItemHeaderTitle>{l.official_contact}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} h={"500px"}>
        <CContainer overflowY={"auto"} className="scrollY">
          <CContainer px={3}>
            {data.map((item, i) => {
              return (
                <CContainer
                  key={i}
                  px={2}
                  py={4}
                  flex={1}
                  borderBottom={
                    i !== data.length - 1
                      ? "1px solid {colors.border.muted}"
                      : ""
                  }
                >
                  <Text fontSize={"md"} fontWeight={"bold"} mb={2}>
                    {item.title}
                  </Text>

                  <Text mb={2}>{item.description}</Text>

                  <HStack mb={4} align={"start"}>
                    <Icon color="fg.muted">
                      <IconMapPin stroke={1.5} size={18} />
                    </Icon>
                    <Text color="fg.muted">{item.address}</Text>
                  </HStack>

                  <HStack gap={4}>
                    <Avatar src={item.avatar} />
                    <CContainer>
                      <HelperText>{item.cp.job_title.name}</HelperText>
                      <Text fontWeight={"bold"}>{item.cp.name}</Text>
                    </CContainer>

                    <HStack>
                      <BButton
                        iconButton
                        borderRadius={"full"}
                        variant={"subtle"}
                        colorPalette={themeConfig.colorPalette}
                        onClick={() => {
                          makeCall(item.phone);
                        }}
                      >
                        <IconPhone />
                      </BButton>
                      <BButton
                        iconButton
                        borderRadius={"full"}
                        variant={"subtle"}
                        colorPalette={themeConfig.colorPalette}
                        onClick={() => {
                          makeWA(item.wa);
                        }}
                      >
                        <IconBrandWhatsapp />
                      </BButton>
                    </HStack>
                  </HStack>
                </CContainer>
              );
            })}
          </CContainer>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

const IncomeExpenses = ({ ...props }: StackProps) => {
  // Contexts
  const { l, lang } = useLang();

  // States, Refs
  const data = [
    {
      expense: 10751173,
      income: 13453102,
    },
    {
      expense: 11334632,
      income: 14941915,
    },
    {
      expense: 9330103,
      income: 13471852,
    },
    {
      expense: 13340012,
      income: 16773920,
    },
    {
      expense: 12199410,
      income: 17338526,
    },
    {
      expense: 12110341,
      income: 18019161,
    },
    {
      expense: 16800661,
      income: 19679081,
    },
    {
      expense: 14323459,
      income: 19680479,
    },
    {
      expense: 16634639,
      income: 21179891,
    },
    {
      expense: 17582756,
      income: 21632541,
    },
    {
      expense: 18154105,
      income: 20006748,
    },
    {
      expense: 21361102,
      income: 22008639,
    },
  ];
  const finalData = data.map((item: any, i: number) => ({
    ...item,
    month: MONTHS[lang][i].slice(0, 3),
  }));
  const legend = [
    {
      label: l.income,
      total: 321000000,
      color: "#22c55e",
    },
    {
      label: l.expense,
      total: 211000000,
      color: "#ef4444",
    },
  ];

  console.log("Income Expenses", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer borderless>
        <HStack>
          <IconCurrencyDollar size={20} />

          <ItemHeaderTitle>
            {l.income} & {l.expense.toLowerCase()}
          </ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pr={4} pb={4} ml={-2}>
        <ResponsiveContainer width={"100%"} height={400}>
          <ComposedChart data={finalData}>
            <CartesianGrid />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCount} />
            <ChartTooltip {...PRESET_LINE_CHART_TOOLTIP} />
            <Line
              dataKey="income"
              stroke={"#22c55e"}
              name="2024"
              {...PRESET_LINE_CHART}
            />
            <Line
              dataKey="expense"
              stroke={"#ef4444"}
              name="2025"
              {...PRESET_LINE_CHART}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <HStack wrap={"wrap"} justify={"center"} gapX={5} mb={5} pl={4} mt={4}>
          {legend.map((item, i) => (
            <HStack key={i}>
              <Circle w={"8px"} h={"8px"} bg={item.color} />
              <Text>
                {item.label} (Total : Rp {formatNumber(item.total)})
              </Text>
            </HStack>
          ))}
        </HStack>
      </CContainer>
    </ItemContainer>
  );
};

const PopulationGrowth = ({ ...props }: StackProps) => {
  return <ItemContainer {...props}></ItemContainer>;
};

const Facilities = ({ ...props }: StackProps) => {
  return <CContainer {...props}></CContainer>;
};

const TotalPopulationByFilter = ({ ...props }: StackProps) => {
  return <CContainer {...props}></CContainer>;
};

const DashboardPage = () => {
  return (
    <PageContainer gap={R_GAP} pb={4}>
      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <VillageSummary flex={"1 1 650px"} />

        <TotalCounter flex={"1 1 300px"} />
      </HStack>

      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <Announcement flex={"1 1 300px"} minW={0} />

        <VisionMission flex={"1 1 300px"} minW={0} />

        <OfficialContact flex={"1 1 300px"} minW={0} />
      </HStack>

      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <IncomeExpenses flex={"1 1 650px"} />

        <Facilities flex={"1 1 300px"} />
      </HStack>

      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <PopulationGrowth flex={"1 1 300px"} />

        <TotalPopulationByFilter flex={"1 1 300px"} />
      </HStack>
    </PageContainer>
  );
};

export default DashboardPage;
