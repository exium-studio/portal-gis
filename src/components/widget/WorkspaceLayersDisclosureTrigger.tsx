import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import HelperText from "@/components/ui-custom/HelperText";
import { DEFAULT_LAYER_COLOR, LEGEND_COLOR_OPTIONS } from "@/constants/colors";
import { Interface__Layer } from "@/constants/interfaces";
import { LAYER_TYPES } from "@/constants/lateral";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useConfirmationDisclosure from "@/context/useConfirmationDisclosure";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDebouncedCallback from "@/hooks/useDebouncedCallback";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import capsFirstLetter from "@/utils/capsFirstLetter";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { formatTableName } from "@/utils/formatTableName";
import { isRoleViewer, isWorkspaceCreatedBy } from "@/utils/role";
import { fileValidation } from "@/utils/validationSchemas";
import {
  AlertIndicator,
  AlertRoot,
  AlertTitle,
  Badge,
  Box,
  Color,
  ColorPicker,
  FieldRoot,
  FieldsetRoot,
  HStack,
  Icon,
  parseColor,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { IconEdit, IconFlag, IconTrash } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
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
import SelectLayerByWorkspaceId from "./SelectLayerByWorkspaceId";
import SelectLayerFileType from "./SelectLayerFileType";
import SelectLayerType from "./SelectLayerType";
import SelectPropertyByLayerId from "./SelectPropertyByLayerId";
import SimplePopover from "./SimplePopover";
import FeedbackNotFound from "@/components/ui-custom/FeedbackNotFound";

const SetLegendColorscale = (props: any) => {
  // Props
  const { layer } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`set-legend-${layer?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "set_legend",
  });

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

  useEffect(() => {
    if (layer.color_property_key) {
      formik.setFieldValue("property_key", [
        {
          id: layer.color_property_key,
          label: layer.color_property_key,
        },
      ]);
    }
  }, [layer.color_property_key]);

  return (
    <form id="set_legend_colorscale" onSubmit={formik.handleSubmit}>
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
  );
};
const PropertyLegendColorPicker = (props: any) => {
  // Props
  const { pv, layer, formik, containerRef } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const debouncedUpdate = useDebouncedCallback((colorObject: Color) => {
    const hexColor = colorObject.toString("hex");
    // @ts-expect-error => alpha is exist
    const opacity = colorObject.alpha;

    const newPropertyValues = formik.values.property_values.map((item: any) => {
      return item.value === pv.value
        ? { ...item, color: hexColor, opacity: opacity || 0.8 }
        : item;
    });

    formik.setFieldValue("property_values", newPropertyValues);
  }, 300);

  // States
  const [tempColor, setTempColor] = useState<Color>(
    layer.color_property_key === formik.values.property_key?.[0]?.id
      ? parseColor(pv.color || DEFAULT_LAYER_COLOR)
      : parseColor(DEFAULT_LAYER_COLOR)
  );

  return (
    <CContainer key={pv.value}>
      <ColorPicker.Root
        value={tempColor}
        onValueChange={(e) => {
          setTempColor(e.value);
          debouncedUpdate(e.value);
        }}
        colorPalette={themeConfig.colorPalette}
      >
        <ColorPicker.HiddenInput />

        <ColorPicker.Label>{pv.value}</ColorPicker.Label>

        <ColorPicker.Control>
          <ColorPicker.Input />
          <ColorPicker.Trigger />
        </ColorPicker.Control>

        <Portal container={containerRef}>
          <ColorPicker.Positioner>
            <ColorPicker.Content>
              <ColorPicker.Area />
              <HStack>
                <ColorPicker.EyeDropper size="xs" variant="outline" />
                <ColorPicker.Sliders />
              </HStack>
            </ColorPicker.Content>
          </ColorPicker.Positioner>
        </Portal>
      </ColorPicker.Root>
    </CContainer>
  );
};
const SetLegendProperty = (props: any) => {
  // Props
  const { layer, containerRef } = props;

  // Hooks
  const { req, loading } = useRequest({
    id: "get_props_value_by_props_key",
    showLoadingToast: false,
    showSuccessToast: false,
  });
  const { req: reqUpdate } = useRequest({
    id: "update_props_color",
  });

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      property_key: undefined as any,
      property_values: undefined as any,
    },
    validationSchema: yup.object().shape({
      property_key: yup
        .array()
        .min(1, l.required_form)
        .required(l.required_form),
      property_values: yup
        .array()
        .min(1, l.required_form)
        .required(l.required_form),
    }),
    onSubmit: (values) => {
      back();

      const payload = {
        property_key: values.property_key?.[0]?.id,
        property_values: values.property_values.map((item: any) => ({
          property_value: item.value,
          color: item.color,
          opacity: item.opacity,
        })),
      };
      const config = {
        url: `/api/gis-bpn/workspaces-layers/update-color-key/${layer.id}`,
        method: "PATCH",
        data: payload,
      };
      reqUpdate({
        config,
        onResolve: {
          onSuccess: () => {},
        },
      });
    },
  });

  useEffect(() => {
    const config = {
      url: `/api/gis-bpn/workspaces-layers/property-value/${layer?.id}`,
      method: "POST",
      data: {
        property_key: formik.values.property_key?.[0]?.id,
      },
    };

    if (formik.values.property_key) {
      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            formik.setFieldValue("property_values", r.data.data.values);
          },
        },
      });
    } else {
      formik.setFieldValue("property_values", undefined);
    }
  }, [formik.values.property_key]);

  useEffect(() => {
    if (layer.color_property_key) {
      formik.setFieldValue("property_key", [
        {
          id: layer.color_property_key,
          label: layer.color_property_key,
        },
      ]);
    }
  }, [layer.color_property_key]);

  return (
    <form id="set_legend_property" onSubmit={formik.handleSubmit}>
      <FieldRoot gap={4}>
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

        {loading && <ComponentSpinner />}

        {!loading && (
          <>
            {formik.values.property_values === undefined && (
              <CContainer align={"center"}>
                <HelperText color={"fg.subtle"}>
                  {l.select_property_first}
                </HelperText>
              </CContainer>
            )}
            {formik.values.property_values?.length === 0 && (
              <FeedbackNotFound />
            )}

            {!empty(formik.values.property_values) && (
              <Field
                label={l.color}
                invalid={!!formik.errors.property_key}
                errorText={formik.errors.property_key as string}
              >
                <CContainer
                  rounded={themeConfig.radii.container}
                  p={4}
                  border={"2px dashed"}
                  borderColor={"border.muted"}
                  gap={4}
                >
                  {formik.values.property_values?.map((pv: any) => {
                    return (
                      <PropertyLegendColorPicker
                        key={pv.value}
                        pv={pv}
                        layer={layer}
                        formik={formik}
                        containerRef={containerRef}
                      />
                    );
                  })}
                </CContainer>
              </Field>
            )}
          </>
        )}
      </FieldRoot>
    </form>
  );
};

const SetLegend = (props: any) => {
  // Props
  const { layer, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`set-legend-${layer?.id}`, open, onOpen, onClose);

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [mode, setMode] = useState<string>("colorscale");
  const setLegend = {
    colorscale: {
      label: "Colorscale",
      formId: "set_legend_colorscale",
      render: <SetLegendColorscale layer={layer} />,
    },
    property: {
      label: "Custom",
      formId: "set_legend_property",
      render: <SetLegendProperty layer={layer} containerRef={containerRef} />,
    },
  };
  const activeSetLegend = setLegend[mode as keyof typeof setLegend];

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
            <CContainer fRef={containerRef}>
              <HStack
                bg={"bg.muted"}
                mb={4}
                p={1}
                rounded={themeConfig.radii.component}
                gap={1}
              >
                {Object.keys(setLegend).map((item) => (
                  <BButton
                    key={item}
                    unclicky
                    flex={1}
                    onClick={() => {
                      setMode(item);
                    }}
                    variant={"ghost"}
                    bg={mode === item ? "body" : "transparent"}
                    color={
                      mode === item ? themeConfig.primaryColor : "fg.subtle"
                    }
                  >
                    {setLegend[item as keyof typeof setLegend].label}
                  </BButton>
                ))}
              </HStack>

              {activeSetLegend.render}
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              type="submit"
              form={activeSetLegend.formId}
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
      is_boundary: false,
      name: "",
      description: "",
      layer_type: undefined as any,
      file_type: undefined as any,
      file: undefined as any,
      parent_layer: undefined as any,
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
      parent_layer: yup.array(),
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
      payload.append("is_boundary", values.is_boundary.toString());
      payload.append("name", values.name);
      payload.append("description", values.description);
      payload.append("layer_type", values.layer_type?.[0]?.id);
      if (values.file_type)
        payload.append("file_type", values.file_type?.[0]?.id);
      if (values.file) payload.append("file", values.file?.[0]);
      payload.append("parent_layer_id", values.parent_layer?.[0]?.id);

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
        is_boundary: layer?.is_boundary,
        name: layer?.name,
        description: layer?.description,
        layer_type: [
          {
            id: layer?.layer_type,
            label:
              LAYER_TYPES[layer?.layer_type as keyof typeof LAYER_TYPES].label,
          },
        ],
        file_type: undefined,
        file: undefined,
        parent_layer: [
          {
            id: layer?.parent_layer?.id,
            label: layer?.parent_layer?.name,
          },
        ],
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
                  disabled
                  helperText={l.with_explanation_helper}
                >
                  <Checkbox checked={formik.values.with_explanation}>
                    {l.with_explanation}
                  </Checkbox>
                </Field>

                <Field
                  invalid={!!formik.errors.is_boundary}
                  errorText={formik.errors.is_boundary as string}
                  helperText={l.is_boundary_helper}
                >
                  <Checkbox
                    onChange={(e: any) => {
                      formik.setFieldValue("is_boundary", e.target.checked);
                    }}
                    checked={formik.values.is_boundary}
                  >
                    {l.as_boundary}
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

                <Field
                  label={l.parent_layer}
                  invalid={!!formik.errors.parent_layer}
                  errorText={formik.errors.parent_layer as string}
                  optional
                >
                  <SelectLayerByWorkspaceId
                    workspaceId={workspace?.id}
                    onConfirm={(input) => {
                      formik.setFieldValue("parent_layer", input);
                    }}
                    inputValue={formik.values.parent_layer}
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
  const { layer, ...restProps } = props;

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

              <CContainer gap={2} pl={3} pr={0} className="scrollY">
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
                      const isPoint = layer.layer_type === "symbol";

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
                            {!isPoint && (
                              <SetLegend
                                layer={layer}
                                size={"sm"}
                                disabled={
                                  isRoleViewer() ||
                                  !isWorkspaceCreatedBy(
                                    workspace?.created_by
                                  ) ||
                                  workspaceActive
                                }
                              />
                            )}

                            <EditLayer
                              workspace={workspace}
                              layer={layer}
                              disabled={
                                isRoleViewer() ||
                                !isWorkspaceCreatedBy(workspace?.created_by) ||
                                workspaceActive
                              }
                              size={"sm"}
                            />

                            <DeleteLayer
                              workspace={workspace}
                              layer={layer}
                              disabled={
                                isRoleViewer() ||
                                !isWorkspaceCreatedBy(workspace?.created_by) ||
                                workspaceActive
                              }
                              size={"sm"}
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
