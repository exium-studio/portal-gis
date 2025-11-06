import { HStack } from "@chakra-ui/react";
import { IconFoldersOff } from "@tabler/icons-react";
import { useMemo, useState } from "react";

import CContainer from "@/components/ui-custom/CContainer";
import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import SearchInput from "@/components/ui-custom/SearchInput";
import { AccordionRoot } from "@/components/ui/accordion";
import ActiveWorkspaceByCategoryListItem from "@/components/widget/ActiveWorkspaceByCategoryListItem";
import PageContainer from "@/components/widget/PageContainer";
import { R_GAP } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";

const ActiveWorkspacePage = () => {
  const { l } = useLang();
  const activeWorkspacesByCategory = useActiveWorkspaces(
    (s) => s.activeWorkspaces
  );

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const filteredWorkspacesByCategory = useMemo(() => {
    const lowerSearch = searchTerm?.toLowerCase() || "";

    return (
      activeWorkspacesByCategory
        ?.slice() // copy array biar nggak mutasi
        .reverse()
        .map((category) => {
          const filteredWorkspaces =
            category.workspaces?.filter((workspace) => {
              if (!lowerSearch) return true;

              const titleMatch = workspace.title
                ?.toLowerCase()
                .includes(lowerSearch);

              const layerNameMatch = workspace.layers?.some((layer) =>
                layer.name?.toLowerCase().includes(lowerSearch)
              );

              return titleMatch || layerNameMatch;
            }) || [];

          return {
            ...category,
            workspaces: filteredWorkspaces,
          };
        })
        .filter((category) => category.workspaces.length > 0) || []
    );
  }, [activeWorkspacesByCategory, searchTerm]);
  const empty = filteredWorkspacesByCategory.length === 0;
  const noActiveWorkspace = activeWorkspacesByCategory?.length === 0;

  return (
    <PageContainer gap={R_GAP} pb={4} flex={1}>
      {noActiveWorkspace && (
        <FeedbackNoData
          icon={<IconFoldersOff />}
          title={l.no_active_workspaces.title}
          description={l.no_active_workspaces.description}
        />
      )}

      {!noActiveWorkspace && (
        <CContainer flex={1} gap={4}>
          <HStack justify="space-between" w="full">
            <SearchInput
              inputValue={searchTerm}
              onChangeSetter={(input) => setSearchTerm(input)}
            />
          </HStack>

          {empty && <FeedbackNoData />}

          {!empty && (
            <AccordionRoot multiple>
              <CContainer gap={2}>
                {filteredWorkspacesByCategory.map((activeWorkspace, i) => (
                  <ActiveWorkspaceByCategoryListItem
                    key={activeWorkspace.workspace_category.id}
                    activeWorkspace={activeWorkspace}
                    index={i}
                  />
                ))}
              </CContainer>
            </AccordionRoot>
          )}
        </CContainer>
      )}
    </PageContainer>
  );
};

export default ActiveWorkspacePage;
