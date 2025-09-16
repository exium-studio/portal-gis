import {
  Interface__Select,
  Interface__SelectOption,
} from "@/constants/interfaces";
import useRequest from "@/hooks/useRequest";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import SelectInput from "../ui-custom/SelectInput";

interface Props extends Interface__Select {
  workspaceId: number;
}
const SelectLayerByWorkspaceId = (props: Props) => {
  // Props
  const { workspaceId, ...restProps } = props;

  // Hooks
  const { req } = useRequest({
    id: "select_layer_by_workspace_id",
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // Utils
  function fetch(setOptions: any) {
    const config = {
      url: `/api/gis-bpn/workspaces-layers/layers-by-workspace/${workspaceId}`,
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
          console.log(r.data.data);
          const newOptions = r?.data?.data
            ?.map((layer: any) => ({
              id: layer?.id,
              label: layer?.name,
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
      title={capsFirstLetterEachWord("Layer")}
      fetch={fetch}
      {...restProps}
    />
  );
};

export default SelectLayerByWorkspaceId;
