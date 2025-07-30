import { Interface__Select } from "@/constants/interfaces";
import useRequest from "@/hooks/useRequest";
import SelectInput from "../ui-custom/SelectInput";
import useLang from "@/context/useLang";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";

interface Props extends Interface__Select {}
const SelectWorkspaceCategory = (props: Props) => {
  // Props
  const { ...restProps } = props;

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
      url: `/api/gis-bpn/master-data/categories/index`,
      method: "get",
      payload: {
        limit: Infinity,
      },
    };

    req({
      config,
      onResolve: {
        onSuccess: (r) => {
          const newOptions = r?.data?.data?.data?.map((item: any) => ({
            id: item?.id,
            label: `${item?.label}`,
          }));
          setOptions(newOptions);
        },
      },
    });
  }

  return (
    <SelectInput
      title={capsFirstLetterEachWord(l.workspace_category)}
      fetch={fetch}
      {...restProps}
    />
  );
};

export default SelectWorkspaceCategory;
