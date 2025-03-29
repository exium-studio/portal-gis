import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
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
import { Field } from "@/components/ui/field";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import ItemButton from "@/components/widget/ItemButton";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import formatDate from "@/utils/formatDate";
import interpolate from "@/utils/interpolate";
import { fileValidation } from "@/utils/validationSchemas";
import {
  FieldLabel,
  HStack,
  Icon,
  MenuPositioner,
  Portal,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconSpeakerphone,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import * as yup from "yup";

const AnnouncementCreate = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      title: "",
      description: "",
      published_at: undefined as any,
      expires_at: undefined as any,
      file: undefined as any,
    },
    validationSchema: yup.object().shape({
      title: yup.string().required(l.required_form),
      description: yup.string().required(l.required_form),
      published_at: yup
        .string()
        .required(l.required_form)
        .test(
          "is-less",
          interpolate(l.must_be_before, {
            a: l.published_date,
            b: l.end_date,
          }),
          function (value) {
            const { expires_at } = this.parent;
            return (
              !expires_at || !value || new Date(value) < new Date(expires_at)
            );
          }
        ),
      expires_at: yup
        .string()
        .required(l.required_form)
        .test(
          "is-greater",
          interpolate(l.must_be_after, {
            a: l.end_date,
            b: l.published_date,
          }),
          function (value) {
            const { published_at } = this.parent;
            return (
              !published_at ||
              !value ||
              new Date(value) > new Date(published_at)
            );
          }
        ),
      file: fileValidation({ allowedExtensions: ["pdf"] }),
    }),
    onSubmit: (values) => {
      console.log(values);

      const payload = new FormData();
      payload.append("title", values.title);
      payload.append("description", values.description);
      payload.append("file", values.file);
      payload.append("published_at", values.published_at);
      payload.append("expires_at", values.expires_at);

      console.log(payload);
    },
  });

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
              <Field
                invalid={!!formik.errors.title}
                errorText={formik.errors.title as string}
              >
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

              <Field
                mt={4}
                invalid={!!formik.errors.description}
                errorText={formik.errors.description as string}
              >
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

              <Field
                mt={4}
                invalid={!!formik.errors.published_at}
                errorText={formik.errors.published_at as string}
              >
                <FieldLabel>
                  {l.published_date}
                  <RequiredIndicator />
                </FieldLabel>
                <DateTimePicker
                  id="start_datetime"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("published_at", input);
                  }}
                  inputValue={formik.values.published_at}
                />
              </Field>

              <Field
                mt={4}
                invalid={!!formik.errors.expires_at}
                errorText={formik.errors.expires_at as string}
              >
                <FieldLabel>
                  {l.end_date}
                  <RequiredIndicator />
                </FieldLabel>
                <DateTimePicker
                  id="end_datetime"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("expires_at", input);
                  }}
                  inputValue={formik.values.expires_at}
                />
              </Field>

              <Field mt={4} errorText={formik.errors.file as string}>
                <FieldLabel>Attachment</FieldLabel>
                <FileInput maxFiles={3} />
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
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      title: item.title,
      description: item.description,
      published_at: item.start_date_time,
      expires_at: item.end_date_time,
      documents: undefined as any, // new
      deleted_document_ids: [],
    },
    validationSchema: yup.object().shape({
      title: yup.string().required(l.required_form),
      description: yup.string().required(l.required_form),
      published_at: yup
        .string()
        .required(l.required_form)
        .test(
          "is-less",
          interpolate(l.must_be_before, {
            a: l.published_date,
            b: l.end_date,
          }),
          function (value) {
            const { expires_at } = this.parent;
            return (
              !expires_at || !value || new Date(value) < new Date(expires_at)
            );
          }
        ),
      expires_at: yup
        .string()
        .required(l.required_form)
        .test(
          "is-greater",
          interpolate(l.must_be_after, {
            a: l.end_date,
            b: l.published_date,
          }),
          function (value) {
            const { published_at } = this.parent;
            return (
              !published_at ||
              !value ||
              new Date(value) > new Date(published_at)
            );
          }
        ),
      documents: fileValidation({ allowedExtensions: ["pdf"] }),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-announcement-${item.id}`, open, onOpen, onClose);

  console.log("jancok", formik.values);

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
              <Field
                invalid={!!formik.errors.title}
                errorText={formik.errors.title as string}
              >
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

              <Field
                mt={4}
                invalid={!!formik.errors.description}
                errorText={formik.errors.description as string}
              >
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

              <Field
                mt={4}
                invalid={!!formik.errors.published_at}
                errorText={formik.errors.published_at as string}
              >
                <FieldLabel>
                  {l.published_date}
                  <RequiredIndicator />
                </FieldLabel>
                <DateTimePicker
                  id="start_datetime"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("published_at", input);
                  }}
                  inputValue={formik.values.published_at}
                />
              </Field>

              <Field
                mt={4}
                invalid={!!formik.errors.expires_at}
                errorText={formik.errors.expires_at as string}
              >
                <FieldLabel>
                  {l.end_date}
                  <RequiredIndicator />
                </FieldLabel>
                <DateTimePicker
                  id="end_datetime"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("expires_at", input);
                  }}
                  inputValue={formik.values.expires_at}
                />
              </Field>

              <Field mt={4} errorText={formik.errors.documents as string}>
                <FieldLabel>Attachment</FieldLabel>
                <FileInput maxFiles={3} />
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
    <MenuRoot lazyMount closeOnSelect={false}>
      <MenuTrigger asChild>
        <BButton
          iconButton
          size={"xs"}
          borderRadius={"full"}
          variant={"ghost"}
          mr={-1}
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

const Announcement = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = [
    {
      id: 1,
      title: "Pemberitahuan Pemadaman Listrik",
      description:
        "Akan ada pemadaman listrik di wilayah desa pada 25 Maret 2025 mulai pukul 10:00 - 14:00 WIB.",
      file: [
        {
          id: 2,
          user_id: 19,
          document_status_id: 2,
          verified_by: null,
          uploaded_by: null,
          file_id: "d148f339-198d-446b-a861-3401b3c6d668",
          file_name: "document_2.pdf",
          file_path: "uploads/file/document_2.pdf",
          file_mime_type: "application/pdf",
          file_size: "478 KB",
          reason: null,
          created_at: "2025-03-22T10:21:41.000000Z",
          updated_at: "2025-03-22T10:21:41.000000Z",
          document_status: {
            id: 2,
            label: "Diverifikasi",
            deleted_at: null,
            created_at: "2025-03-22T10:21:31.000000Z",
            updated_at: "2025-03-22T10:21:31.000000Z",
          },
          uploaded_user: null,
          verified_user: null,
        },
        {
          id: 5,
          user_id: 27,
          document_status_id: 3,
          verified_by: null,
          uploaded_by: 28,
          file_id: "cd1fd839-bd55-4b33-bf9e-a175d30971ec",
          file_name: "document_5.pdf",
          file_path: "uploads/file/document_5.pdf",
          file_mime_type: "application/pdf",
          file_size: "150 KB",
          reason: "Approval required",
          created_at: "2025-03-22T10:21:41.000000Z",
          updated_at: "2025-03-22T10:21:41.000000Z",
          document_status: {
            id: 3,
            label: "Ditolak",
            deleted_at: null,
            created_at: "2025-03-22T10:21:31.000000Z",
            updated_at: "2025-03-22T10:21:31.000000Z",
          },
          uploaded_user: {
            id: 28,
            name: "Kepala RT 7",
            email: "kepalart7@example.com",
            email_verified_at: null,
            profile_photo: null,
            account_status: 2,
            facilities_filter: [
              {
                id: 2,
                name: "Lapangan",
                description:
                  "Area terbuka yang digunakan untuk olahraga, upacara, dan berbagai kegiatan masyarakat.",
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
              {
                id: 3,
                name: "Gor Desa",
                description:
                  "Gedung olahraga desa yang digunakan untuk berbagai aktivitas olahraga dan acara masyarakat.",
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
              {
                id: 5,
                name: "Tempat Ibadah",
                description:
                  "Sarana ibadah yang tersedia untuk berbagai agama sesuai dengan kebutuhan masyarakat.",
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
              {
                id: 8,
                name: "Pasar",
                description:
                  "Tempat transaksi jual beli berbagai kebutuhan masyarakat, baik pangan maupun sandang.",
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
            ],
            document_type_filter: [
              {
                id: 2,
                label: "Kartu Tanda Penduduk (KTP)",
                category: "dokumen_kependudukan",
                description:
                  "Identitas resmi yang wajib dimiliki oleh setiap warga negara Indonesia yang telah memenuhi syarat usia.",
                max_upload: 1024000,
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
              {
                id: 5,
                label: "Surat Keterangan Tempat Tinggal",
                category: "dokumen_kependudukan",
                description:
                  "Dokumen bagi penduduk sementara yang menyatakan tempat tinggalnya.",
                max_upload: 1024000,
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
              {
                id: 7,
                label: "Akta Kelahiran",
                category: "dokumen_sipil",
                description:
                  "Dokumen yang mencatat kelahiran seseorang secara resmi.",
                max_upload: 2048000,
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
              {
                id: 9,
                label: "Akta Perkawinan",
                category: "dokumen_sipil",
                description:
                  "Dokumen yang mencatat secara resmi pernikahan pasangan.",
                max_upload: 2048000,
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
              {
                id: 12,
                label: "Akta Pengesahan Anak",
                category: "dokumen_sipil",
                description:
                  "Dokumen yang mengesahkan status hukum seorang anak.",
                max_upload: 2048000,
                deleted_at: null,
                created_at: "2025-03-22T10:21:31.000000Z",
                updated_at: "2025-03-22T10:21:31.000000Z",
              },
            ],
            register_at: "1742638897GMT+0000C",
            deactivate_at: null,
            last_login: null,
            deleted_at: null,
            created_at: "2025-03-22T10:21:37.000000Z",
            updated_at: "2025-03-22T10:21:37.000000Z",
          },
          verified_user: null,
        },
      ],
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

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <IconSpeakerphone size={20} />
          <ItemHeaderTitle>{l.announcement}</ItemHeaderTitle>
        </HStack>

        <AnnouncementCreate />
      </ItemHeaderContainer>

      <CContainer pb={2} h={ITEM_BODY_H}>
        <CContainer px={3} overflowY={"scroll"} className="scrollY" mr={"-6px"}>
          {data.map((item, i) => {
            return (
              <CContainer
                key={i}
                pl={2}
                py={4}
                flex={1}
                borderBottom={
                  i !== data.length - 1 ? "1px solid {colors.border.muted}" : ""
                }
              >
                <HStack align={"start"}>
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
    </ItemContainer>
  );
};

export default Announcement;
