import { IMAGES_PATH } from "./paths";

const MAP_STYLES = [
  {
    id: 1,
    label: "Digital",
    img: {
      light: `${IMAGES_PATH}/map_types/digital_light.png`,
      dark: `${IMAGES_PATH}/map_types/digital_dark.png`,
    },
    tile: {
      light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    },
    disabled: false,
  },
  {
    id: 2,
    label: "Satellite",
    img: {
      light: `${IMAGES_PATH}/map_types/satellite.png`,
      dark: `${IMAGES_PATH}/map_types/satellite.png`,
    },
    tile: {
      light:
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      dark: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    },
    disabled: true,
  },
];

export default MAP_STYLES;
