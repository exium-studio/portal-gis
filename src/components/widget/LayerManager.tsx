import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useMapViewState from "@/context/useMapViewState";
import { useEffect, useRef } from "react";
import LayerSource from "./LayerSource";

const LayerManager = () => {
  // Contexts
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const map = useMapViewState().mapRef?.current?.getMap();

  // Refs
  const layerOrderRef = useRef<string[]>([]);

  // Handle layer order when changes
  useEffect(() => {
    if (!map) return;

    const newLayerOrder: string[] = [];

    activeWorkspaces
      .filter((cat) => cat.visible)
      .forEach((cat) => {
        cat.workspaces
          .filter((ws) => ws.visible)
          .forEach((ws) => {
            ws.layers
              ?.filter((l) => l.visible)
              .forEach((layer) => {
                newLayerOrder.push(`${layer.id}-fill`);
              });
          });
      });

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
  }, [activeWorkspaces, map]);

  return (
    <>
      {activeWorkspaces
        .filter((cat) => cat.visible)
        .flatMap((cat) =>
          cat.workspaces
            .filter((ws) => ws.visible)
            .flatMap((ws) =>
              ws.layers
                ?.filter((l) => l.visible)
                .map((layer) => (
                  <LayerSource
                    key={`${ws.id}-${layer.id}`}
                    activeWorkspace={ws}
                    activeLayer={layer}
                  />
                ))
            )
        )}
    </>
  );
};

export default LayerManager;
