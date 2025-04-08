import { ABS_COLORS } from "@/constants/colors";

const DISPLAYED_DATA_LIST: any[] = [
  {
    id: 1,
    key: "kk",
    disabled: false,
    color: [
      {
        labelKey: "kk",
        color: ABS_COLORS.blue,
      },
    ],
  },
  {
    id: 2,
    key: "facility",
    disabled: false,
    color: [
      {
        labelKey: "facility",
        color: ABS_COLORS.orange,
      },
    ],
  },
  {
    id: 3,
    key: "infrastructure",
    disabled: false,
    color: [
      {
        labelKey: "infrastructure",
        color: ABS_COLORS.light_blue,
      },
    ],
  },
  {
    id: 4,
    key: "environment",
    disabled: false,
    color: [
      {
        labelKey: "environment",
        color: ABS_COLORS.green,
      },
    ],
  },
  {
    id: 5,
    key: "village_asset",
    disabled: false,
    color: [
      {
        labelKey: "village_asset",
        color: ABS_COLORS.red,
      },
    ],
  },
  {
    id: 6,
    key: "land_field",
    disabled: true,
    color: [
      {
        labelKey: "land_field",
        color: ABS_COLORS.blue,
      },
    ],
  },
];

export default DISPLAYED_DATA_LIST;
