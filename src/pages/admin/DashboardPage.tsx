import FeedbackNoData from "@/components/ui-custom/FeedbackNoData";
import PageContainer from "@/components/widget/PageContainer";
import { R_GAP } from "@/constants/sizes";

const DashboardPage = () => {
  return (
    <PageContainer gap={R_GAP} pb={4} flex={1}>
      <FeedbackNoData />
      {/* <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <FundMutationLineChart flex={"1 1 650px"} />
        <IncomeSourceDonutChart flex={"1 1 300px"} />

        <ExpenseCategoryDonutChart flex={"1 1 300px"} />

        <PopulationGrowthLineChart flex={"1 1 650px"} />
        <CurrentPopulationDonutChart flex={"1 1 300px"} />
      </HStack> */}
    </PageContainer>
  );
};

export default DashboardPage;
