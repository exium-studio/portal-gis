"use client";

import useADM from "@/context/useADM";
import useLang from "@/context/useLang";
import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { Icon, Span } from "@chakra-ui/react";
import { IconMoon2 } from "@tabler/icons-react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { LuSun } from "react-icons/lu";
import BButton from "../ui-custom/BButton";
import { Tooltip } from "./tooltip";

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  // Hooks
  const { l } = useLang();
  const { toggleColorMode } = useColorMode();

  // Contexts
  const { ADM } = useADM();
  const { colorMode } = useColorMode();

  // States
  const ADMActive = ADM === "true";

  return (
    <Tooltip content={ADMActive ? l.adm_active : l.toggle_dark_mode}>
      <BButton
        iconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        disabled={ADMActive}
        ref={ref}
        {...props}
      >
        <Icon boxSize={5}>
          {colorMode === "dark" ? <IconMoon2 stroke={1.8} /> : <LuSun />}
        </Icon>
      </BButton>
    </Tooltip>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  }
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  }
);
