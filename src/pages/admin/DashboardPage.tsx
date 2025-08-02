import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import PageContainer from "@/components/widget/PageContainer";
import { R_GAP } from "@/constants/sizes";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useLang from "@/context/useLang";
import { IconFoldersOff } from "@tabler/icons-react";

// Hardcoded Dashboard
// HGU_AREA_PERCENTAGE each TIPEHAK sum the LUASPETA
// HGU_COUNT calculate percentage each TIPEHAK
// HGU_AREA_BY_KABUPATEN each KABUPATEN sum the LUASPETA wich has TIPEHAK value

// TODO dev the dashboard

const RightsTypeAreaPercentage = () => {
  return <></>;
};

const DashboardPage = () => {
  // Hooks
  const { l } = useLang();

  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);

  // States

  console.log("activeWorkspaces", activeWorkspaces);

  return (
    <PageContainer gap={R_GAP} pb={4} flex={1}>
      <FeedbackNoData
        icon={<IconFoldersOff />}
        title={l.no_active_workspaces.title}
        description={l.no_active_workspaces.description}
      />
    </PageContainer>
  );
};

export default DashboardPage;
