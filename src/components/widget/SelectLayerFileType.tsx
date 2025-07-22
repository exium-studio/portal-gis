import { Interface__Select } from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { OPTIONS_LAYER_FILE_TYPE } from "@/static/selectOptions";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import SelectInput from "../ui-custom/SelectInput";

interface Props extends Interface__Select {
  provinceId?: number | string;
}
const SelectLayerFileType = (props: Props) => {
  // Props
  const { provinceId, ...restProps } = props;

  // Hooks
  const { l } = useLang();

  return (
    <SelectInput
      title={capsFirstLetterEachWord(l.layer_file_type)}
      initialOptions={OPTIONS_LAYER_FILE_TYPE}
      {...restProps}
    />
  );
};

export default SelectLayerFileType;
