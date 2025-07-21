import CurrentPopulationDonutChart from "@/components/widget/admin/CurrentPopulationDonutChart";
import ExpenseCategoryDonutChart from "@/components/widget/admin/ExpenseCategoryDonutChart";
import FundMutationLineChart from "@/components/widget/admin/FundMutationLineChart";
import IncomeSourceDonutChart from "@/components/widget/admin/IncomeSourceDonutChart";
import PageContainer from "@/components/widget/PageContainer";
import PopulationGrowthLineChart from "@/components/widget/PopulationGrowthLineChart";
import { R_GAP } from "@/constants/sizes";
import { HStack } from "@chakra-ui/react";

const DashboardPage = () => {
  return (
    <PageContainer gap={R_GAP} pb={4}>
      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <FundMutationLineChart flex={"1 1 650px"} />
        <IncomeSourceDonutChart flex={"1 1 300px"} />

        <ExpenseCategoryDonutChart flex={"1 1 300px"} />

        <PopulationGrowthLineChart flex={"1 1 650px"} />
        <CurrentPopulationDonutChart flex={"1 1 300px"} />
      </HStack>
    </PageContainer>
  );
};

export default DashboardPage;
