import CContainer from "@/components/ui-custom/CContainer";
import { MAP_TRANSITION_DURATION } from "@/constants/duration";
import {
  Interface__ActiveWorkspace,
  Interface__Layer,
  Interface__StorageFile,
  Interface__Workspace,
} from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useConfirmationDisclosure from "@/context/useConfirmationDisclosure";
import useLang from "@/context/useLang";
import useMapViewState from "@/context/useMapViewState";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useWorkspaceDisplay from "@/context/useWorkspaceDisplay";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import { OPTIONS_LAYER_FILE_TYPE } from "@/static/selectOptions";
import back from "@/utils/back";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { formatTableName } from "@/utils/formatTableName";
import { computeBboxAndCenter } from "@/utils/geospatial";
import { fileValidation } from "@/utils/validationSchemas";
import {
  FieldRoot,
  FieldsetRoot,
  HStack,
  Icon,
  Menu,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconDots,
  IconFilePlus,
  IconStack,
  IconZoomInArea,
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
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { Tooltip } from "../ui/tooltip";
import ExistingFileItem from "./ExistingFIleItem";
import SelectLayerFileType from "./SelectLayerFileType";
import SelectWorkspaceCategory from "./SelectWorkspaceCategort";
import WorkspaceLayersDisclosureTrigger from "./WorkspaceLayersDisclosureTrigger";
import SelectLayerType from "./SelectLayerType";

const WorkspaceMenu = (props: any) => {
  // Props
  const { workspace, setWorkspace, ...restProps } = props;

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <BButton iconButton variant={"ghost"} {...restProps}>
          <Icon boxSize={5}>
            <IconDots />
          </Icon>
        </BButton>
      </MenuTrigger>

      <MenuContent>
        <EditWorkspace workspace={workspace} setWorkspace={setWorkspace} />

        <DeleteWorkspace workspace={workspace} />
      </MenuContent>
    </MenuRoot>
  );
};
const EditWorkspace = (props: any) => {
  // Props
  const { workspace, ...restProps } = props;
  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-workspace-${workspace?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud_workspace",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // States
  const [existingThumbnail, setExistingThumbnail] = useState<any[]>(
    workspace?.thumbnail
  );
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      workspace_category: undefined as any,
      thumbnail: undefined as any,
      title: workspace?.title,
      description: workspace?.description,
      deleted_thumbnail: [] as Interface__StorageFile[],
    },
    validationSchema: yup.object().shape({
      workspace_category: yup.array().required(l.required_form),
      thumbnail: fileValidation({
        allowedExtensions: ["jpg", "jpeg", "png", "svg"],
      }),
      title: yup.string().required(l.required_form),
      description: yup.string().required(l.required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);

      back();

      const payload = new FormData();
      payload.append(
        "workspace_category_id",
        values.workspace_category?.[0]?.id
      );
      if (values.thumbnail && values.thumbnail.length > 0) {
        values.thumbnail.forEach((file: File) => {
          payload.append("thumbnail", file);
        });
      }
      payload.append("title", values.title);
      payload.append("description", values.description);
      if (values.deleted_thumbnail && values.deleted_thumbnail.length > 0) {
        values.deleted_thumbnail.forEach((thumbnail) => {
          payload.append("delete_document_ids[]", thumbnail.id.toString());
        });
      }

      const url = `/api/gis-bpn/workspaces/update/${workspace?.id}`;
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
            // TODO localy setWorkspace on success edit
            resetForm();
          },
        },
      });
    },
  });

  // Handle initial data
  useEffect(() => {
    formik.setValues({
      workspace_category: [
        {
          id: workspace?.workspace_category?.id || workspace?.category?.id,
          label:
            workspace?.workspace_category?.label || workspace?.category?.label,
        },
      ],
      title: workspace?.title,
      description: workspace?.description,
      thumbnail: undefined as any,
      deleted_thumbnail: [],
    });

    setExistingThumbnail(workspace?.thumbnail);
  }, [workspace]);

  return (
    <>
      <Tooltip content={l.edit_workspace} {...restProps}>
        <Menu.Item value="edit" onClick={onOpen}>
          Edit
        </Menu.Item>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.edit} Workspace`} />
          </DisclosureHeader>

          <DisclosureBody>
            <FieldsetRoot>
              <Field
                label={l.workspace_category}
                invalid={!!formik.errors.workspace_category}
                errorText={formik.errors.workspace_category as string}
                mb={4}
              >
                <SelectWorkspaceCategory
                  onConfirm={(input) => {
                    formik.setFieldValue("workspace_category", input);
                  }}
                  inputValue={formik.values.workspace_category}
                />
              </Field>

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
            </FieldsetRoot>
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
const DeleteWorkspace = (props: any) => {
  // Props
  const { workspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { req } = useRequest({
    id: "crud_workspace",
  });

  // Contexts
  const setRt = useRenderTrigger((s) => s.setRt);
  const { setConfirmationData, confirmationOnOpen } =
    useConfirmationDisclosure();
  const unloadWorkspace = useActiveWorkspaces((s) => s.unloadWorkspace);

  // Utils
  function onDelete() {
    back();

    const url = `/api/gis-bpn/workspaces/delete/${workspace?.id}`;
    const config = {
      url,
      method: "DELETE",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          unloadWorkspace(workspace?.id);
        },
      },
    });
  }

  return (
    <Tooltip content={l.delete_workspace}>
      <MenuItem
        value="delete"
        unclicky
        iconButton
        variant={"ghost"}
        color={"red.400"}
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
        Delete...
        {/* <Icon boxSize={5}>
          <IconTrash stroke={1.8} />
        </Icon> */}
      </MenuItem>
    </Tooltip>
  );
};

const WorkspaceLayersUtils = (props: {
  workspace: Interface__Workspace;
  workspaceActive: boolean;
}) => {
  // Props
  const { workspace, workspaceActive, ...restProps } = props;

  return (
    <HStack
      gap={1}
      onClick={(e) => {
        e.stopPropagation();
      }}
      p={1}
      borderTop={"1px solid"}
      borderColor={"border.muted"}
      {...restProps}
    >
      <AddLayer workspace={workspace} disabled={!!workspaceActive} />

      <WorkspaceLayers workspace={workspace} />

      <ViewWorkspace workspace={workspace} disabled={!workspaceActive} />

      <ToggleLoadWorkspace
        workspace={workspace}
        workspaceActive={workspaceActive}
        ml={"auto"}
      />
    </HStack>
  );
};
const WorkspaceLayers = (props: any) => {
  // Props
  const { workspace, ...restProps } = props;

  return (
    <WorkspaceLayersDisclosureTrigger workspace={workspace}>
      <Tooltip content={"Workspace layers"}>
        <BButton iconButton unclicky variant={"ghost"} {...restProps}>
          <Icon boxSize={"24px"}>
            <IconStack stroke={1.5} />
          </Icon>
        </BButton>
      </Tooltip>
    </WorkspaceLayersDisclosureTrigger>
  );
};
const AddLayer = (props: any) => {
  // Props
  const { workspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`create-layer-${workspace?.id}`, open, onOpen, onClose);
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
      name: "",
      description: "",
      layer_type: undefined as any,
      file_type: [OPTIONS_LAYER_FILE_TYPE[0]],
      file: undefined as any,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(l.required_form),
      description: yup.string().required(l.required_form),
      layer_type: yup.array().required(l.required_form),
      file_type: yup.array().required(l.required_form),
      file: fileValidation({
        allowedExtensions: ["shp", "zip"],
      }).required(l.required_form),
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
      payload.append("layer_type", values.layer_type?.[0]?.id);
      payload.append("file_type", values.file_type?.[0]?.id);
      payload.append("file", values.file?.[0]);
      const url = `/api/gis-bpn/workspaces-layers/create`;
      const config = {
        url,
        method: "POST",
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
                label={l.default_layer_type}
                invalid={!!formik.errors.layer_type}
                errorText={formik.errors.layer_type as string}
                mb={4}
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
                mb={4}
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
              onClick={formik.submitForm}
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
const ViewWorkspace = (props: any) => {
  // Props
  const { workspace, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const mapRef = useMapViewState((s) => s.mapRef);
  const activeWorkspace = useActiveWorkspaces((s) =>
    s.getActiveWorkspace(workspace.id)
  );

  // console.log("workspace", workspace);
  // console.log("activeWorkspace", activeWorkspace);

  // Utils
  function onViewLayers() {
    if (mapRef.current && activeWorkspace?.bbox) {
      const [minLng, minLat, maxLng, maxLat] = activeWorkspace.bbox;

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
    <Tooltip content={l.view_workspace}>
      <BButton
        unclicky
        iconButton
        variant={"ghost"}
        onClick={onViewLayers}
        {...restProps}
      >
        <Icon boxSize={"22px"}>
          <IconZoomInArea stroke={1.5} />
        </Icon>
      </BButton>
    </Tooltip>
  );
};
const ToggleLoadWorkspace = (props: any) => {
  // Props
  const { workspace, workspaceActive, ...restProps } = props;

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
  const loadWorkspace = useActiveWorkspaces((s) => s.loadWorkspace);
  const unloadWorkspace = useActiveWorkspaces((s) => s.unloadWorkspace);

  // States
  const [checked, setChecked] = useState<boolean>(workspaceActive);
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const activeWorkspace = useActiveWorkspaces((s) => s.getActiveWorkspace);

  // Utils
  function onLoad() {
    const url = `/api/gis-bpn/workspaces-layers/load/${workspace.id}`;
    const config = {
      url,
      method: "GET",
    };

    req({
      config,
      onResolve: {
        onSuccess: (r: any) => {
          const layers = r?.data?.data as Interface__Layer[];

          // 1. Get all GeoJSON FeatureCollections from layers
          const featureCollections = layers
            .map((layer: Interface__Layer) => layer?.data?.geojson)
            .filter(
              (geojson): geojson is GeoJSON.FeatureCollection => !!geojson
            );

          // 2. Calculate combined bbox and center
          const { bbox, center } = computeBboxAndCenter(featureCollections);

          // console.log(layers);

          // 3. Create the workspace with calculated bounds
          const newActiveWorkspace: Interface__ActiveWorkspace = {
            ...workspace,
            layers: layers.map((layer) => ({
              ...layer,
              visible: true, // Set all layers visible by default
            })),
            bbox: bbox || [],
            bbox_center: center || [],
            visible: true,
          };

          loadWorkspace(newActiveWorkspace);
        },
        onError: () => {
          setChecked(false);
        },
      },
    });
  }

  // Handle load/unload on toggled
  useEffect(() => {
    if (checked && !workspaceActive) {
      setTimeout(() => {
        onLoad();
      }, 1); // flushsync error fix trick
    } else if (!checked && workspaceActive) {
      unloadWorkspace(workspace.id);
    }
  }, [checked]);

  // Handle toggle on load/unload
  useEffect(() => {
    if (empty(activeWorkspace(workspace.id)?.layers)) setChecked(false);
  }, [activeWorkspaces]);

  return (
    <Tooltip content={"Toggle load workspace"}>
      <HStack px={2} justify={"center"} {...restProps}>
        <Switch
          colorPalette={themeConfig.colorPalette}
          checked={checked}
          onCheckedChange={(e) => {
            setChecked(e.checked);
          }}
          disabled={loading}
        />
      </HStack>
    </Tooltip>
  );
};

// Item variants
const RowItem = (props: any) => {
  // Props
  const { workspace, setWorkspace, workspaceActive, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      key={workspace.id}
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
          key={workspace?.thumbnail?.[0]?.file_url}
          src={workspace?.thumbnail?.[0]?.file_url}
          aspectRatio={16 / 10}
        />

        <HStack align={"stretch"} gap={0} p={2}>
          <CContainer p={1} gap={1}>
            <PopoverRoot>
              <PopoverTrigger asChild>
                <P fontWeight={"semibold"} w={"fit"} lineClamp={1}>
                  {workspace?.title}
                </P>
              </PopoverTrigger>

              <PopoverContent p={2} minW={"fit"} w={"fit"} maxW={"280px"}>
                {workspace?.title}
              </PopoverContent>
            </PopoverRoot>

            <PopoverRoot>
              <PopoverTrigger asChild>
                <P lineClamp={1} color={"fg.subtle"} w={"fit"}>
                  {workspace?.description}
                </P>
              </PopoverTrigger>

              <PopoverContent p={2} minW={"fit"} w={"fit"} maxW={"280px"}>
                {workspace?.description}
              </PopoverContent>
            </PopoverRoot>
          </CContainer>

          <WorkspaceMenu
            workspace={workspace}
            setWorkspace={setWorkspace}
            size={"xs"}
          />
        </HStack>
      </CContainer>

      <WorkspaceLayersUtils
        workspace={workspace}
        workspaceActive={workspaceActive}
      />
    </CContainer>
  );
};
const ListItem = (props: any) => {
  // Props
  const { workspace, setWorkspace, workspaceActive, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      borderRadius={themeConfig.radii.container}
      border={"1px solid"}
      borderColor={"border.muted"}
      bg={"body"}
      {...restProps}
    >
      <HStack p={1} justify={"space-between"}>
        <HStack truncate px={2}>
          <PopoverRoot>
            <PopoverTrigger asChild>
              <P fontWeight={"semibold"} lineClamp={1}>
                {workspace?.title}
              </P>
            </PopoverTrigger>

            <PopoverContent>
              <P>{workspace?.title}</P>
            </PopoverContent>
          </PopoverRoot>
        </HStack>

        <WorkspaceMenu workspace={workspace} setWorkspace={setWorkspace} />
      </HStack>

      <WorkspaceLayersUtils
        workspace={workspace}
        workspaceActive={workspaceActive}
      />
    </CContainer>
  );
};

const WorkspaceItem = (props: any) => {
  // Props
  const { initialData, ...restProps } = props;

  // Contexts
  const displayMode = useWorkspaceDisplay((s) => s.displayMode);

  // States
  const [workspace, setWorkspace] = useState<any>(initialData);
  const workspaceActive = useActiveWorkspaces((s) =>
    s.workspaceActive(workspace?.id)
  );

  // Handle initialData
  useEffect(() => {
    setWorkspace(initialData);
  }, [initialData]);

  return (
    <>
      {displayMode === "rows" ? (
        <RowItem
          workspace={workspace}
          setWorkspace={setWorkspace}
          workspaceActive={workspaceActive}
          {...restProps}
        />
      ) : (
        <ListItem
          workspace={workspace}
          setWorkspace={setWorkspace}
          workspaceActive={workspaceActive}
          {...restProps}
        />
      )}
    </>
  );
};

export default WorkspaceItem;
