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
import NumberInput from "@/components/ui-custom/NumberInput";
import SearchInput from "@/components/ui-custom/SearchInput";
import StringInput from "@/components/ui-custom/StringInput";
import Textarea from "@/components/ui-custom/Textarea";
import { Field } from "@/components/ui/field";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import PageContainer from "@/components/widget/PageContainer";
import SelectWorkspaceCategory from "@/components/widget/SelectWorkspaceCategory";
import WorkspaceItem from "@/components/widget/WorkspaceItem";
import { useAlerts } from "@/context/useAlerts";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useWorkspaceDisplay from "@/context/useWorkspaceDisplay";
import useBackOnClose from "@/hooks/useBackOnClose";
import useDataState from "@/hooks/useDataState";
import useRequest from "@/hooks/useRequest";
import back from "@/utils/back";
import empty from "@/utils/empty";
import { isRoleViewer } from "@/utils/role";
import { fileValidation } from "@/utils/validationSchemas";
import {
  AlertRoot,
  AlertTitle,
  FieldsetRoot,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconAlertCircle,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconLayoutBottombar,
  IconLayoutList,
  IconPlus,
} from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

const Create = () => {
  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`create-workspace`, open, onOpen, onClose);
  const { req } = useRequest({
    id: "crud_workspace",
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
      workspace_category: yup.array().required(l.required_form),
      thumbnail: fileValidation({
        allowedExtensions: ["jpg", "jpeg", "png"],
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
        disabled={isRoleViewer()}
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
            <form id="create_workspace" onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={l.title}
                  invalid={!!formik.errors.title}
                  errorText={formik.errors.title as string}
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

                <Field
                  label={l.workspace_category}
                  invalid={!!formik.errors.workspace_category}
                  errorText={formik.errors.workspace_category as string}
                >
                  <SelectWorkspaceCategory
                    onConfirm={(input) => {
                      formik.setFieldValue("workspace_category", input);
                    }}
                    inputValue={formik.values.workspace_category}
                  />
                </Field>

                <Field
                  optional
                  label={"Thumbnail"}
                  invalid={!!formik.errors.thumbnail}
                  errorText={formik.errors.thumbnail as string}
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
              </FieldsetRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <BButton
              type="submit"
              form="create_workspace"
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
const Workspaces = (props: any) => {
  // Props
  const { dataState } = props;
  const { data, limit, setLimit, page, setPage, pagination } = dataState;

  // Hooks
  const { l } = useLang();

  // Contexts
  const { themeConfig } = useThemeConfig();
  const layout = useLayout((s) => s.layout);

  // States
  const layoutHalfMap = layout.id === 1;

  return (
    <CContainer flex={1}>
      <SimpleGrid columns={layoutHalfMap ? 1 : [1, null, 2, 4]} gap={2}>
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

      <HStack mt={"auto"} pt={4} justify={"space-between"}>
        {/* Limit */}
        <MenuRoot>
          <MenuTrigger asChild>
            <BButton unclicky variant={"ghost"} size={"xs"}>
              {l.show} {limit !== Infinity ? limit : l.all}
              <Icon>
                <IconChevronDown />
              </Icon>
            </BButton>
          </MenuTrigger>

          <MenuContent>
            <MenuItem
              color={limit === 10 ? themeConfig.primaryColor : ""}
              value="10"
              onClick={() => setLimit(10)}
            >
              10
              {limit === 10 && (
                <Icon ml={"auto"} boxSize={4}>
                  <IconCheck />
                </Icon>
              )}
            </MenuItem>
            <MenuItem
              color={limit === 50 ? themeConfig.primaryColor : ""}
              value="50"
              onClick={() => setLimit(50)}
            >
              50
              {limit === 50 && (
                <Icon ml={"auto"} boxSize={4}>
                  <IconCheck />
                </Icon>
              )}
            </MenuItem>
            <MenuItem
              color={limit === 100 ? themeConfig.primaryColor : ""}
              value="100"
              onClick={() => setLimit(100)}
            >
              100
              {limit === 100 && (
                <Icon ml={"auto"} boxSize={4}>
                  <IconCheck />
                </Icon>
              )}
            </MenuItem>
            <MenuItem
              color={limit === Infinity ? themeConfig.primaryColor : ""}
              value="Infinity"
              onClick={() => setLimit(Infinity)}
            >
              Semua
              {limit === Infinity && (
                <Icon ml={"auto"} boxSize={4}>
                  <IconCheck />
                </Icon>
              )}
            </MenuItem>
          </MenuContent>
        </MenuRoot>

        {/* Pagination */}
        <HStack gap={0}>
          <BButton
            iconButton
            size={"xs"}
            variant={"ghost"}
            disabled={page === 1}
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
          >
            <Icon>
              <IconChevronLeft />
            </Icon>
          </BButton>

          <NumberInput
            w={"40px"}
            textAlign={"center"}
            size={"xs"}
            fontSize={"14px"}
            border={"none"}
            inputValue={page}
            onChangeSetter={(input) => setPage(input)}
          />

          <BButton
            iconButton
            size={"xs"}
            variant={"ghost"}
            disabled={page === pagination?.meta?.last_page}
            onClick={() => {
              if (page < pagination?.meta?.last_page) {
                setPage(page + 1);
              }
            }}
          >
            <Icon>
              <IconChevronRight />
            </Icon>
          </BButton>
        </HStack>
      </HStack>
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

const WorkspaceAlert = (props: any) => {
  // Props
  const { alertKey } = props;

  // Contexts
  const { l } = useLang();
  const { alerts, initAlert, hideAlert } = useAlerts();

  // handle init
  useEffect(() => {
    initAlert(alertKey);
  }, []);

  if (!alerts[alertKey]) return null;

  return (
    <AlertRoot status="warning" p={2}>
      <CContainer>
        <HStack align={"start"} gap={4} p={2}>
          <Icon boxSize={5}>
            <IconAlertCircle stroke={1.5} />
          </Icon>
          <AlertTitle>
            {l.disable_action_when_there_is_workspace_active}
          </AlertTitle>
        </HStack>

        <BButton
          size="xs"
          variant="ghost"
          colorPalette="orange"
          w="fit"
          ml="auto"
          onClick={() => hideAlert(alertKey)}
        >
          {l.hide}
        </BButton>
      </CContainer>
    </AlertRoot>
  );
};

const WorkspacePage = () => {
  // Contexts
  const { alerts, showAlert } = useAlerts();

  // States
  const [filterConfig, setFilterConfig] = useState<any>({
    search: "",
  });
  const dataState = useDataState<any>({
    url: `/api/gis-bpn/workspaces/index`,
    method: "GET",
    payload: {
      search: filterConfig.search,
    },
    initialLimit: 10,
    dependencies: [filterConfig],
  });
  const { data, initialLoading, error, makeRequest } = dataState;
  const render = {
    loading: <ComponentSpinner />,
    error: <FeedbackRetry onRetry={makeRequest} />,
    empty: <FeedbackNoData />,
    loaded: <Workspaces dataState={dataState} />,
  };
  const alertKey = "hide_show_disable_active_workspace_actions_alert";

  return (
    <PageContainer flex={1}>
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

          {!alerts[alertKey] && (
            <BButton
              iconButton
              variant="outline"
              onClick={() => showAlert(alertKey)}
            >
              <Icon boxSize={5}>
                <IconAlertCircle stroke={1.5} />
              </Icon>
            </BButton>
          )}

          <ToggleDisplay />

          <Create />
        </HStack>

        <WorkspaceAlert alertKey={alertKey} />

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
    </PageContainer>
  );
};

export default WorkspacePage;
