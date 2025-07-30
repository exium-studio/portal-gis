import { Interface__Layer } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useConfirmationDisclosure from "@/context/useConfirmationDisclosure";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { formatTableName } from "@/utils/formatTableName";
import { fileValidation } from "@/utils/validationSchemas";
import {
  AlertIndicator,
  AlertRoot,
  AlertTitle,
  Box,
  FieldRoot,
  HStack,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import BackButton from "../ui-custom/BackButton";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import FeedbackNoData from "../ui-custom/FeedbackNoData";
import FileInput from "../ui-custom/FileInput";
import P from "../ui-custom/P";
import SearchInput from "../ui-custom/SearchInput";
import StringInput from "../ui-custom/StringInput";
import Textarea from "../ui-custom/Textarea";
import { Field } from "../ui/field";
import { Tooltip } from "../ui/tooltip";
import SelectLayerFileType from "./SelectLayerFileType";

const EditLayer = (props: any) => {
  // Props
  const { workspace, layer, ...restProps } = props;
  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-layer-${layer?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud_layer",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      name: "",
      description: "",
      file_type: undefined as any,
      file: undefined as any,
      deleted_file: [],
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(l.required_form),
      description: yup.string().required(l.required_form),
      file_type: yup.array(),
      file: fileValidation({
        allowedExtensions: ["shp", "zip"],
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values.file[0]);

      back();

      const payload = new FormData();
      payload.append("workspace_id", workspace?.id);
      payload.append(
        "table_name",
        `${formatTableName(values.name)}${workspace?.id}`
      );
      payload.append("name", values.name);
      payload.append("description", values.description);
      payload.append("file_type", values.file_type?.[0]?.id);
      payload.append("file", values.file?.[0]);

      const url = `/api/gis-bpn/workspaces-layers/update/${layer?.id}`;
      const config = {
        url,
        method: "PATCH",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            resetForm();
          },
        },
      });
    },
  });

  // Handle initial data
  useEffect(() => {
    if (open) {
      formik.setValues({
        name: layer?.name,
        description: layer?.description,
        file_type: undefined,
        file: undefined,
        deleted_file: [],
      });
    }
  }, [layer, open]);

  // Handle if file type null, remove file
  useEffect(() => {
    if (empty(formik.values.file_type)) {
      formik.setFieldValue("file", undefined);
    }
  }, [formik.values.file_type]);

  return (
    <>
      <Tooltip content={l.edit_workspace}>
        <BButton
          iconButton
          value="edit"
          onClick={onOpen}
          variant={"ghost"}
          {...restProps}
        >
          <Icon>
            <IconEdit />
          </Icon>
        </BButton>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.edit} Layer`} />
          </DisclosureHeader>

          <DisclosureBody>
            <AlertRoot status="warning" mb={4}>
              <AlertIndicator />
              <AlertTitle>{l.edit_layer_alert}</AlertTitle>
            </AlertRoot>

            <FieldRoot>
              <Field
                label={l.name}
                invalid={!!formik.errors.name}
                errorText={formik.errors.name as string}
                mb={4}
              >
                <StringInput
                  onChangeSetter={(input) => {
                    formik.setFieldValue("name", input);
                  }}
                  inputValue={formik.values.name}
                />
              </Field>

              <Field
                label={l.description}
                invalid={!!formik.errors.description}
                errorText={formik.errors.description as string}
                mb={4}
              >
                <Textarea
                  onChangeSetter={(input) => {
                    formik.setFieldValue("description", input);
                  }}
                  inputValue={formik.values.description}
                />
              </Field>

              <Field
                label={l.layer_file_type}
                invalid={!!formik.errors.file_type}
                errorText={formik.errors.file_type as string}
                mb={4}
                optional
              >
                <SelectLayerFileType
                  onConfirm={(input) => {
                    formik.setFieldValue("file_type", input);
                  }}
                  inputValue={formik.values.file_type}
                />
              </Field>

              <Field
                label={"File"}
                invalid={!!formik.errors.file}
                errorText={formik.errors.file as string}
                disabled={empty(formik.values.file_type)}
                optional
              >
                <FileInput
                  dropzone
                  onChangeSetter={(input) => {
                    formik.setFieldValue("file", input);
                  }}
                  inputValue={formik.values.file}
                  disabled={empty(formik.values.file_type)}
                  accept=".zip, .shp"
                />
              </Field>
            </FieldRoot>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
            <BButton
              colorPalette={themeConfig?.colorPalette}
              onClick={formik.submitForm}
            >
              {l.save}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const DeleteLayer = (props: any) => {
  // Props
  const { workspace, layer, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { req } = useRequest({
    id: "crud_layer",
  });

  // Contexts
  const setRt = useRenderTrigger((s) => s.setRt);
  const { setConfirmationData, confirmationOnOpen } =
    useConfirmationDisclosure();
  const removeLayer = useActiveWorkspaces((s) => s.removeLayer);

  // Utils
  function onDelete() {
    back();

    const url = `/api/gis-bpn/workspaces-layers/delete/${layer?.id}`;
    const config = {
      url,
      method: "DELETE",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          removeLayer(workspace?.id, layer.id);
        },
      },
    });
  }

  return (
    <Tooltip content={l.delete_layer}>
      <BButton
        iconButton
        variant={"ghost"}
        onClick={() => {
          setConfirmationData({
            title: `${capsFirstLetterEachWord(l.delete_layer)}`,
            description: l.perma_delete_confirmation,
            confirmLabel: "Delete",
            confirmButtonProps: { colorPalette: "red" },
            onConfirm: onDelete,
          });
          confirmationOnOpen();
        }}
        {...restProps}
      >
        <Icon>
          <IconTrash />
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const WorkspaceLayersDisclosureTrigger = (props: any) => {
  // Props
  const { children, workspace, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`workspace-detail-${workspace.id}`, open, onOpen, onClose);

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const layers = workspace?.layers as Interface__Layer[];
  const [search, setSearch] = useState<string>("");
  const filteredLayers = layers?.filter((layer: Interface__Layer) => {
    const searchTerm = search?.toLowerCase();
    const nameTerm = layer?.name?.toLowerCase();

    if (searchTerm) return nameTerm?.includes(searchTerm);

    return layers;
  });

  return (
    <>
      <Box onClick={onOpen} {...restProps}>
        {children}
      </Box>

      <DisclosureRoot
        open={open}
        lazyLoad
        size={"xs"}
        scrollBehavior={"inside"}
      >
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Workspace Layers`} />
          </DisclosureHeader>

          <DisclosureBody p={"0 !important"}>
            <CContainer px={4} py={4} gap={2}>
              <HStack mb={2}>
                <SearchInput
                  onChangeSetter={(inputValue) => {
                    setSearch(inputValue);
                  }}
                  inputProps={{
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                    borderRadius: 0,
                  }}
                  inputValue={search}
                  invalid={false}
                />

                {/* <BButton iconButton colorPalette={themeConfig.colorPalette}>
                <Icon>
                  <IconPlus stroke={1.5} />
                </Icon>
              </BButton> */}
              </HStack>

              <CContainer gap={2} className="scrollY">
                {empty(filteredLayers) && <FeedbackNoData />}

                {filteredLayers && (
                  <>
                    {filteredLayers?.map((layer) => {
                      return (
                        <HStack
                          key={layer.id}
                          border={"1px solid"}
                          borderColor={"border.muted"}
                          pl={3}
                          pr={1}
                          py={1}
                          borderRadius={themeConfig.radii.component}
                        >
                          <P>{layer?.name}</P>

                          <HStack gap={1} ml={"auto"}>
                            <EditLayer workspace={workspace} layer={layer} />
                            <DeleteLayer workspace={workspace} layer={layer} />
                          </HStack>
                        </HStack>
                      );
                    })}
                  </>
                )}
              </CContainer>
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default WorkspaceLayersDisclosureTrigger;
