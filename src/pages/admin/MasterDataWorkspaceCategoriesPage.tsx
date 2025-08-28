import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import ComponentSpinner from "@/components/ui-custom/ComponentSpinner";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import FeedbackRetry from "@/components/ui-custom/FeedbackRetry";
import SearchInput from "@/components/ui-custom/SearchInput";
import StringInput from "@/components/ui-custom/StringInput";
import TableComponent from "@/components/ui-custom/TableComponent";
import { Field } from "@/components/ui/field";
import { MenuItem } from "@/components/ui/menu";
import DeleteStatus from "@/components/widget/DeleteStatus";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import empty from "@/utils/empty";
import { FieldsetRoot, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

const Create = () => {
  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`create-workspace-category`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud_workspace_category",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      label: "",
    },
    validationSchema: yup.object().shape({
      label: yup.string().required(l.required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);

      back();

      const payload = new FormData();
      payload.append("label", values.label);

      const url = `/api/gis-bpn/master-data/categories/create`;
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
      <BButton
        iconButton
        colorPalette={themeConfig?.colorPalette}
        onClick={onOpen}
      >
        <Icon>
          <IconPlus />
        </Icon>
      </BButton>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`${l.add} ${capsFirstLetterEachWord(
                l.workspace_category
              )}`}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="create_workspace_category" onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Label"}
                  invalid={!!formik.errors.label}
                  errorText={formik.errors.label as string}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("label", input);
                    }}
                    inputValue={formik.values.label}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              type="submit"
              form="create_workspace_category"
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
const Edit = (props: any) => {
  // Props
  const { workspaceCategory } = props;

  // Hooks
  const { req } = useRequest({
    id: "crud_workspace_category",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(
    `edit-workspace-category-${workspaceCategory?.id}`,
    open,
    onOpen,
    onClose
  );

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      label: "",
    },
    validationSchema: yup.object().shape({
      label: yup.string().required(l.required_form),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log(values);

      back();

      const payload = new FormData();
      payload.append("label", values.label);

      const url = `/api/gis-bpn/master-data/categories/update/${workspaceCategory?.id}`;
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

  // Handle initial values
  useEffect(() => {
    formik.setValues({
      label: workspaceCategory?.label,
    });
  }, [workspaceCategory]);

  return (
    <>
      <MenuItem value="edit" onClick={onOpen}>
        Edit
      </MenuItem>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent
              title={`Edit ${capsFirstLetterEachWord(l.workspace_category)}`}
            />
          </DisclosureHeader>

          <DisclosureBody>
            <form id="edit_workspace_category" onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Label"}
                  invalid={!!formik.errors.label}
                  errorText={formik.errors.label as string}
                >
                  <StringInput
                    onChangeSetter={(input) => {
                      formik.setFieldValue("label", input);
                    }}
                    inputValue={formik.values.label}
                  />
                </Field>
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              type="submit"
              form="edit_workspace_category"
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
const WorkspaceCategoriesTable = (props: any) => {
  // Props
  const { dataState } = props;
  const { data, limit, setLimit, page, setPage, pagination } = dataState;

  // Hooks
  const { l } = useLang();
  const { req } = useRequest({
    id: "crud_workspace_category",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // States
  const ths = [
    {
      th: "Label",
      sortable: true,
    },
    {
      th: l.delete_status,
      sortable: true,
    },
  ];
  const tds = data?.map((item: any, i: number) => {
    return {
      id: item.id,
      index: i,
      originalData: item,
      columnsFormat: [
        {
          value: item.label,
          td: item.label,
        },
        {
          value: item.deleted_at,
          td: <DeleteStatus deletedAt={item.deleted_at} />,
          dataType: "date",
        },
      ],
    };
  });
  const rowOptions = [
    {
      label: "Edit",
      independent: true,
      component: (rowData: any) => {
        return <Edit workspaceCategory={rowData?.originalData} />;
      },
    },
    {
      label: "Restore",
      disabled: (rowData: any): boolean => {
        return !rowData.originalData.deleted_at;
      },
      confirmation: (rowData: any) => ({
        id: `${rowData.id}`,
        title: "Restore?",
        description: `${l.restore_confirmation}`,
        confirmLabel: "Restore",
        onConfirm: () => {
          back();

          const url = `/api/gis-bpn/master-data/categories/restore/${rowData.id}`;
          const config = {
            url,
            method: "PATCH",
          };

          req({
            config,
            onResolve: {
              onSuccess: () => {
                setRt((ps) => !ps);
              },
            },
          });
        },
      }),
    },
    {
      label: "Delete",
      disabled: (rowData: any) => {
        return rowData.originalData.deleted_at;
      },
      menuItemProps: {
        color: "red.400",
      },
      confirmation: (rowData: any) => ({
        id: `${rowData.id}`,
        title: "Delete?",
        description: `${l.perma_delete_confirmation}`,
        confirmLabel: "Delete",
        confirmButtonProps: {
          colorPalette: "red",
        },
        onConfirm: () => {
          back();

          const url = `/api/gis-bpn/master-data/categories/delete/${rowData.id}`;
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
        },
      }),
    },
  ];

  return (
    <TableComponent
      originalData={data}
      ths={ths}
      tds={tds}
      limitControl={limit}
      setLimitControl={setLimit}
      pageControl={page}
      setPageControl={setPage}
      pagination={pagination}
      rowOptions={rowOptions}
      borderBottom={"none"}
      borderRadius={themeConfig.radii.component}
    />
  );
};

const MasterDataWorkspaceCategoriesPage = () => {
  // States
  const [filterConfig, setFilterConfig] = useState<any>({
    search: "",
  });
  const dataState = useDataState<any>({
    url: `/api/gis-bpn/master-data/categories/index`,
    method: "GET",
    payload: {
      search: filterConfig.search,
      with_trashed: 1,
    },
    dependencies: [filterConfig],
  });
  const { data, initialLoading, error, makeRequest } = dataState;
  const render = {
    loading: <ComponentSpinner />,
    error: <FeedbackRetry onRetry={makeRequest} />,
    empty: <FeedbackNoData />,
    loaded: <WorkspaceCategoriesTable dataState={dataState} />,
  };

  return (
    <CContainer flex={1} gap={4}>
      <HStack justify={"space-between"} w={"full"}>
        <SearchInput
          onChangeSetter={(input) => {
            setFilterConfig({
              ...filterConfig,
              search: input,
            });
          }}
          inputValue={filterConfig.search}
        />

        <Create />
      </HStack>

      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {data && render.loaded}
              {(!data || empty(data)) && render.empty}
            </>
          )}
        </>
      )}
    </CContainer>
  );
};

export default MasterDataWorkspaceCategoriesPage;
