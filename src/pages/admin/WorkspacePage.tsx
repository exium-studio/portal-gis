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
import FileInput from "@/components/ui-custom/FileInput";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import SearchInput from "@/components/ui-custom/SearchInput";
import StringInput from "@/components/ui-custom/StringInput";
import Textarea from "@/components/ui-custom/Textarea";
import { Field } from "@/components/ui/field";
import { Tooltip } from "@/components/ui/tooltip";
import PageContainer from "@/components/widget/PageContainer";
import WorkspaceItem from "@/components/widget/WorkspaceItem";
import { dummyWorkspaces } from "@/constants/dummyData";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useWorkspaceDisplay from "@/context/useWorkspaceDisplay";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import { fileValidation } from "@/utils/validationSchemas";
import {
  FieldsetRoot,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconLayoutBottombar,
  IconLayoutList,
  IconPlus,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
import * as yup from "yup";

const Create = () => {
  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`edit-workspace`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud-workspace",
  });

  // Contexts
  const { themeConfig } = useThemeConfig();
  const setRt = useRenderTrigger((s) => s.setRt);

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      workspace_category: undefined as any,
      thumbnail: undefined as any,
      title: "",
      description: "",
    },
    validationSchema: yup.object().shape({
      // workspace_category: yup.array().required(l.required_form),
      thumbnail: fileValidation({
        allowedExtensions: ["jpg", "jpeg", "png"],
      }).required(l.required_form),
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
      if (values.thumbnail && values.thumbnail?.length > 0) {
        values.thumbnail.forEach((file: File) => {
          payload.append("thumbnail", file);
        });
      }
      payload.append("title", values.title);
      payload.append("description", values.description);

      const url = `/api/gis-bpn/workspaces/create`;
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
            <DisclosureHeaderContent title={`${l.add} Workspace`} />
          </DisclosureHeader>

          <DisclosureBody>
            <FieldsetRoot>
              <form id="add_workspace_form" onSubmit={formik.handleSubmit}>
                <Field
                  label={"Thumbnail"}
                  invalid={!!formik.errors.thumbnail}
                  errorText={formik.errors.thumbnail as string}
                  mb={4}
                >
                  <FileInput
                    dropzone
                    name="thumbnail"
                    onChangeSetter={(input) => {
                      formik.setFieldValue("thumbnail", input);
                    }}
                    inputValue={formik.values.thumbnail}
                    accept=".png, .jpg, .jpeg,"
                  />
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
              form="add_workspace_form"
            >
              {l.add}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
const Data = (props: any) => {
  // Props
  const { dataState } = props;
  const { data } = dataState;

  // Contexts
  const layout = useLayout((s) => s.layout);

  // States
  const layoutHalfMap = layout.id === 1;

  return (
    <CContainer>
      <SimpleGrid columns={layoutHalfMap ? 1 : [1, null, 2, 4]} gap={4}>
        {data?.map((item: any) => {
          return (
            <WorkspaceItem
              key={item?.id}
              initialData={item}
              flex={"1 1 300px"}
            />
          );
        })}
      </SimpleGrid>
    </CContainer>
  );
};
const ToggleDisplay = (props: any) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const displayMode = useWorkspaceDisplay((s) => s.displayMode);
  const toggleDisplayMode = useWorkspaceDisplay((s) => s.toggleDisplayMode);

  return (
    <Tooltip content={"Toggle display"}>
      <BButton
        iconButton
        onClick={toggleDisplayMode}
        variant={"outline"}
        {...restProps}
      >
        <Icon>
          {displayMode === "rows" ? (
            <IconLayoutBottombar stroke={1.5} />
          ) : (
            <IconLayoutList stroke={1.5} />
          )}
        </Icon>
      </BButton>
    </Tooltip>
  );
};

const WorkspacePage = () => {
  // States
  const [filterConfig, setFilterConfig] = useState<any>({
    search: "",
  });
  const dataState = useDataState<any>({
    // TODO wait BE
    // url: `/api/gis-bpn/workspaces/index`,
    method: "GET",
    payload: {
      search: filterConfig.search,
    },
    initialLimit: 4,
    initialData: dummyWorkspaces,
    dependencies: [filterConfig],
  });
  const { data, initialLoading, error, makeRequest } = dataState;
  const render = {
    loading: <ComponentSpinner />,
    error: <FeedbackRetry onRetry={makeRequest} />,
    empty: <FeedbackNoData />,
    loaded: <Data dataState={dataState} />,
  };

  return (
    <PageContainer flex={1}>
      <ItemContainer
        flex={1}
        overflowY={"auto"}
        border={"none"}
        p={[null, null, 4]}
        gap={4}
        bg={["", null, "body"]}
      >
        <ItemHeaderContainer borderless p={0}>
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

            <ToggleDisplay />

            <Create />
          </HStack>
        </ItemHeaderContainer>

        {initialLoading && render.loading}
        {!initialLoading && (
          <>
            {error && render.error}
            {!error && (
              <>
                {data && render.loaded}

                {!data && render.empty}
              </>
            )}
          </>
        )}
      </ItemContainer>
    </PageContainer>
  );
};

export default WorkspacePage;
