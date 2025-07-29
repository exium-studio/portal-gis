import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useWorkspaceDetail from "@/context/useWorkspaceDetail";
import useBackOnClose from "@/hooks/useBackOnClose";
import empty from "@/utils/empty";
import { HStack, Icon } from "@chakra-ui/react";
import { IconEdit, IconStack, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import BackButton from "../ui-custom/BackButton";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import FeedbackNoData from "../ui-custom/FeedbackNoData";
import Img from "../ui-custom/Img";
import P from "../ui-custom/P";
import SearchInput from "../ui-custom/SearchInput";
import { Interface__Layer } from "@/constants/interfaces";

const WorkspaceDetailGlobalDisclosure = () => {
  // Hooks
  const { l } = useLang();
  const workspace = useWorkspaceDetail((s) => s.data);
  const open = useWorkspaceDetail((s) => s.open);
  const onOpen = useWorkspaceDetail((s) => s.onOpen);
  const onClose = useWorkspaceDetail((s) => s.onClose);
  useBackOnClose(`workspace-detail`, open, onOpen, onClose);

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const layers = workspace?.layers;
  const layersOnly = workspace?.layersOnly;
  const [search, setSearch] = useState<string>("");
  const filteredLayers = layers?.filter((layer: Interface__Layer) => {
    const searchTerm = search?.toLowerCase();
    const nameTerm = layer?.name?.toLowerCase();

    if (searchTerm) return nameTerm?.includes(searchTerm);

    return layers;
  });

  return (
    <DisclosureRoot open={open} lazyLoad size={"xs"} scrollBehavior={"inside"}>
      <DisclosureContent>
        <DisclosureHeader>
          <DisclosureHeaderContent
            title={layersOnly ? "Workspace Layers" : l.workspace_detail}
          />
        </DisclosureHeader>

        <DisclosureBody p={"0 !important"}>
          {!layersOnly && (
            <>
              <Img
                src={workspace?.thumbnail?.[0]?.file_url}
                aspectRatio={16 / 10}
                w={"full"}
              />

              <CContainer p={4} gap={1}>
                <P fontWeight={"semibold"}>{workspace?.title}</P>

                <P color={"fg.subtle"}>{workspace?.description}</P>
              </CContainer>
            </>
          )}

          <CContainer
            px={4}
            py={4}
            borderTop={layersOnly ? "" : "1px solid"}
            borderColor={"border.muted"}
            gap={2}
          >
            {!layersOnly && (
              <HStack>
                <Icon color={"fg.muted"}>
                  <IconStack stroke={1.5} />
                </Icon>

                <P fontWeight={"semibold"}>Layers</P>
              </HStack>
            )}

            <SearchInput
              onChangeSetter={(inputValue) => {
                setSearch(inputValue);
              }}
              inputProps={{
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                borderRadius: 0,
              }}
              inputValue={search}
              invalid={false}
              mb={2}
            />

            <CContainer gap={2} className="scrollY">
              {empty(filteredLayers) && <FeedbackNoData />}

              {filteredLayers && (
                <>
                  {filteredLayers?.map((layer) => {
                    return (
                      <HStack
                        key={layer.id}
                        border={"1px solid"}
                        borderColor={"border.muted"}
                        pl={3}
                        pr={1}
                        py={1}
                        borderRadius={themeConfig.radii.component}
                      >
                        <P>{layer?.name}</P>

                        <HStack gap={1} ml={"auto"}>
                          <BButton iconButton unclicky variant={"ghost"}>
                            <Icon>
                              <IconEdit stroke={1.5} />
                            </Icon>
                          </BButton>

                          <BButton iconButton unclicky variant={"ghost"}>
                            <Icon>
                              <IconTrash stroke={1.5} />
                            </Icon>
                          </BButton>
                        </HStack>
                      </HStack>
                    );
                  })}
                </>
              )}
            </CContainer>
          </CContainer>
        </DisclosureBody>

        <DisclosureFooter>
          <BackButton />
        </DisclosureFooter>
      </DisclosureContent>
    </DisclosureRoot>
  );
};

export default WorkspaceDetailGlobalDisclosure;
