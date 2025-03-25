import useLang from "@/context/useLang";
import SelectInput from "../ui-custom/SelectInput";

const PopulationCategoriesOptions = ({ category, setCategory }: any) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const categoriesOptions = [
    {
      id: 1,
      label: l.religion,
    },
    {
      id: 2,
      label: l.education,
    },
    {
      id: 3,
      label: l.maried_status,
    },
    {
      id: 4,
      label: l.citizenship,
    },
  ];

  return (
    <SelectInput
      id="jancok"
      initialOptions={categoriesOptions}
      onConfirm={(input) => {
        setCategory(input);
      }}
      inputValue={category}
      placeholder={l.categories}
      w={"fit"}
      size={"sm"}
    />
  );
};

export default PopulationCategoriesOptions;
