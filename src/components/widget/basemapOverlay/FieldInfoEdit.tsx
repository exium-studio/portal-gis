import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FileInput from "@/components/ui-custom/FileInput";
import P from "@/components/ui-custom/P";
import Textarea from "@/components/ui-custom/Textarea";
import { Field } from "@/components/ui/field";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import empty from "@/utils/empty";
import { fileValidation } from "@/utils/validationSchemas";
import { FieldRoot, HStack, Tabs, useDisclosure } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import ExistingFileItem from "../ExistingFIleItem";
import PropertyValue from "../PropertyValue";
import HScroll from "@/components/ui-custom/HScroll";

const EXCLUDED_KEYS = [
  "id",
  "layer_id",
  "document_ids",
  "deleted_docs",
  "docs",
  "deleted_docs",
  "PARAPIHAKB",
  "PERMASALAH",
  "TINDAKLANJ",
  "HASIL",
  "color",
];

const ItemContainer = (props: any) => {
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

export const FieldInfoEdit = (props: any) => {
  // Props
  const { properties, setProperties, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-${properties?.id}`, open, onOpen, onClose);
  const { req, loading } = useRequest({
    id: "crud-field",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const updateActiveLayerData = useActiveWorkspaces((s) => s.updateLayerData);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);

  // States
  const workspaceId = selectedPolygon?.activeWorkspace?.id;
  const layerId = selectedPolygon?.activeLayer?.id;
  const tableName = selectedPolygon?.activeLayer?.table_name;
  const propertiesId = selectedPolygon?.polygon?.properties?.id;
  const geojson = selectedPolygon?.activeLayer?.data?.geojson;
  const featuresIndex = geojson?.features?.findIndex(
    (f: any) => f.properties.id === propertiesId
  );
  const withExplanation = selectedPolygon?.activeLayer?.with_explanation;
  const [existingDocs, setExistingDocs] = useState<any[]>([]);
  const [deletedDocs, setDeletedDocs] = useState<any[]>([]);
  const resolvedData =
    properties &&
    Object.fromEntries(
      Object.entries(properties)
        .filter(([key]) => !EXCLUDED_KEYS.includes(key))
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
  const excludedKeysCount = EXCLUDED_KEYS.filter(
    (key) => properties && Object.keys(properties).includes(key)
  ).length;
  const withExplanationValues = {
    PARAPIHAKB: "",
    PERMASALAH: "",
    TINDAKLANJ: "",
    HASIL: "",
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      ...resolvedData,
      ...(withExplanation ? withExplanationValues : {}),
      docs: undefined as any,
    },
    validationSchema: yup.object().shape({
      docs: fileValidation({
        allowedExtensions: ["pdf", "doc", "docx"],
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);
      back();
      formik.setFieldValue("docs", undefined);

      const explanationProperties = {
        PARAPIHAKB: values?.PARAPIHAKB,
        PERMASALAH: values?.PERMASALAH,
        TINDAKLANJ: values?.TINDAKLANJ,
        HASIL: values?.HASIL,
      };
      const newProperties = {
        id: propertiesId,
        ...values,
        ...(withExplanation ? explanationProperties : {}),
      };
      const newPropertiesPayload = {
        id: propertiesId,
        ...(withExplanation ? explanationProperties : {}),
      };
      const payload = new FormData();
      payload.append("layer_id", `${layerId}`);
      payload.append("table_name", `${tableName}`);
      if (Array.isArray(values.docs)) {
        values.docs.forEach((file: any) => {
          payload.append(`file`, file);
        });
      } else if (values.docs) {
        payload.append("file", values.docs);
      }
      payload.append(
        "delete_document_ids",
        JSON.stringify(deletedDocs?.map((d) => d.id))
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
            resetForm();
            setExistingDocs([]);
            setDeletedDocs([]);

            const newDocs = r.data.data.data.geojson.features?.[0].documents;
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
                    documents: newDocs,
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
            setProperties(newProperties);
            setSelectedPolygon({
              ...selectedPolygon,
              polygon: {
                ...selectedPolygon?.polygon,
                documents: newDocs,
              },
            });
          },
        },
      });
    },
  });

  // Handle initial values
  useEffect(() => {
    if (properties) {
      Object.keys(properties).forEach((key) => {
        formik.setFieldValue(key, properties[key]);
      });
    }
  }, [properties]);

  // Handle initial docs
  useEffect(() => {
    formik.setFieldValue("docs", undefined);
    setExistingDocs(selectedPolygon?.polygon?.documents || []);
    setDeletedDocs([]);
  }, [selectedPolygon?.polygon?.documents]);

  return (
    <CContainer pos={"relative"} overflowY={"auto"} {...restProps}>
      <Tabs.Root
        defaultValue="information"
        top={0}
        colorPalette={themeConfig.colorPalette}
        className="scrollY"
      >
        <HScroll className="noScroll" pos={"sticky"} top={0} zIndex={2}>
          <Tabs.List bg={"body"} w={"max"}>
            {/* Information tab */}
            <Tabs.Trigger
              flex={1}
              justifyContent={"center"}
              value="information"
            >
              {l.information}
            </Tabs.Trigger>

            {/* Usage tab */}
            {withExplanation && (
              <Tabs.Trigger
                whiteSpace={"nowrap"}
                flex={1}
                justifyContent={"center"}
                value="area"
              >
                {l.usage}
              </Tabs.Trigger>
            )}

            {/* Explanation tab */}
            {withExplanation && (
              <Tabs.Trigger
                flex={1}
                justifyContent={"center"}
                value="explanation"
              >
                {l.explanation}
              </Tabs.Trigger>
            )}

            {/* Document tab */}
            <Tabs.Trigger flex={1} justifyContent={"center"} value="document">
              {l.document}
            </Tabs.Trigger>
          </Tabs.List>
        </HScroll>

        {/* Information content */}
        <Tabs.Content value="information" p={0} px={1}>
          {properties &&
            Object?.keys(resolvedData)?.map((key, i) => {
              const last =
                i === Object?.keys(properties)?.length - excludedKeysCount - 1;

              return (
                <ItemContainer key={key} last={last}>
                  <P fontWeight={"medium"} color={"fg.subtle"}>
                    {`${key}`}
                  </P>

                  <PropertyValue>{`${properties?.[key] || "-"}`}</PropertyValue>
                </ItemContainer>
              );
            })}
        </Tabs.Content>

        {/* Usage content */}
        <Tabs.Content value="explanation" px={3} py={2}></Tabs.Content>

        {/* Explanation content */}
        {withExplanation && (
          <Tabs.Content value="explanation" px={3} py={2}>
            <FieldRoot gap={4}>
              <Field
                label={"PARAPIHAKB"}
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
                label={"PERMASALAH"}
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
                label={"TINDAKLANJ"}
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
                label={"HASIL"}
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

            <HStack justify={"end"} mt={4}>
              <BButton
                colorPalette={themeConfig.colorPalette}
                onClick={formik.submitForm}
                loading={loading}
              >
                {l.save}
              </BButton>
            </HStack>
          </Tabs.Content>
        )}

        {/* Document content */}
        <Tabs.Content value="document" px={3} py={2}>
          <FieldRoot gap={4}>
            <Field
              label={l.document}
              invalid={!!formik.errors.docs}
              errorText={formik.errors.docs as string}
            >
              {!empty(existingDocs) && (
                <CContainer gap={2}>
                  {existingDocs?.map((item: any, i: number) => {
                    return (
                      <ExistingFileItem
                        key={i}
                        data={item}
                        onDelete={() => {
                          setExistingDocs((prev) =>
                            prev.filter((f) => f !== item)
                          );
                          setDeletedDocs((ps) => [...ps, item]);
                        }}
                      />
                    );
                  })}
                </CContainer>
              )}

              {existingDocs?.length < 5 && (
                <FileInput
                  dropzone
                  name="docs"
                  onChangeSetter={(input) => {
                    formik.setFieldValue("docs", input);
                  }}
                  inputValue={formik.values.docs}
                  accept=".pdf, .doc, .docx"
                  maxFiles={5 - existingDocs.length}
                />
              )}

              {!empty(deletedDocs) && (
                <CContainer gap={2} mt={2}>
                  <P color={"fg.muted"}>{l.deleted_docs}</P>

                  {deletedDocs?.map((item: any, i: number) => {
                    return (
                      <ExistingFileItem
                        key={i}
                        data={item}
                        withDeleteButton={false}
                        withUndobutton
                        onUndo={() => {
                          setExistingDocs((prev) => [...prev, item]);

                          setDeletedDocs((ps) => ps.filter((f) => f != item));
                        }}
                      />
                    );
                  })}
                </CContainer>
              )}
            </Field>
          </FieldRoot>

          <HStack justify={"end"} mt={4}>
            <BButton
              colorPalette={themeConfig.colorPalette}
              onClick={formik.submitForm}
              loading={loading}
            >
              {l.save}
            </BButton>
          </HStack>
        </Tabs.Content>
      </Tabs.Root>
    </CContainer>
  );
};
