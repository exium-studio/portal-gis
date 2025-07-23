import { WMSLayer, WMSServiceConfig } from "@/constants/types";

export const generateWMSUrl = (
  service: WMSServiceConfig,
  layer: WMSLayer,
  width: number = 800,
  height: number = 600,
  bbox?: [number, number, number, number]
): string => {
  const params = new URLSearchParams({
    service: "WMS",
    version: "1.1.0",
    request: "GetMap",
    layers: `${service.workspace}:${layer.layerName}`,
    styles: layer.style || "",
    bbox: bbox?.join(",") || "-180,-90,180,90", // Default worldwide
    width: width.toString(),
    height: height.toString(),
    srs: "EPSG:4326",
    format: "image/svg", // Atau 'image/png' jika prefer raster
    transparent: "true",
  });

  return `${service.baseUrl}?${params.toString()}`;
};
