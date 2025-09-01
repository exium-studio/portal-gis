import { LEGEND_COLOR_OPTIONS } from "@/constants/colors";
import { Interface__Layer } from "@/constants/interfaces";
import { LAYER_TYPES } from "@/constants/lateral";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useConfirmationDisclosure from "@/context/useConfirmationDisclosure";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import capsFirstLetter from "@/utils/capsFirstLetter";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { formatTableName } from "@/utils/formatTableName";
import { fileValidation } from "@/utils/validationSchemas";
import {
  AlertIndicator,
  AlertRoot,
  AlertTitle,
  Badge,
  Box,
  FieldsetRoot,
  HStack,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { IconEdit, IconFlag, IconTrash } from "@tabler/icons-react";
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
import { Checkbox } from "../ui/checkbox";
import { Field } from "../ui/field";
import { Tooltip } from "../ui/tooltip";
import SelectColorscale from "./SelectColorscale";
import SelectLayerFileType from "./SelectLayerFileType";
import SelectLayerType from "./SelectLayerType";
import SelectPropertyByLayerId from "./SelectPropertyByLayerId";
import SimplePopover from "./SimplePopover";

const SetLegend = (props: any) => {
  // Props
  const { layer, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`set-legend-${layer?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "set_legend",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      colorscale: LEGEND_COLOR_OPTIONS[0],
      property_key: undefined as any,
    },
    validationSchema: yup.object().shape({
      colorscale: yup.object().required(l.required_form),
      property_key: yup.array().required(l.required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      // `console`.log(values);

      back();

      const payload = {
        property_key: values.property_key?.[0].id,
        colorscale: values.colorscale?.colors,
      };

      const config = {
        url: `/api/gis-bpn/workspaces-layers/update-color/${layer?.id}`,
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

  return (
    <>
      <BButton iconButton variant={"ghost"} onClick={onOpen} {...restProps}>
        <Icon boxSize={5}>
          <IconFlag stroke={1.5} />
        </Icon>
      </BButton>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Set ${l.legend}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="set_legend_form" onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={l.property}
                  invalid={!!formik.errors.property_key}
                  errorText={formik.errors.property_key as string}
                >
                  <SelectPropertyByLayerId
                    layerId={layer?.id}
                    inputValue={formik.values.property_key}
                    onConfirm={(input) => {
                      formik.setFieldValue("property_key", input);
                    }}
                  />
                </Field>

                <Field
                  label={`Colorscale`}
                  invalid={!!formik.errors.colorscale}
                  errorText={formik.errors.colorscale as string}
                >
                  <SelectColorscale
                    inputValue={formik.values.colorscale}
                    onConfirm={(input: any) => {
                      formik.setFieldValue("colorscale", input);
                    }}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              type="submit"
              form={"set_legend_form"}
              colorPalette={themeConfig.colorPalette}
            >
              {l.save}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
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
  const setRt = useRenderTrigger((s) => s.setRt);

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      with_explanation: false,
      name: "",
      description: "",
      layer_type: undefined as any,
      file_type: undefined as any,
      file: undefined as any,
    },
    validationSchema: yup.object().shape({
      with_explanation: yup.boolean(),
      name: yup.string().required(l.required_form),
      description: yup.string().required(l.required_form),
      layer_type: yup.array().required(l.required_form),
      file_type: yup.array(),
      file: fileValidation({
        allowedExtensions: ["zip"],
        maxSizeMB: 50,
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);

      back();

      const payload = new FormData();
      payload.append("workspace_id", workspace?.id);
      payload.append(
        "table_name",
        `${formatTableName(values.name)}_${workspace?.id}`
      );
      payload.append("with_explanation", values.with_explanation.toString());
      payload.append("name", values.name);
      payload.append("description", values.description);
      payload.append("layer_type", values.layer_type?.[0]?.id);
      if (values.file_type)
        payload.append("file_type", values.file_type?.[0]?.id);
      if (values.file) payload.append("file", values.file?.[0]);

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
            setRt((ps) => !ps);
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
        with_explanation: layer?.with_explanation,
        name: layer?.name,
        description: layer?.description,
        layer_type: [
          {
            id: layer?.layer_type,
            label: capsFirstLetter(layer?.layer_type),
          },
        ],
        file_type: undefined,
        file: undefined,
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
          <Icon boxSize={restProps.boxSize || 5}>
            <IconEdit stroke={1.5} />
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

            <form id="edit_layer" onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  invalid={!!formik.errors.with_explanation}
                  errorText={formik.errors.with_explanation as string}
                  // helperText={l.with_explanation_helper}
                >
                  <Checkbox readOnly checked={formik.values.with_explanation}>
                    {l.with_explanation}
                  </Checkbox>
                </Field>

                <Field
                  label={l.name}
                  invalid={!!formik.errors.name}
                  errorText={formik.errors.name as string}
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
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("description", input);
                    }}
                    inputValue={formik.values.description}
                  />
                </Field>

                <Field
                  label={l.default_layer_type}
                  invalid={!!formik.errors.layer_type}
                  errorText={formik.errors.layer_type as string}
                >
                  <SelectLayerType
                    onConfirm={(input) => {
                      formik.setFieldValue("layer_type", input);
                    }}
                    inputValue={formik.values.layer_type}
                  />
                </Field>

                <Field
                  label={l.layer_file_type}
                  invalid={!!formik.errors.file_type}
                  errorText={formik.errors.file_type as string}
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
                    accept=".zip"
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
            <BButton
              type="submit"
              form="edit_layer"
              colorPalette={themeConfig?.colorPalette}
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
  // const removeLayer = useActiveWorkspaces((s) => s.removeLayer);

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
          // removeLayer(workspace?.id, layer.id);
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
        <Icon boxSize={restProps.boxSize || 5}>
          <IconTrash stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const WorkspaceLayersDisclosureTrigger = (props: any) => {
  // Props
  const { children, workspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`workspace-detail-${workspace.id}`, open, onOpen, onClose);

  // States
  const layers = workspace?.layers as Interface__Layer[];
  const [search, setSearch] = useState<string>("");
  const filteredLayers = layers?.filter((layer: Interface__Layer) => {
    const searchTerm = search?.toLowerCase();
    const nameTerm = layer?.name?.toLowerCase();

    if (searchTerm) return nameTerm?.includes(searchTerm);

    return layers;
  });
  const workspaceActive = !!useActiveWorkspaces((s) =>
    s.getActiveWorkspace(workspace?.id)
  );

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
            <CContainer pl={4} pr={"10px"} py={4} gap={2}>
              {workspaceActive && (
                <AlertRoot status="warning" mb={2}>
                  <AlertIndicator />
                  <AlertTitle>
                    {l.edit_delete_cannot_be_active_workspace}
                  </AlertTitle>
                </AlertRoot>
              )}

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
              </HStack>

              <CContainer gap={2} px={3} className="scrollY">
                {empty(filteredLayers) && <FeedbackNoData />}

                {filteredLayers && (
                  <>
                    {filteredLayers?.reverse().map((layer) => {
                      const LayerIcon =
                        LAYER_TYPES[
                          layer.layer_type as keyof typeof LAYER_TYPES
                        ].icon;
                      const layerTypeLabel =
                        LAYER_TYPES[
                          layer.layer_type as keyof typeof LAYER_TYPES
                        ].label;

                      return (
                        <HStack key={layer.id} py={1}>
                          <SimplePopover
                            content={
                              <CContainer gap={1}>
                                <CContainer>
                                  <P w={"full"}>{layer?.name}</P>

                                  <P w={"full"} color={"fg.subtle"}>
                                    {layer?.description}
                                  </P>
                                </CContainer>

                                <HStack wrap={"wrap"} mt={2}>
                                  <Badge color={"fg.muted"}>
                                    <Icon boxSize={4}>
                                      <LayerIcon stroke={1.5} />
                                    </Icon>

                                    <P lineClamp={1} fontSize={"xs"}>
                                      {layerTypeLabel}
                                    </P>
                                  </Badge>

                                  <Badge color={"fg.muted"}>
                                    <P lineClamp={1} fontSize={"xs"}>
                                      {capsFirstLetter(
                                        layer?.with_explanation
                                          ? l.with_explanation
                                          : l.without_explanation
                                      )}
                                    </P>
                                  </Badge>
                                </HStack>
                              </CContainer>
                            }
                          >
                            <HStack cursor={"pointer"}>
                              <Icon boxSize={5} color={"fg.subtle"}>
                                <Icon boxSize={4}>
                                  <LayerIcon stroke={1.5} />
                                </Icon>
                              </Icon>

                              <P lineClamp={1}>{layer?.name}</P>
                            </HStack>
                          </SimplePopover>

                          <HStack gap={1} ml={"auto"}>
                            <SetLegend
                              layer={layer}
                              size={"xs"}
                              disabled={workspaceActive}
                            />

                            <EditLayer
                              workspace={workspace}
                              layer={layer}
                              disabled={workspaceActive}
                              size={"xs"}
                            />

                            <DeleteLayer
                              workspace={workspace}
                              layer={layer}
                              disabled={workspaceActive}
                              size={"xs"}
                            />
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
