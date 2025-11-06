import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FileInput from "@/components/ui-custom/FileInput";
import HScroll from "@/components/ui-custom/HScroll";
import Img from "@/components/ui-custom/Img";
import P from "@/components/ui-custom/P";
import Textarea from "@/components/ui-custom/Textarea";
import { Field } from "@/components/ui/field";
import { Interface__StorageFile } from "@/constants/interfaces";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import empty from "@/utils/empty";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { isRoleViewer, isWorkspaceCreatedBy } from "@/utils/role";
import { fileValidation } from "@/utils/validationSchemas";
import { FieldRoot, HStack, Icon, Tabs, useDisclosure } from "@chakra-ui/react";
import { IconPhoto } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import ExistingFileItem from "../ExistingFIleItem";
import PropertyValue from "../PropertyValue";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";

const EXCLUDED_KEYS = [
  "id",
  "gid",
  "layer_id",
  "sk_document",
  "document_sk_ids",
  "other_document",
  "other_document_ids",
  "deleted_docs",
  "PARAPIHAKB",
  "PERMASALAH",
  "TINDAKLANJ",
  "HASIL",
  "color",
];

const MINIMAL_KEYS = [
  { label: "Hak", value: "hak" },
  { label: "NIB", value: "nib" },
  { label: "Luas tertulis", value: "luastertul" },
  { label: "Luas peta", value: "liaspeta" },
  { label: "Pemilik", value: "pemilik" },
  { label: "Tanggal terbit", value: "tglterbith" },
  { label: "Tanggal berakhir", value: "berakhirha" },
  { label: "SK", value: "sk" },
];

