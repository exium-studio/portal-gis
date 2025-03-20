import { ButtonProps } from "@chakra-ui/react";
import BButton from "../ui-custom/BButton";

interface Props extends ButtonProps {}
const ItemButton = ({ children, ...props }: Props) => {
  // const { themeConfig } = useThemeConfig();

  return (
    <BButton
      size={"xs"}
      variant={"outline"}
      // colorPalette={themeConfig.colorPalette}
      borderRadius={"lg"}
      {...props}
    >
      {children}
    </BButton>
  );
};

export default ItemButton;
