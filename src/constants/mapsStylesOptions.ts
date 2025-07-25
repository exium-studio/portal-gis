import { IMAGES_PATH } from "./paths";

// const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MAPS_STYLES_OPTIONS = [
  {
    id: 1,
    label: "Polos",
    labelKey: "plain",
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
    label: "Colorfull",
    labelKey: "colorful",
    img: {
      light: `${IMAGES_PATH}/map_types/colorful_light.png`,
      dark: `${IMAGES_PATH}/map_types/colorful_light.png`,
    },
    tile: {
      light: `mapbox://styles/mapbox/standard`,
      dark: `mapbox://styles/mapbox/standard`,
    },
    disabled: false,
  },
  {
    id: 3,
    label: "Satellite",
    labelKey: "satellite",
    img: {
      light: `${IMAGES_PATH}/map_types/satellite.png`,
      dark: `${IMAGES_PATH}/map_types/satellite.png`,
    },
    tile: {
      light: "mapbox://styles/mapbox/standard-satellite",
      dark: "mapbox://styles/mapbox/standard-satellite",
    },
    disabled: false,
  },
];

export default MAPS_STYLES_OPTIONS;
