import { Tooltip } from "recharts";
import ChartTooltipContent from "./LineChartTooltipContent";
import { ABS_COLORS } from "@/constants/colors";

const ChartTooltip = () => {
  return (
    <Tooltip
      content={(props) => <ChartTooltipContent {...props} />}
      cursor={{
        stroke: ABS_COLORS.d3,
        strokeWidth: 2,
        strokeDasharray: "5",
      }}
    />
  );
};

export default ChartTooltip;
