import useLang from "@/context/useLang";
import SelectInput from "../ui-custom/SelectInput";

const PopulationCategoriesOptions = ({ category, setCategory }: any) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const categoriesOptions = [
    {
      id: "religion",
      label: l.religion,
    },
    {
      id: "education",
      label: l.education,
    },
    {
      id: "married_status",
      label: l.married_status,
    },
    {
      id: "citizenship",
      label: l.citizenship,
    },
    {
      id: "gender",
      label: l.gender,
    },
  ];

  return (
    <SelectInput
      id="population-category-options"
      initialOptions={categoriesOptions}
      onConfirm={(input) => {
        setCategory(input);
      }}
      inputValue={category}
      placeholder={l.categories}
      w={"110px"}
      size={"sm"}
      nonNullable
    />
  );
};

export default PopulationCategoriesOptions;
