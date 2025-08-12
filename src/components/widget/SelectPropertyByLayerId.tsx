import {
  Interface__Select,
  Interface__SelectOption,
} from "@/constants/interfaces";
import useRequest from "@/hooks/useRequest";
import SelectInput from "../ui-custom/SelectInput";
import useLang from "@/context/useLang";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";

interface Props extends Interface__Select {
  layerId: number;
}
const SelectPropertyByLayerId = (props: Props) => {
  // Props
  const { layerId, ...restProps } = props;

  // Hooks
  const { l } = useLang();
  const { req } = useRequest({
    id: "select_workspace_category",
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // Utils
  function fetch(setOptions: any) {
    const config = {
      url: `/api/gis-bpn/workspaces-layers/property/${layerId}`,
      method: "GET",
      params: {
        with_trashed: 0,
        limit: Infinity,
      },
    };

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          const newOptions = r?.data?.data?.properties
            ?.map((property: any) => ({
              id: property,
              label: property,
            }))
            .sort((a: Interface__SelectOption, b: Interface__SelectOption) =>
              a.label.localeCompare(b.label)
            );
          setOptions(newOptions);
        },
      },
    });
  }

  return (
    <SelectInput
      title={capsFirstLetterEachWord(l.property)}
      fetch={fetch}
      {...restProps}
    />
  );
};

export default SelectPropertyByLayerId;
