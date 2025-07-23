// components/WMSLayerManager.tsx
import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";
import useActiveWMSLayers from "@/context/useActiveWMSLayers";

const WMSLayerManager = () => {
  const { current: map } = useMap();
  const { activeLayers } = useActiveWMSLayers();

  useEffect(() => {
    if (!map) return;

    // Cleanup function
    const cleanupLayers = () => {
      activeLayers.forEach((layer) => {
        const layerId = `wms-${layer.id}`;
        const sourceId = `wms-source-${layer.id}`;
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      });
    };

    cleanupLayers();

    // Add new layers
    activeLayers.forEach((layer) => {
      if (!layer.visible) return;

      const layerId = `wms-${layer.id}`;
      const sourceId = `wms-source-${layer.id}`;

      const params = new URLSearchParams({
        service: "WMS",
        version: "1.1.1",
        request: "GetMap",
        layers: layer.layers,
        format: "image/png",
        transparent: "true",
        width: "256",
        height: "256",
        srs: "EPSG:3857",
        bbox: "{bbox-epsg-3857}",
      });

      map.addSource(sourceId, {
        type: "raster",
        tiles: [`${layer.url}?${params.toString()}`],
        tileSize: 256,
      });

      map.addLayer(
        {
          id: layerId,
          type: "raster",
          source: sourceId,
          paint: {
            "raster-opacity": layer.opacity,
          },
        },
        "road-label"
      ); // Letakkan di atas basemap tapi di bawah label jalan
    });

    return cleanupLayers;
  }, [map, activeLayers]);

  return null;
};

export default WMSLayerManager;