const ListItemContainer = (props: any) => {
  const { children, last } = props;

  return (
    <CContainer
      borderBottom={last ? "" : "1px solid"}
      borderColor={"border.muted"}
      px={2}
      pt={2}
      pb={last ? 0 : 2}
    >
      {children}
    </CContainer>
  );
};
const InformationContent = (props: any) => {
  // Props
  const { properties, normalizeProperties, resolvedData, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);

  // States
  const [showAll, setShowAll] = useState<boolean>(false);
  const excludedKeysCount = EXCLUDED_KEYS.filter(
    (key) => properties && Object.keys(properties).includes(key)
  ).length;

  useEffect(() => {
    setShowAll(false);
  }, [selectedPolygon]);

  return (
    <CContainer {...restProps}>
      {!showAll &&
        MINIMAL_KEYS.map((key, i) => (
          <ListItemContainer
            key={key.value}
            last={i === MINIMAL_KEYS.length - 1}
          >
            <P fontWeight={"medium"} color={"fg.subtle"}>
              {key.label}
            </P>
            <PropertyValue>
              {normalizeProperties?.[key.value] || "-"}
            </PropertyValue>
          </ListItemContainer>
        ))}

      {showAll &&
        properties &&
        Object?.keys(resolvedData)?.map((key, i) => {
          const last =
            i === Object?.keys(properties)?.length - excludedKeysCount - 1;

          return (
            <ListItemContainer key={key} last={last}>
              <P fontWeight={"medium"} color={"fg.subtle"}>
                {`${key}`}
              </P>

              <PropertyValue>{`${properties?.[key] || "-"}`}</PropertyValue>
            </ListItemContainer>
          );
        })}

      <CContainer mt={4} px={"2px"}>
        <BButton
          size={"sm"}
          variant={"ghost"}
          colorPalette={"gray"}
          onClick={() => {
            setShowAll(!showAll);
          }}
        >
          {showAll ? l.show_less : l.show_all}
        </BButton>
      </CContainer>
    </CContainer>
  );
};
const ImageList = (props: any) => {
  // Props
  const { images, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`image-list`, open, onOpen, onClose);

  return (
    <>
      <BButton
        w={"full"}
        variant={"outline"}
        onClick={onOpen}
        size={"md"}
        {...restProps}
      >
        <Icon>
          <IconPhoto stroke={1.5} />
        </Icon>

        {l.view}
      </BButton>

      <DisclosureRoot open={open} lazyLoad>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${l.image}/${l.photo}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer>
              {empty(images) && <FeedbackNoData />}

              {images?.map((img: Interface__StorageFile) => {
                return <Img src={img.file_url} />;
              })}
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

export const FieldInfoEdit = (props: any) => {
  // Props
  const { properties, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { req, loading } = useRequest({
    id: "crud-field",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const updateActiveLayerData = useActiveWorkspaces((s) => s.updateLayerData);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);

  // States
  const normalizeProperties = normalizeKeys(
    selectedPolygon?.polygon?.properties as any
  );
  const workspaceId = selectedPolygon?.activeWorkspace?.id;
  const layerId = selectedPolygon?.activeLayer?.id;
  const tableName = selectedPolygon?.activeLayer?.table_name;
  const propertiesId = selectedPolygon?.polygon?.properties?.id;
  const geojson = selectedPolygon?.activeLayer?.data?.geojson;
  const featuresIndex = geojson?.features?.findIndex(
    (f: any) => f.properties?.id === propertiesId
  );
  const withExplanation = selectedPolygon?.activeLayer?.with_explanation;
  const [tabValue, setTabValue] = useState<string>("information");
  const [existingSkDocs, setExistingSkDocs] = useState<any[]>([]);
  const [deletedSkDocs, setDeletedSkDocs] = useState<any[]>([]);
  const [existingOtherDocs, setExistingOtherDocs] = useState<any[]>([]);
  const [deletedOtherDocs, setDeletedOtherDocs] = useState<any[]>([]);
  const [existingImage, setExistingImage] = useState<any[]>([]);
  const [deletedImage, setDeletedImage] = useState<any[]>([]);
  const resolvedData =
    properties &&
    Object.fromEntries(
      Object.entries(properties)
        .filter(([key]) => !EXCLUDED_KEYS.includes(key))
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
  const withExplanationValues = {
    PARAPIHAKB: "",
    PERMASALAH: "",
    TINDAKLANJ: "",
    HASIL: "",
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      ...properties,
      ...(withExplanation ? withExplanationValues : {}),
      sk_document: undefined as any,
      other_document: undefined as any,
      image: undefined as any,
    },
    validationSchema: yup.object().shape({
      sk_document: fileValidation({
        allowedExtensions: ["pdf", "doc", "docx"],
      }),
      other_document: fileValidation({
        allowedExtensions: ["pdf", "doc", "docx"],
      }),
      image: fileValidation({
        allowedExtensions: ["png", "jpg", "jpeg"],
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);
      function resetDocsInputValue() {
        resetForm();
        formik.setFieldValue("sk_document", undefined);
        setExistingSkDocs([]);
        setDeletedSkDocs([]);
        setExistingOtherDocs([]);
        setDeletedOtherDocs([]);
      }

      resetDocsInputValue();

      const explanationProperties = {
        PARAPIHAKB: values?.PARAPIHAKB,
        PERMASALAH: values?.PERMASALAH,
        TINDAKLANJ: values?.TINDAKLANJ,
        HASIL: values?.HASIL,
      };
      const { ...restNewProperties } = values;
      const newProperties = {
        id: propertiesId,
        ...restNewProperties,
        ...(withExplanation ? explanationProperties : {}),
      };
      const newPropertiesPayload = {
        id: propertiesId,
        ...(withExplanation ? explanationProperties : {}),
      };
      const payload = new FormData();
      payload.append("layer_id", `${layerId}`);
      payload.append("table_name", `${tableName}`);
      if (Array.isArray(values.sk_document)) {
        values.sk_document.forEach((file: any) => {
          payload.append(`sk_document`, file);
        });
      } else if (values.sk_document) {
        payload.append("sk_document", values.sk_document);
      }
      if (Array.isArray(values.other_document)) {
        values.other_document.forEach((file: any) => {
          payload.append(`other_document`, file);
        });
      } else if (values.other_document) {
        payload.append("other_document", values.other_document);
      }
      payload.append(
        "delete_sk_document_ids",
        JSON.stringify(deletedSkDocs?.map((d) => d?.id))
      );
      payload.append(
        "delete_other_document_ids",
        JSON.stringify(deletedOtherDocs?.map((d) => d?.id))
      );
      payload.append("properties", JSON.stringify(newPropertiesPayload));
      const url = `/api/gis-bpn/workspaces-layers/update-field`;
      const config = {
        url,
        method: "PATCH",
        data: payload,
      };

      req({
        config,
        onResolve: {
          onSuccess: (r) => {
            resetDocsInputValue();

            const newSkDocs =
              r.data.data.data.geojson.features?.[0]?.sk_document;
            const newOtherDocs =
              r.data.data.data.geojson.features?.[0]?.other_document;
            const newGeojson = {
              ...geojson,
              features: geojson?.features.map((feature: any, index: number) => {
                if (index === featuresIndex) {
                  return {
                    ...feature,
                    properties: {
                      ...feature.properties,
                      ...newProperties,
                    },
                    sk_document: newSkDocs,
                    other_document: newOtherDocs,
                  };
                }
                return feature;
              }),
            };
            const newData = {
              ...selectedPolygon?.activeLayer?.data,
              geojson: newGeojson,
            };

            if (workspaceId && layerId) {
              updateActiveLayerData(workspaceId, layerId, newData as any);
            }
            if (restNewProperties) {
              Object.keys(restNewProperties).forEach((key) => {
                formik.setFieldValue(key, restNewProperties[key]);
              });
            }
            setSelectedPolygon({
              ...selectedPolygon,
              polygon: {
                ...selectedPolygon?.polygon,
                sk_document: newSkDocs,
                other_document: newOtherDocs,
              },
            });
          },
          onError: () => {
            resetDocsInputValue();
          },
        },
      });
    },
  });

  // Handle initial values
  useEffect(() => {
    setTabValue("information");
    if (properties) {
      Object.keys(properties).forEach((key) => {
        formik.setFieldValue(key, properties[key]);
      });
    }
  }, [properties?.id]);

  // Handle initial document
  useEffect(() => {
    formik.setFieldValue("sk_document", undefined);
    setExistingSkDocs(selectedPolygon?.polygon?.sk_document || []);
    setDeletedSkDocs([]);

    formik.setFieldValue("other_document", undefined);
    setExistingOtherDocs(selectedPolygon?.polygon?.other_document || []);
    setDeletedOtherDocs([]);

    formik.setFieldValue("image", undefined);
    setExistingOtherDocs(selectedPolygon?.polygon?.image || []);
    setDeletedOtherDocs([]);
  }, [
    selectedPolygon?.polygon?.sk_document,
    selectedPolygon?.polygon?.other_document,
  ]);

  return (
    <CContainer
      key={`${selectedPolygon?.polygon?.properties?.id}-${selectedPolygon?.clickedLngLat?.lon}-${selectedPolygon?.clickedLngLat?.lat}`}
      pos={"relative"}
      overflowY={"auto"}
      {...restProps}
    >
      <Tabs.Root
        value={tabValue}
        onValueChange={(e) => setTabValue(e.value)}
        top={0}
        colorPalette={themeConfig.colorPalette}
        className="scrollY"
        pl={"6px"}
      >
        <HScroll
          className="noScroll"
          w={"full"}
          pos={"sticky"}
          top={0}
          zIndex={2}
        >
          <Tabs.List bg={"body"} minW={"max"} w={"full"}>
            {/* Porperties tab */}
            <Tabs.Trigger
              flex={1}
              minW={"fit !important"}
              justifyContent={"center"}
              value="information"
            >
              {l.properties}
            </Tabs.Trigger>

            {/* Usage tab */}
            {/* <Tabs.Trigger
              flex={1}
              minW={"fit !important"}
              justifyContent={"center"}
              value="usage"
            >
              {l.usage}
            </Tabs.Trigger> */}

            {/* Explanation tab */}
            {withExplanation && (
              <Tabs.Trigger
                flex={1}
                minW={"fit !important"}
                justifyContent={"center"}
                value="explanation"
              >
                {l.explanation}
              </Tabs.Trigger>
            )}

            {/* Document tab */}
            <Tabs.Trigger
              flex={1}
              minW={"fit !important"}
              justifyContent={"center"}
              value="document"
            >
              {l.document}
            </Tabs.Trigger>
          </Tabs.List>
        </HScroll>

        <form id="field_info_form" onSubmit={formik.handleSubmit}>
          {/* Properties content */}
          <Tabs.Content value="information" p={0}>
            <InformationContent
              properties={properties}
              normalizeProperties={normalizeProperties}
              resolvedData={resolvedData}
            />
          </Tabs.Content>

          {/* Usage content */}
          <Tabs.Content value="usage" p={0}></Tabs.Content>

          {/* Explanation content */}
          {withExplanation && (
            <Tabs.Content value="explanation" p={2}>
              <FieldRoot gap={4}>
                <Field
                  label={"Para Pihak yang Berkaitan"}
                  invalid={!!formik.errors.PARAPIHAKB}
                  errorText={formik.errors.PARAPIHAKB as string}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("PARAPIHAKB", input);
                    }}
                    inputValue={formik.values.PARAPIHAKB}
                  />
                </Field>

                <Field
                  label={"Permasalahan"}
                  invalid={!!formik.errors.PERMASALAH}
                  errorText={formik.errors.PERMASALAH as string}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("PERMASALAH", input);
                    }}
                    inputValue={formik.values.PERMASALAH}
                  />
                </Field>

                <Field
                  label={"Tindak Lanjut"}
                  invalid={!!formik.errors.TINDAKLANJ}
                  errorText={formik.errors.TINDAKLANJ as string}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("TINDAKLANJ", input);
                    }}
                    inputValue={formik.values.TINDAKLANJ}
                  />
                </Field>

                <Field
                  label={"Hasil"}
                  invalid={!!formik.errors.HASIL}
                  errorText={formik.errors.HASIL as string}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("HASIL", input);
                    }}
                    inputValue={formik.values.HASIL}
                  />
                </Field>
              </FieldRoot>
            </Tabs.Content>
          )}

          {/* Document content */}
          <Tabs.Content value="document" p={2} pb={3}>
            <FieldRoot gap={4}>
              <Field
                label={l.sk_docs}
                invalid={!!formik.errors.sk_document}
                errorText={formik.errors.sk_document as string}
              >
                {!empty(existingSkDocs) && (
                  <CContainer gap={2}>
                    {existingSkDocs?.map((item: any, i: number) => {
                      return (
                        <ExistingFileItem
                          key={i}
                          data={item}
                          onDelete={() => {
                            setExistingSkDocs((prev) =>
                              prev.filter((f) => f !== item)
                            );
                            setDeletedSkDocs((ps) => [...ps, item]);
                          }}
                        />
                      );
                    })}
                  </CContainer>
                )}

                {existingSkDocs?.length < 5 && (
                  <FileInput
                    dropzone
                    name="sk_document"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("sk_document", input);
                    }}
                    inputValue={formik.values.sk_document}
                    accept=".pdf, .doc, .docx"
                    maxFiles={5 - existingSkDocs.length}
                  />
                )}

                {!empty(deletedSkDocs) && (
                  <CContainer gap={2}>
                    <P color={"fg.muted"}>{l.deleted_sk_docs}</P>

                    {deletedSkDocs?.map((item: any, i: number) => {
                      return (
                        <ExistingFileItem
                          key={i}
                          data={item}
                          withDeleteButton={false}
                          withUndobutton
                          onUndo={() => {
                            setExistingSkDocs((prev) => [...prev, item]);

                            setDeletedSkDocs((ps) =>
                              ps.filter((f) => f != item)
                            );
                          }}
                        />
                      );
                    })}
                  </CContainer>
                )}
              </Field>

              <Field
                label={l.other_docs}
                invalid={!!formik.errors.other_document}
                errorText={formik.errors.other_document as string}
              >
                {!empty(existingOtherDocs) && (
                  <CContainer gap={2}>
                    {existingOtherDocs?.map((item: any, i: number) => {
                      return (
                        <ExistingFileItem
                          key={i}
                          data={item}
                          onDelete={() => {
                            setExistingOtherDocs((prev) =>
                              prev.filter((f) => f !== item)
                            );
                            setDeletedOtherDocs((ps) => [...ps, item]);
                          }}
                        />
                      );
                    })}
                  </CContainer>
                )}

                {existingOtherDocs?.length < 5 && (
                  <FileInput
                    dropzone
                    name="other_document"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("other_document", input);
                    }}
                    inputValue={formik.values.other_document}
                    accept=".pdf, .doc, .docx"
                    maxFiles={5 - existingOtherDocs.length}
                  />
                )}

                {!empty(deletedOtherDocs) && (
                  <CContainer gap={2} mt={2}>
                    <P color={"fg.muted"}>{l.deleted_other_docs}</P>

                    {deletedOtherDocs?.map((item: any, i: number) => {
                      return (
                        <ExistingFileItem
                          key={i}
                          data={item}
                          withDeleteButton={false}
                          withUndobutton
                          onUndo={() => {
                            setExistingOtherDocs((prev) => [...prev, item]);

                            setDeletedOtherDocs((ps) =>
                              ps.filter((f) => f != item)
                            );
                          }}
                        />
                      );
                    })}
                  </CContainer>
                )}
              </Field>

              <Field
                label={`${l.image}/${l.photo}`}
                invalid={!!formik.errors.image}
                errorText={formik.errors.image as string}
              >
                <ImageList images={selectedPolygon?.polygon?.image} />

                {!empty(existingImage) && (
                  <CContainer gap={2}>
                    {existingImage?.map((item: any, i: number) => {
                      return (
                        <ExistingFileItem
                          key={i}
                          data={item}
                          onDelete={() => {
                            setExistingImage((prev) =>
                              prev.filter((f) => f !== item)
                            );
                            setDeletedImage((ps) => [...ps, item]);
                          }}
                        />
                      );
                    })}
                  </CContainer>
                )}

                {existingImage?.length < 5 && (
                  <FileInput
                    dropzone
                    name="image"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("image", input);
                    }}
                    inputValue={formik.values.image}
                    accept=".png, .jpg, .jpeg"
                    maxFiles={5 - existingImage.length}
                  />
                )}

                {!empty(deletedImage) && (
                  <CContainer gap={2} mt={2}>
                    <P color={"fg.muted"}>{l.image_delete}</P>

                    {deletedImage?.map((item: any, i: number) => {
                      return (
                        <ExistingFileItem
                          key={i}
                          data={item}
                          withDeleteButton={false}
                          withUndobutton
                          onUndo={() => {
                            setExistingImage((prev) => [...prev, item]);

                            setDeletedImage((ps) =>
                              ps.filter((f) => f != item)
                            );
                          }}
                        />
                      );
                    })}
                  </CContainer>
                )}
              </Field>
            </FieldRoot>
          </Tabs.Content>
        </form>
      </Tabs.Root>

      {["explanation", "document"].includes(tabValue) && (
        <HStack
          justify={"end"}
          p={3}
          pb={1}
          bg={"body"}
          borderTop={"1px solid"}
          borderColor={"border.muted"}
        >
          <BButton
            type="submit"
            form="field_info_form"
            colorPalette={themeConfig.colorPalette}
            loading={loading}
            size={"sm"}
            disabled={
              isRoleViewer() ||
              !isWorkspaceCreatedBy(
                selectedPolygon?.activeWorkspace?.created_by
              )
            }
          >
            {l.save}
          </BButton>
        </HStack>
      )}
    </CContainer>
  );
};
