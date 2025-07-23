// components/WMSLayerManager.tsx
import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";
import useActiveWMSLayers from "@/context/useActiveWMSLayers";

const WMSLayerManager = () => {
  const { current: map } = useMap();
  const activeLayers = useActiveWMSLayers((s) => s.activeLayers);

  console.log("activeLayers wms management", activeLayers);

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
      console.log("layer", layer);
      console.log("layer url", layer.url);

      if (!layer.visible) return;

      const layerId = `wms-${layer.id}`;
      const sourceId = `wms-source-${layer.id}`;

      map.addSource(sourceId, {
        type: "raster",
        tiles: [`${layer.url}`],
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
      );
    });

    return cleanupLayers;
  }, [map, activeLayers]);

  return null;
};

export default WMSLayerManager;
