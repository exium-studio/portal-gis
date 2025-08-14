import { useFilterGeoJSON } from "@/context/useFilterGeoJSON";
import { useEffect, useState } from "react";
import P from "../ui-custom/P";
import { Checkbox } from "../ui/checkbox";
import { Tooltip } from "../ui/tooltip";

const FilterCheckbox = (props: any) => {
  // Props
  const { option, value, setFilterOptions } = props;

  // Contexts
  const addFilterGeoJSON = useFilterGeoJSON((s) => s.addFilterGeoJSON);
  const removeFilterGeoJSON = useFilterGeoJSON((s) => s.removeFilterGeoJSON);

  // States
  const [checked, setChecked] = useState<boolean>(value.active);

  // Utils
  function handleToggle(property: string, value: string, nextChecked: boolean) {
    setFilterOptions((prev: any) =>
      prev.map((filterItem: any) =>
        filterItem.property === property
          ? {
              ...filterItem,
              values: filterItem.values.map((v: any) =>
                v.value === value ? { ...v, active: nextChecked } : v
              ),
            }
          : filterItem
      )
    );

    if (!nextChecked) {
      addFilterGeoJSON({ [property]: [value] });
    } else {
      removeFilterGeoJSON(property as any, value);
    }
  }

  // Handle initial cheked
  useEffect(() => {
    setChecked(value.active);
  }, [value.active]);

  // Handle filter on checked changes
  useEffect(() => {
    handleToggle(option.property, value.value, checked);
  }, [checked]);

  return (
    <Checkbox
      key={`${checked}${value.active}`}
      checked={checked}
      onCheckedChange={(e) => setChecked(!!e.checked)}
      aria-label={`${option.property}-${value.value}`}
    >
      <Tooltip content={value.value}>
        <P lineClamp={1}>{value.value}</P>
      </Tooltip>
    </Checkbox>
  );
};

export default FilterCheckbox;
