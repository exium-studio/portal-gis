import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import P from "@/components/ui-custom/P";
import SearchInput from "@/components/ui-custom/SearchInput";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import PageContainer from "@/components/widget/PageContainer";
import { Interface__Workspace } from "@/constants/interfaces";
import { R_GAP } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import empty from "@/utils/empty";
import { HStack, Icon } from "@chakra-ui/react";
import { IconFolders, IconFoldersOff } from "@tabler/icons-react";
import { useState } from "react";

const ActiveWorkspacePage = () => {
  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);

  // States
  const [filterConfig, setFilterConfig] = useState<any>({
    search: "",
  });
  const filteredActiveWorkspaces = activeWorkspaces?.filter(
    (workspace: Interface__Workspace) => {
      const searchTerm = filterConfig?.search?.toLowerCase();
      const titleTerm = workspace?.title?.toLowerCase();
      const titleMatch = titleTerm?.includes(searchTerm);
      const layerNameMatch = workspace?.layers?.some((layer) =>
        layer?.name?.toLowerCase()?.includes(searchTerm)
      );

      if (searchTerm) return titleMatch || layerNameMatch;

      return activeWorkspaces;
    }
  );
  return (
    <PageContainer gap={R_GAP} pb={4} flex={1}>
      {empty(filteredActiveWorkspaces) && (
        <FeedbackNoData
          icon={<IconFoldersOff />}
          title={l.no_active_workspaces.title}
          description={l.no_active_workspaces.description}
        />
      )}

      {!empty(filteredActiveWorkspaces) && (
        <CContainer flex={1} gap={4}>
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
            </HStack>
          </ItemHeaderContainer>

          <AccordionRoot multiple>
            {filteredActiveWorkspaces.map((workspace, i) => {
              return (
                <AccordionItem key={i} value={workspace.id.toString()}>
                  <AccordionItemTrigger>
                    <HStack px={1}>
                      <Icon boxSize={5}>
                        <IconFolders stroke={1.5} />
                      </Icon>
                      <P fontWeight={"semibold"}>{workspace.title}</P>
                    </HStack>
                  </AccordionItemTrigger>

                  <AccordionItemContent></AccordionItemContent>
                </AccordionItem>
              );
            })}
          </AccordionRoot>
        </CContainer>
      )}
    </PageContainer>
  );
};

export default ActiveWorkspacePage;
