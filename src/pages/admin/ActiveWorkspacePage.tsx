import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import PageContainer from "@/components/widget/PageContainer";
import { R_GAP } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { IconFoldersOff } from "@tabler/icons-react";

const ActiveWorkspacePage = () => {
  // Hooks
  const { l } = useLang();

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

export default ActiveWorkspacePage;
