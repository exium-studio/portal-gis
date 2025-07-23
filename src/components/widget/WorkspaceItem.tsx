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
import { FieldsetRoot, HStack, Icon, useDisclosure } from "@chakra-ui/react";
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
import useRenderTrigger from "@/context/useRenderTrigger";
import { OPTIONS_LAYER_FILE_TYPE } from "@/static/selectOptions";
import Textarea from "../ui-custom/Textarea";
import StringInput from "../ui-custom/StringInput";
import ExistingFileItem from "./ExistingFIleItem";

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
    SHP: `/api/gis-bpn/workspace-layers/upload-shapefile`,
    GeoJSON: ``,
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
        allowedExtensions: [".shp", ".zip"],
      }).required(l.required_form),
    }),
    onSubmit: (values) => {
      // console.log(values);

      back();

      const payload = new FormData();
      payload.append("docs", values.docs);
      const url =
        URL[values.layerFileType?.[0]?.label as keyof typeof URL] || `SHP`;
      const config = {
        url,
        method: "PATCH",
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
const EditWorkspace = (props: any) => {
  // Props
  const { data } = props;

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

  return (
    <>
      <Tooltip content={l.edit_workspace}>
        <BButton
          unclicky
          iconButton
          variant={"ghost"}
          size={"sm"}
          onClick={onOpen}
        >
          <Icon>
            <IconEdit />
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
const DeleteWorkspace = (props: any) => {
  // Props
  const { data } = props;

  // Hooks
  const { l } = useLang();
  const { req } = useRequest({
    id: "crud_workspace",
  });

  // Contexts
  const setRt = useRenderTrigger((s) => s.setRt);
  const { setConfirmationData, confirmationOnOpen } =
    useConfirmationDisclosure();

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
        size={"sm"}
        onClick={() => {
          setConfirmationData({
            title: `${l.delete_workspace} <b>${data?.title}</b>`,
            description: l.perma_delete_confirmation,
            confirmLabel: "Delete",
            confirmButtonProps: { colorPalette: "red" },
            onConfirm: onDelete,
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
