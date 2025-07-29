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
import { Field, useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import ExistingFileItem from "../ExistingFIleItem";

export const EditField = (props: any) => {
  // Props
  const { data, setData, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-${data?.id}`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud-field",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const updateWorkspace = useActiveWorkspaces((s) => s.updateLayerData);

  // States
  const workspaceId = selectedPolygon?.data?.workspace?.id;
  const layerId = selectedPolygon?.data?.layer?.layer_id;
  const tableName = selectedPolygon?.data?.layer?.table_name;
  const propertiesId = selectedPolygon?.polygon?.properties?.id;
  const geojson = selectedPolygon?.data?.layer?.geojson;
  const featuresIndex =
    selectedPolygon?.data?.layer?.geojson?.features.findIndex(
      (f: any) => f.properties.id === propertiesId
    );
  const [existingDocs, setExistingDocs] = useState<any[]>(data?.thumbnail);
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      propinsi: "",
      kabupaten: "",
      nib: "",
      su: "",
      hak: "",
      tipehak: "",
      luastertul: "",
      luaspeta: "",
      sk: "",
      tanggalsk: "",
      tglterbith: "",
      berakhirha: "",
      pemilik: "",
      tipepemili: "",
      gunatanahk: "",
      gunatanahu: "",
      terpetakan: "",
      keterangan: "",
      dtipehak: "",
      parapihakb: "",
      permasalah: "",
      tindaklanj: "",
      hasil: "",
      penggunaan: "",
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

      const newProperties = {
        id: propertiesId,
        propinsi: values.propinsi,
        kabupaten: values.kabupaten,
        nib: values.nib,
        su: values.su,
        hak: values.hak,
        tipehak: values.tipehak,
        luastertul: values.luastertul,
        luaspeta: values.luaspeta,
        sk: values.sk,
        tanggalsk: values.tanggalsk,
        tglterbith: values.tglterbith,
        berakhirha: values.berakhirha,
        pemilik: values.pemilik,
        tipepemili: values.tipepemili,
        gunatanahk: values.gunatanahk,
        gunatanahu: values.gunatanahu,
        terpetakan: values.terpetakan,
        keterangan: values.keterangan,
        dtipehak: values.dtipehak,
        parapihakb: values.parapihakb,
        permasalah: values.permasalah,
        tindaklanj: values.tindaklanj,
        hasil: values.hasil,
        penggunaan: values.penggunaan,
      };
      const payload = new FormData();
      payload.append("layer_id", layerId);
      payload.append("table_name", tableName);
      if (Array.isArray(values.docs)) {
        values.docs.forEach((file) => {
          payload.append(`document`, file);
        });
      } else if (values.docs) {
        payload.append("document", values.docs);
      }
      payload.append("properties", JSON.stringify(newProperties));
      const url = `/api/gis-bpn/workspace-layers/shape-files/update`;
      const config = {
        url,
        method: "PUT",
        data: payload,
      };

      // new geojson
      const newGeojson = {
        ...geojson,
        features: geojson.features.map((feature: any, index: number) => {
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

      req({
        config,
        onResolve: {
          onSuccess: () => {
            updateWorkspace(workspaceId, layerId, newGeojson);
            setData(newProperties);
          },
        },
      });
    },
  });

  // Handle initial values
  useEffect(() => {
    formik.setValues({
      propinsi: data?.propinsi,
      kabupaten: data?.kabupaten,
      nib: data?.nib,
      su: data?.su,
      hak: data?.hak,
      tipehak: data?.tipehak,
      luastertul: data?.luastertul,
      luaspeta: data?.luaspeta,
      sk: data?.sk,
      tanggalsk: data?.tanggalsk,
      tglterbith: data?.tglterbith,
      berakhirha: data?.berakhirha,
      pemilik: data?.pemilik,
      tipepemili: data?.tipepemili,
      gunatanahk: data?.gunatanahk,
      gunatanahu: data?.gunatanahu,
      terpetakan: data?.terpetakan,
      keterangan: data?.keterangan,
      dtipehak: data?.dtipehak,
      parapihakb: data?.parapihakb,
      permasalah: data?.permasalah,
      tindaklanj: data?.tindaklanj,
      hasil: data?.hasil,
      penggunaan: data?.penggunaan,
      docs: [],
      deleted_docs: [],
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
              title={`Edit ${capsFirstLetterEachWord(l.field_data)}`}
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
                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="information"
                >
                  {l.information}
                </Tabs.Trigger>

                <Tabs.Trigger
                  flex={1}
                  justifyContent={"center"}
                  value="explanation"
                >
                  {l.explanation}
                </Tabs.Trigger>

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
                {/* owner */}
                <Field
                  readOnly
                  label={l.owner}
                  invalid={!!formik.errors.pemilik}
                  errorText={formik.errors.pemilik as string}
                  mb={4}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("pemilik", input);
                    }}
                    inputValue={formik.values.pemilik}
                  />
                </Field>

                {/* owner type */}
                <Field
                  readOnly
                  label={l.owner_type}
                  invalid={!!formik.errors.tipepemili}
                  errorText={formik.errors.tipepemili as string}
                  mb={4}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("tipepemili", input);
                    }}
                    inputValue={formik.values.tipepemili}
                  />
                </Field>

                {/* usage */}
                <Field
                  readOnly
                  label={l.usage}
                  invalid={!!formik.errors.penggunaan}
                  errorText={formik.errors.penggunaan as string}
                  mb={4}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("penggunaan", input);
                    }}
                    inputValue={formik.values.penggunaan}
                  />
                </Field>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* no sertif */}
                  <Field
                    readOnly
                    label={l.sertificate_number}
                    invalid={!!formik.errors.hak}
                    errorText={formik.errors.hak as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("hak", input);
                      }}
                      inputValue={formik.values.hak}
                    />
                  </Field>

                  {/* nib */}
                  <Field
                    readOnly
                    label={"NIB"}
                    invalid={!!formik.errors.nib}
                    errorText={formik.errors.nib as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("nib", input);
                      }}
                      inputValue={formik.values.nib}
                    />
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* rights publish date */}
                  <Field
                    readOnly
                    label={l.rights_published_date}
                    invalid={!!formik.errors.tglterbith}
                    errorText={formik.errors.tglterbith as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("tglterbith", input);
                      }}
                      inputValue={formik.values.tglterbith}
                    />
                  </Field>

                  {/* rights expired date */}
                  <Field
                    readOnly
                    label={l.rights_expired_date}
                    invalid={!!formik.errors.berakhirha}
                    errorText={formik.errors.berakhirha as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("berakhirha", input);
                      }}
                      inputValue={formik.values.berakhirha}
                    />
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* map area */}
                  <Field
                    readOnly
                    label={l.map_area}
                    invalid={!!formik.errors.luaspeta}
                    errorText={formik.errors.luaspeta as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("luaspeta", input);
                      }}
                      inputValue={formik.values.luaspeta}
                    />
                  </Field>

                  {/* written area */}
                  <Field
                    readOnly
                    label={l.written_area}
                    invalid={!!formik.errors.luastertul}
                    errorText={formik.errors.luastertul as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("luastertul", input);
                      }}
                      inputValue={formik.values.luastertul}
                    />
                    {/* written area */}
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4} mb={4}>
                  {/* sk */}
                  <Field
                    readOnly
                    label={l.sk}
                    invalid={!!formik.errors.sk}
                    errorText={formik.errors.sk as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("sk", input);
                      }}
                      inputValue={formik.values.sk}
                    />
                  </Field>

                  {/* sk date */}
                  <Field
                    readOnly
                    label={l.sk_date}
                    invalid={!!formik.errors.tanggalsk}
                    errorText={formik.errors.tanggalsk as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("tanggalsk", input);
                      }}
                      inputValue={formik.values.tanggalsk}
                    />
                  </Field>
                </SimpleGrid>

                <SimpleGrid columns={[1, null, 2]} gap={4}>
                  {/* city */}
                  <Field
                    readOnly
                    label={l.city}
                    invalid={!!formik.errors.kabupaten}
                    errorText={formik.errors.kabupaten as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("kabupaten", input);
                      }}
                      inputValue={formik.values.kabupaten}
                    />
                  </Field>

                  {/* province */}
                  <Field
                    readOnly
                    label={l.province}
                    invalid={!!formik.errors.propinsi}
                    errorText={formik.errors.propinsi as string}
                  >
                    <StringInput
                      onChangeSetter={(input) => {
                        formik.setFieldValue("propinsi", input);
                      }}
                      inputValue={formik.values.propinsi}
                    />
                  </Field>
                </SimpleGrid>
              </Tabs.Content>

              {/* explanation content */}
              <Tabs.Content value="explanation" px={4}>
                <Field
                  label={l.dispute_parties}
                  invalid={!!formik.errors.parapihakb}
                  errorText={formik.errors.parapihakb as string}
                  mb={4}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("parapihakb", input);
                    }}
                    inputValue={formik.values.parapihakb}
                  />
                </Field>

                <Field
                  label={l.problems}
                  invalid={!!formik.errors.permasalah}
                  errorText={formik.errors.permasalah as string}
                  mb={4}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("permasalah", input);
                    }}
                    inputValue={formik.values.permasalah}
                  />
                </Field>

                <Field
                  label={l.handling_and_follow_up}
                  invalid={!!formik.errors.tindaklanj}
                  errorText={formik.errors.tindaklanj as string}
                  mb={4}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("tindaklanj", input);
                    }}
                    inputValue={formik.values.tindaklanj}
                  />
                </Field>

                <Field
                  label={l.result}
                  invalid={!!formik.errors.hasil}
                  errorText={formik.errors.hasil as string}
                >
                  <Textarea
                    onChangeSetter={(input) => {
                      formik.setFieldValue("hasil", input);
                    }}
                    inputValue={formik.values.hasil}
                  />
                </Field>
              </Tabs.Content>

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
