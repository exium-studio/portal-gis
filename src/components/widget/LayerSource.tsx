import {
  Interface__ActiveLayer,
  Interface__ActiveWorkspace,
} from "@/constants/interfaces";
import { IMAGES_PATH } from "@/constants/paths";
import { useConfirmFilterGeoJSON } from "@/context/useConfirmFilterGeoJSON";
import useLegend from "@/context/useLegend";
import useMapStyle from "@/context/useMapStyle";
import useMapViewState from "@/context/useMapViewState";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useFilteredGeoJSON from "@/hooks/useFilteredGeoJSON";
import { useCallback, useEffect, useRef } from "react";
import { useColorMode } from "../ui/color-mode";

interface LayerSourceProps {
  activeWorkspace: Interface__ActiveWorkspace;
  activeLayer: Interface__ActiveLayer;
}

const LayerSource = ({ activeWorkspace, activeLayer }: LayerSourceProps) => {
  const mapRef = useMapViewState((s) => s.mapRef);
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const setSelectedPolygon = useSelectedPolygon((s) => s.setSelectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const { themeConfig } = useThemeConfig();
  const legend = useLegend((s) => s.legend);
  const colorway = useLegend((s) => s.colorway);
  const mapStyle = useMapStyle((s) => s.mapStyle);
  const { colorMode } = useColorMode();

  const confirmFilterGeoJSON = useConfirmFilterGeoJSON(
    (s) => s.confirmFilterGeoJSON
  );
  const geojson = activeLayer?.data?.geojson;
  const filteredGeojson = useFilteredGeoJSON(geojson, confirmFilterGeoJSON);
  const fillLayerId = `${activeLayer.id}-fill`;
  const lineLayerId = `${activeLayer.id}-outline`;
  const sourceId = `${activeLayer.id}-source`;

  const plainLight = colorMode === "light" && mapStyle?.id === 1;
  const plainDark = colorMode === "dark" && mapStyle?.id === 1;
  const colorful = mapStyle?.id === 2;
  const satellite = mapStyle?.id === 3;

  const defaultFillColor = plainLight
    ? "#bbb"
    : plainDark
    ? "#444"
    : colorful
    ? "#bbb"
    : satellite
    ? "#bbb"
    : "#fff";
  const defaultLineColor = plainLight
    ? "#aaa"
    : plainDark
    ? "#888"
    : colorful
    ? "#777"
    : satellite
    ? "#ddd"
    : "#ccc";
  const defaultSymbolTextColor = plainLight
    ? "#151515"
    : plainDark
    ? "#fff"
    : colorful
    ? "#151515"
    : satellite
    ? "#fff"
    : "#151515";
  const defaultSymbolHaloTextColor = plainLight
    ? "#fff"
    : plainDark
    ? "#151515"
    : colorful
    ? "#fff"
    : satellite
    ? "#151515"
    : "#fff";

  const fillColor = ["coalesce", ["get", "color"], defaultFillColor];
  const fillOpacity = 0.6;
  const lineColor = ["coalesce", ["get", "color"], defaultLineColor];
  const isFillLayer = activeLayer.layer_type === "fill";
  const isLineLayer = activeLayer.layer_type === "line";
  const isSymbolLayer = activeLayer.layer_type === "symbol";

  const lastGeojsonRef = useRef<any>(null);

  const handleOnClickPolygon = useCallback(
    (event: any) => {
      if (!activeLayer.visible) return;

      const clickedFeature = event.features?.[0];
      if (!clickedFeature) {
        clearSelectedPolygon();
        return;
      }

      const clickedId =
        clickedFeature.properties?.id || clickedFeature.properties?.gid;
      const selectedId =
        selectedPolygon?.polygon?.properties?.id ||
        selectedPolygon?.polygon?.properties?.gid;

      // console.log("clickedFeature.properties", clickedFeature.properties);
      // console.log("clickedId", clickedId);
      // console.log("selectedId", selectedId);

      if (selectedId === clickedId) {
        clearSelectedPolygon();
      } else {
        const clickedPolygon = filteredGeojson?.features?.find(
          (f) =>
            f.properties?.id === clickedId || f.properties?.gid === clickedId
        );

        setSelectedPolygon({
          polygon: clickedPolygon,
          activeLayer,
          activeWorkspace,
          fillColor: themeConfig.primaryColorHex,
          clickedLngLat: {
            lat: event.lngLat.lat,
            lon: event.lngLat.lng,
          },
        });
      }
    },
    [
      activeLayer,
      activeWorkspace,
      selectedPolygon,
      filteredGeojson,
      themeConfig.primaryColorHex,
    ]
  );

  useEffect(() => {
    const map = mapRef?.current?.getMap();
    if (!map || !filteredGeojson) return;

    // Add/Update source
    const existingSource = map.getSource(sourceId);
    if (existingSource) {
      if (lastGeojsonRef.current !== filteredGeojson) {
        (existingSource as any).setData(filteredGeojson);
        lastGeojsonRef.current = filteredGeojson;
      }
    } else {
      map.addSource(sourceId, { type: "geojson", data: filteredGeojson });
      lastGeojsonRef.current = filteredGeojson;
    }

    // Add or update layers
    if (isFillLayer) {
      // Line
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": defaultLineColor,
            "line-width": 1,
            "line-opacity": 1,
          },
        });
      }

      // Fill
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: { "fill-color": fillColor, "fill-opacity": fillOpacity },
        });
      } else {
        map.setPaintProperty(fillLayerId, "fill-color", fillColor);
        map.setPaintProperty(fillLayerId, "fill-opacity", fillOpacity);
      }
    }

    if (isLineLayer) {
      // Line
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": lineColor,
            "line-width": 1.3,
            "line-opacity": 0.8,
            "line-dasharray": [3, 4],
          },
        });
      } else {
        map.setPaintProperty(lineLayerId, "line-opacity", 1);
      }

      // Invisible fill for click area
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: { "fill-color": "#000", "fill-opacity": 0 },
        });
      }
    }

    if (isSymbolLayer) {
      if (!map.hasImage("custom-marker")) {
        map.loadImage(
          `${IMAGES_PATH}/map_marker.png`,
          (error: any, image: any) => {
            if (error) throw error;
            if (!map.hasImage("custom-marker") && image) {
              map.addImage("custom-marker", image);
            }
          }
        );
      }

      // Circle layer as hitbox (32px equivalent in pixels)
      if (!map.getLayer(lineLayerId)) {
        map.addLayer({
          id: lineLayerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": 20, // 32px diameter
            "circle-opacity": 0,
            "circle-color": "white",
          },
        });
      }

      // Symbol layer for the actual icon + label
      if (!map.getLayer(fillLayerId)) {
        map.addLayer({
          id: fillLayerId,
          type: "symbol",
          source: sourceId,
          layout: {
            "icon-image": "custom-marker",
            "icon-size": [
              "case",
              [
                "==",
                ["get", "id"],
                selectedPolygon?.polygon?.properties?.id || "",
              ],
              0.5,
              0.3125,
            ],
            "icon-anchor": "bottom",
            "text-field": ["get", "Nama_Point"],
            "text-size": 14,
            "text-anchor": "top",
            "text-offset": [0, 0.4],
            "icon-allow-overlap": true,
            "text-allow-overlap": true,
            "symbol-z-order": "source",
          },
          paint: {
            "text-color": defaultSymbolTextColor,
            "text-halo-color": defaultSymbolHaloTextColor,
            "text-halo-width": 1,
          },
        });
      } else {
        map.setLayoutProperty(fillLayerId, "icon-image", "custom-marker");
        map.setLayoutProperty(fillLayerId, "icon-size", [
          "case",
          ["==", ["get", "id"], selectedPolygon?.polygon?.properties?.id || ""],
          0.5,
          0.3125,
        ]);
      }
    }

    // Event click (per layer)
    if (activeLayer.visible) {
      map.on("click", fillLayerId, handleOnClickPolygon);
    }

    return () => {
      map.off("click", fillLayerId, handleOnClickPolygon);
    };
  }, [
    filteredGeojson,
    activeLayer.visible,
    legend,
    themeConfig.primaryColorHex,
    fillColor,
    fillOpacity,
    colorway,
  ]);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      const map = mapRef?.current?.getMap();
      if (!map) return;
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, []);

  return null;
};

export default LayerSource;
