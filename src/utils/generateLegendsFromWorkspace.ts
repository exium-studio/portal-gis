import { Interface__ActiveWorkspace } from "@/constants/interfaces";
import chroma from "chroma-js";

interface LegendEntry {
  label: string;
  color: string;
}
interface PropertyLegend {
  propertyKey: string;
  legends: LegendEntry[];
}

export function generateLegendsFromWorkspaces(
  workspaces: Interface__ActiveWorkspace[],
  colorway?: string[]
): PropertyLegend[] {
  const valueMap: Record<string, Set<string>> = {};

  for (const ws of workspaces) {
    for (const layer of ws.layers || []) {
      const features = layer.data?.geojson.features || [];

      for (const feature of features) {
        const props = feature.properties || {};

        for (const key in props) {
          if (!valueMap[key]) valueMap[key] = new Set();
          const val = props[key];
          if (val != null && val !== "") valueMap[key].add(String(val));
        }
      }
    }
  }

  const result: PropertyLegend[] = [];

  for (const key in valueMap) {
    const labels = Array.from(valueMap[key]);
    const colors = chroma.scale(colorway || "Set2").colors(labels.length);

    const legends: LegendEntry[] = labels.map((label, i) => ({
      label,
      color: colors[i],
    }));

    result.push({ propertyKey: key, legends });
  }

  return result;
}
