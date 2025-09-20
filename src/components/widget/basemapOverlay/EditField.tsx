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
import P from "@/components/ui-custom/P";
import StringInput from "@/components/ui-custom/StringInput";
import Textarea from "@/components/ui-custom/Textarea";
import { Field } from "@/components/ui/field";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { fileValidation } from "@/utils/validationSchemas";
import { Icon, SimpleGrid, Tabs, useDisclosure } from "@chakra-ui/react";
import { IconEdit } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import ExistingFileItem from "../ExistingFIleItem";
import { isPublicUser } from "@/utils/isPublicUser";

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

export const EditField = (props: any) => {
  // Props
  const { properties, setProperties, selectedPolygon, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-${properties?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud-field",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const updateActiveLayerData = useActiveWorkspaces((s) => s.updateLayerData);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);

  // States
  const workspaceId = selectedPolygon?.activeWorkspace?.id;
  const layerId = selectedPolygon?.activeLayer?.id;
  const tableName = selectedPolygon?.activeLayer?.table_name;
  const propertiesId = selectedPolygon?.polygon?.properties?.id;
  const geojson = selectedPolygon?.activeLayer?.data?.geojson;
  const featuresIndex = geojson?.features?.findIndex(
    (f: any) => f.properties?.id === propertiesId
  );
  const withExplanation = selectedPolygon?.activeLayer?.with_explanation;
  const [existingDocs, setExistingDocs] = useState<any[]>([]);
  const [deletedDocs, setDeletedDocs] = useState<any[]>([]);
  const finalData = properties
    ? Object.fromEntries(
        Object.entries(properties)
          .filter(([key]) => !EXCLUDED_KEYS.includes(key))
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      )
    : {};
  const withExplanationValues = {
    PARAPIHAKB: "",
    PERMASALAH: "",
    TINDAKLANJ: "",
    HASIL: "",
  };
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      ...finalData,
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
        JSON.stringify(deletedDocs?.map((d) => d?.id))
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

            const newDocs = r.data.data.data.geojson.features?.[0]?.documents;
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
              updateActiveLayerData(workspaceId, layerId, newData);
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
    setExistingDocs(selectedPolygon?.polygon?.documents);
    setDeletedDocs([]);
  }, [selectedPolygon?.polygon?.documents]);

  return (
    <>
      <BButton
        iconButton
        unclicky
        size={"sm"}
        variant={"ghost"}
        onClick={onOpen}
        {...restProps}
      >
        <Icon boxSize={5}>
          <IconEdit stroke={1.5} />
        </Icon>
      </BButton>

      <DisclosureRoot
        open={open}
        lazyLoad
        size={"sm"}
        scrollBehavior={"inside"}
      >
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`Edit ${capsFirstLetterEachWord(l.field_info)}`}
            />
          </DisclosureHeader>

          <DisclosureBody pt={0} px={0} pos={"relative"}>
            <Tabs.Root
              defaultValue="information"
              top={0}
              colorPalette={themeConfig.colorPalette}
            >
              <Tabs.List
                bg={"body"}
                w={"full"}
                pos={"sticky"}
                top={0}
                zIndex={2}
              >
                {/* Information tab */}
                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="information"
                >
                  {l.information}
                </Tabs.Trigger>

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
                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="document"
                >
                  {l.document}
                </Tabs.Trigger>
              </Tabs.List>

              {/* Information content */}
              <Tabs.Content value="information" pl={4} pr={"10px"}>
                <SimpleGrid columns={[1, null, 2]} gap={4}>
                  {!empty(finalData) &&
                    Object.keys(finalData).map((key) => {
                      return (
                        !EXCLUDED_KEYS.includes(key) && (
                          <Field key={key} readOnly label={key}>
                            <StringInput inputValue={properties[key]} />
                          </Field>
                        )
                      );
                    })}
                </SimpleGrid>
              </Tabs.Content>

              {/* Explanation content */}
              {withExplanation && (
                <Tabs.Content value="explanation" pl={4} pr={"10px"}>
                  <Field
                    label={"PARAPIHAKB"}
                    invalid={!!formik.errors.PARAPIHAKB}
                    errorText={formik.errors.PARAPIHAKB as string}
                    mb={4}
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
                    mb={4}
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
                    mb={4}
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
                </Tabs.Content>
              )}

              {/* Document content */}
              <Tabs.Content value="document" pl={4} pr={"10px"}>
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

                              setDeletedDocs((ps) =>
                                ps.filter((f) => f != item)
                              );
                            }}
                          />
                        );
                      })}
                    </CContainer>
                  )}
                </Field>
              </Tabs.Content>
            </Tabs.Root>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              colorPalette={themeConfig.colorPalette}
              onClick={formik.submitForm}
              disabled={isPublicUser()}
            >
              {l.save}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
