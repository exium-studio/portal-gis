import CContainer from "@/components/ui-custom/CContainer";
import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import useActiveLayers from "@/context/useActiveLayers";
import useConfirmationDisclosure from "@/context/useConfirmationDisclosure";
import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import { OPTIONS_LAYER_FILE_TYPE } from "@/static/selectOptions";
import back from "@/utils/back";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { fileValidation } from "@/utils/validationSchemas";
import {
  FieldsetRoot,
  HStack,
  Icon,
  Popover,
  Portal,
  Separator,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconEdit,
  IconEye,
  IconFilePlus,
  IconStackPop,
  IconStackPush,
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
import StringInput from "../ui-custom/StringInput";
import Textarea from "../ui-custom/Textarea";
import { Field } from "../ui/field";
import { Tooltip } from "../ui/tooltip";
import ExistingFileItem from "./ExistingFIleItem";
import SelectLayerFileType from "./SelectLayerFileType";

const DeleteWorkspace = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { req } = useRequest({
    id: "crud_workspace",
  });

  // Contexts
  const setRt = useRenderTrigger((s) => s.setRt);
  const { setConfirmationData, confirmationOnOpen } =
    useConfirmationDisclosure();
  const unloadWorkspace = useActiveLayers((s) => s.removeLayerGroup);

  // Utils
  function onDelete() {
    back();

    const url = `/api/gis-bpn/workspaces/delete/${data?.id}`;
    const config = {
      url,
      method: "DELETE",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          unloadWorkspace(data?.id);
        },
      },
    });
  }

  return (
    <Tooltip content={l.delete_workspace}>
      <BButton
        unclicky
        iconButton
        variant={"ghost"}
        // size={"sm"}
        onClick={() => {
          setConfirmationData({
            title: `${capsFirstLetterEachWord(l.delete_workspace)}`,
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
          <IconTrash stroke={1.8} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const EditWorkspace = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-workspace-${data?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud_workspace",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // States
  const [existingThumbnail, setExistingThumbnail] = useState<any[]>(
    data?.thumbnail
  );
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      title: data?.title,
      description: data?.description,
      for_aqiqah: false,
      thumbnail: undefined as any,
      deleted_thumbnail: [],
    },
    validationSchema: yup.object().shape({
      title: yup.string().required(l.required_form),
      description: yup.string().required(l.required_form),
      thumbnail:
        existingThumbnail.length === 0
          ? fileValidation({
              allowedExtensions: ["jpg", "jpeg", "png", "svg"],
            }).required(l.required_form)
          : fileValidation({
              allowedExtensions: ["jpg", "jpeg", "png", "svg"],
            }),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);

      back();

      const payload = new FormData();
      payload.append("title", values.title);
      payload.append("description", values.description);
      if (values.thumbnail && values.thumbnail.length > 0) {
        values.thumbnail.forEach((file: File) => {
          payload.append("thumbnail", file);
        });
      }

      const url = `/api/gis-bpn/workspaces/update/${data?.id}`;
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
    formik.setValues({
      title: data?.title,
      description: data?.description,
      for_aqiqah: data?.for_aqiqah,
      thumbnail: undefined as any,
      deleted_thumbnail: [],
    });

    setExistingThumbnail(data?.thumbnail);
  }, [data]);

  return (
    <>
      <Tooltip content={l.edit_workspace}>
        <BButton
          unclicky
          iconButton
          variant={"ghost"}
          // size={"sm"}
          onClick={onOpen}
          {...restProps}
        >
          <Icon>
            <IconEdit stroke={1.8} />
          </Icon>
        </BButton>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.edit} Workspace`} />
          </DisclosureHeader>

          <DisclosureBody>
            <FieldsetRoot>
              <form id="edit_workspace_form" onSubmit={formik.handleSubmit}>
                <Field
                  label={"Thumbnail"}
                  invalid={!!formik.errors.thumbnail}
                  errorText={formik.errors.thumbnail as string}
                  mb={4}
                >
                  {!empty(existingThumbnail) && (
                    <CContainer>
                      {existingThumbnail?.map((item: any, i: number) => {
                        return (
                          <ExistingFileItem
                            key={i}
                            data={item}
                            onDelete={() => {
                              setExistingThumbnail((prev) =>
                                prev.filter((f) => f !== item)
                              );
                              formik.setFieldValue("deleted_thumbnail", [
                                ...formik.values.deleted_thumbnail,
                                item,
                              ]);
                            }}
                          />
                        );
                      })}
                    </CContainer>
                  )}

                  {empty(existingThumbnail) && (
                    <FileInput
                      dropzone
                      name="thumbnail"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("thumbnail", input);
                      }}
                      inputValue={formik.values.thumbnail}
                      accept=".png, .jpg, .jpeg,"
                    />
                  )}

                  {!empty(formik.values.deleted_thumbnail) && (
                    <CContainer gap={2} mt={2}>
                      <P color={"fg.muted"}>{l.deleted_thumbnail}</P>

                      {formik.values.deleted_thumbnail?.map(
                        (item: any, i: number) => {
                          return (
                            <ExistingFileItem
                              key={i}
                              data={item}
                              withDeleteButton={false}
                              withUndobutton
                              onUndo={() => {
                                setExistingThumbnail((prev) => [...prev, item]);

                                formik.setFieldValue(
                                  "deleted_thumbnail",
                                  formik.values.deleted_thumbnail.filter(
                                    (f: any) => f !== item
                                  )
                                );

                                formik.setFieldValue("icon", undefined);
                              }}
                            />
                          );
                        }
                      )}
                    </CContainer>
                  )}
                </Field>

                <Field
                  label={l.title}
                  invalid={!!formik.errors.title}
                  errorText={formik.errors.title as string}
                  mb={4}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("title", input);
                    }}
                    inputValue={formik.values.title}
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
              </form>
            </FieldsetRoot>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
            <BButton
              colorPalette={themeConfig?.colorPalette}
              type="submit"
              form="edit_workspace_form"
            >
              {l.save}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const AddLayer = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // console.log(data);

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`create-layer-${data?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud_layer",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const LAYER_PROPS = {
    SHP: {
      url: `/api/gis-bpn/workspace-layers/upload-shapefile`,
      key: "shapefile",
    },
    GeoJSON: {
      url: ``,
      key: "geojson",
    },
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      layerFileType: [OPTIONS_LAYER_FILE_TYPE[0]],
      docs: undefined as any,
    },
    validationSchema: yup.object().shape({
      layerFileType: yup.array().required(l.required_form),
      docs: fileValidation({
        allowedExtensions: ["shp", "zip"],
      }).required(l.required_form),
    }),
    onSubmit: (values) => {
      // console.log(values.docs[0]);

      back();

      const payload = new FormData();
      payload.append("workspace_id", data?.id);
      payload.append(
        LAYER_PROPS[
          values.layerFileType?.[0]?.label as keyof typeof LAYER_PROPS
        ].key,
        values.docs[0]
      );
      const url =
        LAYER_PROPS[
          (values.layerFileType?.[0]?.label as keyof typeof LAYER_PROPS) ||
            `SHP`
        ].url;
      const config = {
        url,
        method: "PATCH",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {},
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
          // size={"sm"}
          onClick={onOpen}
          {...restProps}
        >
          <Icon>
            <IconFilePlus stroke={1.8} />
          </Icon>
        </BButton>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.add} Layer`} />
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
                  accept=".zip, .shp"
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
const UnloadLayer = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const unloadWorkspace = useActiveLayers((s) => s.removeLayerGroup);

  return (
    <Tooltip content={l.unload_workspace_from_map}>
      <BButton
        iconButton
        variant={"ghost"}
        onClick={() => {
          unloadWorkspace(data?.id);
        }}
        {...restProps}
      >
        <Icon boxSize={"26px"}>
          <IconStackPop stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const LoadWorkspace = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { req, loading } = useRequest({
    id: "load_workspace",
    loadingMessage: {
      ...l.layer_loading_toast,
    },
    successMessage: {
      ...l.layer_loaded_toast,
    },
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const addLayerGroup = useActiveLayers((s) => s.addLayerGroup);

  // Utils
  function onLoad() {
    const url = `/api/gis-bpn/workspace-layers/shape-files/${data.id}`;
    const config = {
      url,
      method: "GET",
    };

    // addLayerGroup({
    //   workspace: data,
    //   layers: [{ layer_id: 1, layer_name: "dummy", data: dummyGeoJSON }],
    //   visible: true,
    // });

    req({
      config,
      onResolve: {
        onSuccess: (r: any) => {
          const layerData = r.data.data?.[0];
          addLayerGroup({
            workspace: data,
            layer: layerData,
            visible: true,
          });
        },
      },
    });
  }

  return (
    <Tooltip content={l.load_workspace_to_map}>
      <BButton
        unclicky
        iconButton
        variant={"ghost"}
        color={themeConfig.primaryColor}
        // size={"sm"}
        onClick={onLoad}
        loading={loading}
        {...restProps}
      >
        <Icon boxSize={"26px"}>
          <IconStackPush stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const ViewLayers = (props: any) => {
  // Props
  const { bboxCenter, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const { mapRef } = useMapViewState();

  // Utils
  function onViewLayers() {
    if (mapRef.current && bboxCenter?.bbox) {
      const [minLng, minLat, maxLng, maxLat] = bboxCenter.bbox;

      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: 20, // px
          duration: MAP_TRANSITION_DURATION,
          essential: true,
        }
      );
    }
  }

  return (
    <Tooltip content={l.view_layer}>
      <BButton
        unclicky
        iconButton
        variant={"ghost"}
        onClick={onViewLayers}
        {...restProps}
      >
        <Icon boxSize={"26px"}>
          <IconEye stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const WorkspaceItem = (props: any) => {
  // Props
  const { initialData, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const activeLayerGroups = useActiveLayers((s) => s.activeLayerGroups);

  // States
  const [data, setData] = useState<any>(initialData);
  const loadedLayerData = activeLayerGroups.find(
    (layerData: any) => layerData.workspace.id === data.id
  );
  const bboxCenter = {
    bbox: loadedLayerData?.layer?.geojson?.bbox,
    center: loadedLayerData?.layer?.geojson?.center,
  };

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <CContainer
      key={data.id}
      borderRadius={themeConfig.radii.container}
      overflow={"clip"}
      border={"1px solid"}
      borderColor={"border.muted"}
      bg={"body"}
      pos={"relative"}
      {...restProps}
    >
      <CContainer>
        <Img
          key={data?.thumbnail?.[0]?.file_url}
          src={data?.thumbnail?.[0]?.file_url}
          aspectRatio={16 / 10}
        />

        <CContainer p={4} gap={1}>
          <P fontWeight={"semibold"}>{data?.title}</P>

          <Popover.Root>
            <Popover.Trigger asChild>
              <P lineClamp={1} color={"fg.subtle"}>
                {data?.description}
              </P>
            </Popover.Trigger>

            <Portal>
              <Popover.Positioner>
                <Popover.Content p={2} maxW={"200px"}>
                  {data?.description}
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </CContainer>
      </CContainer>

      <HStack
        p={1}
        gap={1}
        borderTop={"1px solid"}
        borderColor={"border.muted"}
      >
        <DeleteWorkspace data={data} flex={1} />

        <EditWorkspace data={data} setData={setData} flex={1} />

        <Separator orientation={"vertical"} h={"full"} />

        <AddLayer data={data} flex={1} />

        <UnloadLayer data={data} flex={1} disabled={!!!loadedLayerData} />

        {loadedLayerData && (
          <ViewLayers data={data} bboxCenter={bboxCenter} flex={1} />
        )}

        {!loadedLayerData && <LoadWorkspace data={data} flex={1} />}
      </HStack>
    </CContainer>
  );
};

export default WorkspaceItem;
