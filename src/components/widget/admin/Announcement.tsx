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
  FieldErrorText,
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
              !endDateTime || !value || new Date(value) < new Date(endDateTime)
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
                <FieldErrorText>{formik.errors.title as string}</FieldErrorText>
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
                <FieldErrorText>{formik.errors.file as string}</FieldErrorText>
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
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

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
              !endDateTime || !value || new Date(value) < new Date(endDateTime)
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
                <FieldErrorText>{formik.errors.title as string}</FieldErrorText>
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
                <FieldErrorText>{formik.errors.file as string}</FieldErrorText>
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
