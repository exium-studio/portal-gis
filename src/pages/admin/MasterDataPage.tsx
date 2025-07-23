import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import PageContainer from "@/components/widget/PageContainer";
import { R_GAP } from "@/constants/sizes";

const MasterDataPage = () => {
  return (
    <PageContainer gap={R_GAP} pb={4} flex={1}>
      <FeedbackNoData />
    </PageContainer>
  );
};

export default MasterDataPage;
