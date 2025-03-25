import Announcement from "@/components/widget/admin/Announcement";
import FacilityDoughnutChart from "@/components/widget/admin/FacilityDoughnutChart";
import FundMutationLineChart from "@/components/widget/admin/FundMutationLineChart";
import OfficialContact from "@/components/widget/admin/OfficialContact";
import PageContainer from "@/components/widget/PageContainer";
import PopulationGrowthLineChart from "@/components/widget/PopulationGrowthLineChart";
import TotalCounter from "@/components/widget/TotalCounter";
import TotalPopulationByFilterDoughnutChart from "@/components/widget/admin/TotalPopulationByFilterDoughnutChart";
import VillageSummary from "@/components/widget/admin/VillageSummary";
import VisionMission from "@/components/widget/admin/VisionMission";
import { R_GAP } from "@/constants/sizes";
import { HStack } from "@chakra-ui/react";

const DashboardPage = () => {
  return (
    <PageContainer gap={R_GAP} pb={4}>
      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <VillageSummary flex={"1 1 650px"} />

        <TotalCounter flex={"1 1 300px"} />
      </HStack>

      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <Announcement flex={"1 1 300px"} minW={0} />

        <VisionMission flex={"1 1 300px"} minW={0} />

        <OfficialContact flex={"1 1 300px"} minW={0} />
      </HStack>

      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <FundMutationLineChart flex={"1 1 650px"} />

        <FacilityDoughnutChart flex={"1 1 300px"} />
      </HStack>

      <HStack wrap={"wrap"} gap={R_GAP} align={"stretch"}>
        <PopulationGrowthLineChart flex={"1 1 650px"} />

        <TotalPopulationByFilterDoughnutChart flex={"1 1 300px"} />
      </HStack>
    </PageContainer>
  );
};

export default DashboardPage;
