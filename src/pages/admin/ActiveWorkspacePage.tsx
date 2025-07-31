import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import SearchInput from "@/components/ui-custom/SearchInput";
import { AccordionRoot } from "@/components/ui/accordion";
import ActiveWorkspaceListItem from "@/components/widget/ActiveWorkspaceListItem";
import PageContainer from "@/components/widget/PageContainer";
import { Interface__Workspace } from "@/constants/interfaces";
import { R_GAP } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import empty from "@/utils/empty";
import { HStack } from "@chakra-ui/react";
import { IconFoldersOff } from "@tabler/icons-react";
import { useState } from "react";

const ActiveWorkspacePage = () => {
  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const sortedActiveWorkspaces = [...activeWorkspaces].sort(
    (a, b) => a.zIndex - b.zIndex
  );

  console.log(sortedActiveWorkspaces);

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

        {empty(filteredActiveWorkspaces) && (
          <FeedbackNoData
            icon={<IconFoldersOff />}
            title={l.no_active_workspaces.title}
            description={l.no_active_workspaces.description}
          />
        )}

        {!empty(filteredActiveWorkspaces) && (
          <AccordionRoot multiple>
            {filteredActiveWorkspaces.map((activeWorkspace) => {
              return (
                <ActiveWorkspaceListItem
                  key={activeWorkspace.id}
                  activeWorkspace={activeWorkspace}
                />
              );
            })}
          </AccordionRoot>
        )}
      </CContainer>
    </PageContainer>
  );
};

export default ActiveWorkspacePage;
