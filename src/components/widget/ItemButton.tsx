import { useThemeConfig } from "@/context/useThemeConfig";
import BButton, { BButtonProps } from "../ui-custom/BButton";

interface Props extends BButtonProps {}
const ItemButton = ({ children, ...props }: Props) => {
  const { themeConfig } = useThemeConfig();

  return (
    <BButton
      size={"sm"}
      variant={"subtle"}
      colorPalette={themeConfig.colorPalette}
      borderRadius={"lg"}
      {...props}
    >
      {children}
    </BButton>
  );
};

export default ItemButton;
