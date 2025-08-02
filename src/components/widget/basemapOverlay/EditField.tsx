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

const EXCLUDED_KEYS = ["id", "layer_id", "document_ids"];

export const EditField = (props: any) => {
  // Props
  const { data, setData, selectedPolygon, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-${data?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud-field",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const updateActiveLayerData = useActiveWorkspaces((s) => s.updateLayerData);

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
  const [existingDocs, setExistingDocs] = useState<any[]>(data?.thumbnail);
  const finalData = Object.fromEntries(
    Object.entries(data).filter(([key]) => !EXCLUDED_KEYS.includes(key))
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
      ...finalData,
      ...(withExplanation ? withExplanationValues : {}),
      docs: undefined as any,
      deleted_docs: [],
    },
    validationSchema: yup.object().shape({
      docs: fileValidation({
        allowedExtensions: ["pdf", "doc", "docx"],
      }),
    }),
    onSubmit: (values) => {
      // console.log(values);
      back();

      const explanationProperties = {
        PARAPIHAKB: values?.PARAPIHAKB,
        PERMASALAH: values?.PERMASALAH,
        TINDAKLANJ: values?.TINDAKLANJ,
        HASIL: values?.HASIL,
      };
      const newProperties = {
        id: propertiesId,
        ...(withExplanation ? explanationProperties : {}),
      };
      const payload = new FormData();
      payload.append("layer_id", `${layerId}`);
      payload.append("table_name", `${tableName}`);
      if (Array.isArray(values.docs)) {
        values.docs.forEach((file: any) => {
          payload.append(`document`, file);
        });
      } else if (values.docs) {
        payload.append("document", values.docs);
      }
      payload.append("properties", JSON.stringify(newProperties));
      const url = `/api/gis-bpn/workspaces-layers/update-field`;
      const config = {
        url,
        method: "PATCH",
        data: payload,
      };

      // new geojson
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
            };
          }
          return feature;
        }),
      };
      const newData = {
        ...selectedPolygon?.activeLayer?.data,
        geojson: newGeojson,
      };

      req({
        config,
        onResolve: {
          onSuccess: () => {
            if (workspaceId && layerId) {
              updateActiveLayerData(workspaceId, layerId, newData);
            }
            setData(newProperties);
          },
        },
      });
    },
  });

  // Handle initial values
  useEffect(() => {
    Object.keys(data).forEach((key) => {
      formik.setFieldValue(key, data[key]);
    });
  }, [data]);

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
                {/* information tab */}
                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="information"
                >
                  {l.information}
                </Tabs.Trigger>

                {/* explanation tab */}
                {withExplanation && (
                  <Tabs.Trigger
                    flex={1}
                    justifyContent={"center"}
                    value="explanation"
                  >
                    {l.explanation}
                  </Tabs.Trigger>
                )}
                {/* document tab */}
                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="document"
                >
                  {l.document}
                </Tabs.Trigger>
              </Tabs.List>

              {/* information content */}
              <Tabs.Content value="information" px={4}>
                <SimpleGrid columns={[1, null, 2]} gap={4}>
                  {!empty(data) &&
                    Object.keys(data).map((key) => {
                      return (
                        !EXCLUDED_KEYS.includes(key) && (
                          <Field
                            key={key}
                            readOnly
                            label={key}
                            // invalid={!!formik.errors?.[key]}
                            // errorText={formik.errors?.[key] as string}
                          >
                            <StringInput
                              // onChangeSetter={(input) => {
                              //   formik.setFieldValue(key, input);
                              // }}
                              inputValue={data[key]}
                            />
                          </Field>
                        )
                      );
                    })}
                </SimpleGrid>
              </Tabs.Content>

              {/* explanation content */}
              {withExplanation && (
                <Tabs.Content value="explanation" px={4}>
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

              {/* document content */}
              <Tabs.Content value="document" px={4}>
                <Field
                  label={l.document}
                  invalid={!!formik.errors.docs}
                  errorText={formik.errors.docs as string}
                >
                  {!empty(existingDocs) && (
                    <CContainer>
                      {existingDocs?.map((item: any, i: number) => {
                        return (
                          <ExistingFileItem
                            key={i}
                            data={item}
                            onDelete={() => {
                              setExistingDocs((prev) =>
                                prev.filter((f) => f !== item)
                              );
                              formik.setFieldValue("deleted_docs", [
                                ...formik.values.deleted_docs,
                                item,
                              ]);
                            }}
                          />
                        );
                      })}
                    </CContainer>
                  )}

                  {empty(existingDocs) && (
                    <FileInput
                      dropzone
                      name="docs"
                      onChangeSetter={(input) => {
                        formik.setFieldValue("docs", input);
                      }}
                      inputValue={formik.values.docs}
                      accept=".pdf, .doc, .docx"
                      maxFiles={5}
                    />
                  )}

                  {!empty(formik.values.deleted_docs) && (
                    <CContainer gap={2} mt={2}>
                      <P color={"fg.muted"}>{l.deleted_docs}</P>

                      {formik.values.deleted_docs?.map(
                        (item: any, i: number) => {
                          return (
                            <ExistingFileItem
                              key={i}
                              data={item}
                              withDeleteButton={false}
                              withUndobutton
                              onUndo={() => {
                                setExistingDocs((prev) => [...prev, item]);

                                formik.setFieldValue(
                                  "deleted_docs",
                                  formik.values.deleted_docs.filter(
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
              </Tabs.Content>
            </Tabs.Root>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              colorPalette={themeConfig.colorPalette}
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
