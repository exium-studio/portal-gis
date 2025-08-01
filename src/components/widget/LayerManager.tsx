import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useMapViewState from "@/context/useMapViewState";
import { useEffect, useRef, useState } from "react";
import LayerSource from "./LayerSource";

const LayerManager = () => {
  const { activeWorkspaces } = useActiveWorkspaces(); // Context yang bisa dimutasi
  const map = useMapViewState().mapRef.current?.getMap();

  // Refs
  const layerOrderRef = useRef<(string | undefined)[] | undefined>([]);

  // States
  const [brutalKey, setBrutalKey] = useState<number>(1);

  useEffect(() => {
    if (!map) return;

    const newLayerOrder = activeWorkspaces
      .filter((ws) => ws.visible)
      .flatMap((ws) => ws.layers?.map((layer) => `${layer.id}-fill`));

    if (
      JSON.stringify(newLayerOrder) !== JSON.stringify(layerOrderRef.current)
    ) {
      newLayerOrder.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.moveLayer(layerId);
        }
      });

      layerOrderRef.current = newLayerOrder;
    }
    setBrutalKey((ps) => ps + 1);
  }, [activeWorkspaces, map]);

  return (
    <>
      {activeWorkspaces
        .filter((ws) => ws.visible)
        .flatMap((ws) =>
          ws.layers?.map((layer) => {
            // console.log(layer);
            return (
              <LayerSource
                key={`${ws.id}-${layer.id}-${brutalKey}`}
                activeWorkspace={ws}
                activeLayer={layer}
              />
            );
          })
        )}
    </>
  );
};

export default LayerManager;
