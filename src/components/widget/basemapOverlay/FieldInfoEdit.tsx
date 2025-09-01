import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import FileInput from "@/components/ui-custom/FileInput";
import HScroll from "@/components/ui-custom/HScroll";
import P from "@/components/ui-custom/P";
import Textarea from "@/components/ui-custom/Textarea";
import { Field } from "@/components/ui/field";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import empty from "@/utils/empty";
import { normalizeKeys } from "@/utils/normalizeKeys";
import { fileValidation } from "@/utils/validationSchemas";
import { FieldRoot, HStack, Tabs } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import ExistingFileItem from "../ExistingFIleItem";
import PropertyValue from "../PropertyValue";

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

export const FieldInfoEdit = (props: any) => {
  // Props
  const { properties, setProperties, ...restProps } = props;

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
    (f: any) => f.properties.id === propertiesId
  );
  const withExplanation = selectedPolygon?.activeLayer?.with_explanation;
  const [tabValue, setTabValue] = useState<string>("information");
  const [existingDocs, setExistingDocs] = useState<any[]>([]);
  const [deletedDocs, setDeletedDocs] = useState<any[]>([]);
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
    setTabValue("information");
    if (properties) {
      Object.keys(properties).forEach((key) => {
        formik.setFieldValue(key, properties[key]);
      });
    }
  }, [properties.id]);

  console.log(properties.id);

  // Handle initial docs
  useEffect(() => {
    formik.setFieldValue("docs", undefined);
    setExistingDocs(selectedPolygon?.polygon?.documents || []);
    setDeletedDocs([]);
  }, [selectedPolygon?.polygon?.documents]);

  return (
    <CContainer pos={"relative"} overflowY={"auto"} {...restProps}>
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
            {/* Information tab */}
            <Tabs.Trigger
              minW={"fit !important"}
              justifyContent={"center"}
              value="information"
            >
              {l.information}
            </Tabs.Trigger>

            {/* Usage tab */}
            <Tabs.Trigger
              minW={"fit !important"}
              justifyContent={"center"}
              value="usage"
            >
              {l.usage}
            </Tabs.Trigger>

            {/* Explanation tab */}
            {withExplanation && (
              <Tabs.Trigger
                minW={"fit !important"}
                justifyContent={"center"}
                value="explanation"
              >
                {l.explanation}
              </Tabs.Trigger>
            )}

            {/* Document tab */}
            <Tabs.Trigger
              minW={"fit !important"}
              flex={1}
              justifyContent={"center"}
              value="document"
            >
              {l.document}
            </Tabs.Trigger>
          </Tabs.List>
        </HScroll>

        {/* Information content */}
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
                size={"sm"}
              >
                {l.save}
              </BButton>
            </HStack>
          </Tabs.Content>
        )}

        {/* Document content */}
        <Tabs.Content value="document" p={2}>
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
              size={"sm"}
            >
              {l.save}
            </BButton>
          </HStack>
        </Tabs.Content>
      </Tabs.Root>
    </CContainer>
  );
};
