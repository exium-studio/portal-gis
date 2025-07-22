import CContainer from "@/components/ui-custom/CContainer";
import useConfirmationDisclosure from "@/context/useConfirmationDisclosure";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { fileValidation } from "@/utils/validationSchemas";
import { HStack, Icon, useDisclosure } from "@chakra-ui/react";
import {
  IconArrowRight,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import BackButton from "../ui-custom/BackButton";
import BButton from "../ui-custom/BButton";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import FileInput from "../ui-custom/FileInput";
import Img from "../ui-custom/Img";
import P from "../ui-custom/P";
import { Field } from "../ui/field";
import { Tooltip } from "../ui/tooltip";
import SelectLayerFileType from "./SelectLayerFileType";

const CreateLayer = (props: any) => {
  // Props
  const { data } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`create-_layer_${data?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud_layer",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const URL = {
    SHP: ``,
    GeoJSON: ``,
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      layerFileType: undefined as any,
      docs: undefined as any,
    },
    validationSchema: yup.object().shape({
      layerFileType: yup.array().required(l.required_form),
      docs: fileValidation({
        allowedExtensions: [".zip", ".shp"],
      }).required(l.required_form),
    }),
    onSubmit: (values) => {
      // console.log(values);

      back();

      const payload = new FormData();
      payload.append("layerFileType", values.layerFileType);
      payload.append("docs", values.docs);
      const url = URL[values.layerFileType?.label as keyof typeof URL] || `SHP`;
      const config = {
        url,
        method: "POST",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            // TODO rerender and reload workspace
          },
        },
      });
    },
  });

  return (
    <>
      <Tooltip content={l.add_workspace_layer}>
        <BButton
          unclicky
          iconButton
          variant={"ghost"}
          size={"sm"}
          onClick={onOpen}
        >
          <Icon>
            <IconPlus />
          </Icon>
        </BButton>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={capsFirstLetterEachWord(l.add_workspace_layer)}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="create_layer_form" onSubmit={formik.handleSubmit}>
              <Field
                label={l.layer_file_type}
                invalid={!!formik.errors.layerFileType}
                errorText={formik.errors.layerFileType as string}
                mb={4}
              >
                <SelectLayerFileType
                  onConfirm={(input) => {
                    formik.setFieldValue("layerFileType", input);
                  }}
                  inputValue={formik.values.layerFileType}
                />
              </Field>

              <Field
                label={"File"}
                invalid={!!formik.errors.docs}
                errorText={formik.errors.docs as string}
                disabled={empty(formik.values.layerFileType)}
              >
                <FileInput
                  dropzone
                  onChangeSetter={(input) => {
                    formik.setFieldValue("docs", input);
                  }}
                  inputValue={formik.values.docs}
                  disabled={empty(formik.values.layerFileType)}
                />
              </Field>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              type="submit"
              form={"create_layer_form"}
              colorPalette={themeConfig?.colorPalette}
            >
              {l.add}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const EditWorkspace = (props: any) => {
  // Props
  const { data } = props;
  console.log("edit workspace", data);

  // Hooks
  const { l } = useLang();

  return (
    <Tooltip content={l.edit_workspace}>
      <BButton unclicky iconButton variant={"ghost"} size={"sm"}>
        <Icon>
          <IconEdit />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const DeleteWorkspace = (props: any) => {
  // Props
  const { data } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const { setConfirmationData, confirmationOnOpen } =
    useConfirmationDisclosure();

  return (
    <Tooltip content={l.delete_workspace}>
      <BButton
        unclicky
        iconButton
        variant={"ghost"}
        size={"sm"}
        onClick={() => {
          setConfirmationData({
            title: `${l.delete_workspace} <b>${data?.title}</b>`,
            description: l.perma_delete_confirmation,
            confirmLabel: "Delete",
            confirmButtonProps: { colorPalette: "red" },
            onConfirm: () => {
              // TODO req on delete workspace
              back();
            },
          });
          confirmationOnOpen();
        }}
      >
        <Icon>
          <IconTrash />
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const WorkspaceItem = (props: any) => {
  // Props
  const { initialData, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const [data, setData] = useState<any>(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <CContainer
      borderRadius={themeConfig.radii.container}
      overflow={"clip"}
      border={"1px solid"}
      borderColor={"border.muted"}
      bg={"body"}
      pos={"relative"}
      {...restProps}
    >
      <CContainer>
        <Img src={data?.thumbnail?.file_url} aspectRatio={16 / 10} />

        <CContainer p={4} gap={1}>
          <P fontWeight={"semibold"}>{data?.title}</P>

          <P lineClamp={1} color={"fg.subtle"}>
            {data?.description}
          </P>
        </CContainer>
      </CContainer>

      <HStack
        p={1}
        gap={0}
        borderTop={"1px solid"}
        borderColor={"border.muted"}
      >
        <CreateLayer data={data} />

        <EditWorkspace data={data} />

        <DeleteWorkspace data={data} />

        <Tooltip content={l.load_workspace_to_map}>
          <BButton
            unclicky
            iconButton
            variant={"ghost"}
            colorPalette={themeConfig.colorPalette}
            size={"sm"}
            ml={"auto"}
          >
            <Icon>
              <IconArrowRight />
            </Icon>
          </BButton>
        </Tooltip>
      </HStack>
    </CContainer>
  );
};

export default WorkspaceItem;
