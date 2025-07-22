import { ButtonProps, MenuPositioner, Portal } from "@chakra-ui/react";
import { IconChevronDown } from "@tabler/icons-react";
import useLang from "../../context/useLang";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu";
import { Tooltip } from "../ui/tooltip";
import BButton from "./BButton";
import { useThemeConfig } from "@/context/useThemeConfig";

interface Props extends ButtonProps {}

const LANGUAGES = [
  {
    key: "id",
    code: "id-ID",
    label: "Indonesia",
  },
  {
    key: "en",
    code: "en-US",
    label: "English",
  },
];

export default function LangSwitcher({ ...props }: Props) {
  // Hooks
  const { l, lang, setLang } = useLang();

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Tooltip content={l.language_settings_title}>
      <MenuRoot>
        <MenuTrigger asChild>
          <BButton
            unclicky
            px={2}
            pr={1}
            variant={"ghost"}
            color={"current"}
            {...props}
          >
            {lang.toUpperCase()}
            <IconChevronDown stroke={1.5} />
          </BButton>
        </MenuTrigger>

        <Portal>
          <MenuPositioner>
            <MenuContent zIndex={2000}>
              {LANGUAGES.map((item, i) => {
                const active = item.key === lang;

                return (
                  <MenuItem
                    key={i}
                    value={item.key}
                    onClick={() => setLang(item.key as any)}
                    color={active ? themeConfig.primaryColor : "current"}
                    fontWeight={active ? "semibold" : "normal"}
                  >
                    {item.label}
                  </MenuItem>
                );
              })}
            </MenuContent>
          </MenuPositioner>
        </Portal>
      </MenuRoot>
    </Tooltip>
  );
}
