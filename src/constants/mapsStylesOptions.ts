import { IMAGES_PATH } from "./paths";

const MAPS_STYLES_OPTIONS = [
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
      light: "mapbox://styles/mapbox/satellite-v9",
      dark: "mapbox://styles/mapbox/satellite-v9",
    },
    disabled: false,
  },
];

export default MAPS_STYLES_OPTIONS;
