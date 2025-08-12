import { LEGEND_COLOR_OPTIONS } from "@/constants/colors";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { Box, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "../ui-custom/Disclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import back from "@/utils/back";

const SelectColorscale = (props: any) => {
  // Props
  const {
    id,
    onConfirm,
    inputValue,
    initialOptions,
    onChangeSetter,
    invalid,
    nonNullable = false,
    multiple = false,
    disclosureSize = "xs",
    fetch,
    ...restProps
  } = props;

  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`select-colorscale`, open, onOpen, onClose);

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const [localColorscale, setLocalColorscale] = useState<any>(
    inputValue || LEGEND_COLOR_OPTIONS[0]
  );

  // Handle initial value
  useEffect(() => {
    setLocalColorscale(inputValue);
  }, [inputValue]);

  return (
    <>
      <BButton
        unclicky
        variant={"outline"}
        pl={1}
        size={"md"}
        w={"full"}
        onClick={onOpen}
        {...restProps}
      >
        <HStack
          w={"full"}
          borderRadius={4}
          overflow={"clip"}
          gap={0}
          h={"30px"}
          mr={2}
        >
          {localColorscale?.colors?.map((color: string) => {
            return (
              <Box
                key={color}
                bg={color}
                flex={"1 1 20px"}
                h={"full"}
                opacity={0.8}
              />
            );
          })}
        </HStack>

        <Icon boxSize={"14px"} color={"fg.subtle"} ml={"auto"}>
          <IconCaretDownFilled />
        </Icon>
      </BButton>

      <DisclosureRoot open={open} lazyLoad size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`Colorscale`} />
          </DisclosureHeader>

          <DisclosureBody>
            <CContainer gap={4}>
              {LEGEND_COLOR_OPTIONS?.map((item) => {
                const active = item?.label === localColorscale?.label;

                return (
                  <HStack
                    key={item?.label}
                    w={"full"}
                    h={"40px"}
                    borderRadius={5}
                    overflow={"clip"}
                    gap={0}
                    _hover={{ bg: "bg,subtle" }}
                    cursor={"pointer"}
                    border={active ? "1px solid" : ""}
                    borderColor={themeConfig.primaryColor}
                    p={active ? 1 : 0}
                    onClick={() => setLocalColorscale(item)}
                  >
                    <HStack
                      h={"full"}
                      w={"full"}
                      gap={0}
                      borderRadius={3}
                      overflow={"clip"}
                    >
                      {item?.colors?.map((color: string, i: number) => {
                        return (
                          <Box
                            key={`${color}-${i}`}
                            bg={color}
                            flex={"1 1 20px"}
                            h={"full"}
                            opacity={0.8}
                          />
                        );
                      })}
                    </HStack>
                  </HStack>
                );
              })}
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BButton
              variant={"outline"}
              onClick={() => {
                setLocalColorscale(undefined);
              }}
            >
              Clear
            </BButton>

            <BButton
              colorPalette={themeConfig.colorPalette}
              onClick={() => {
                onConfirm(localColorscale);
                back();
              }}
              disabled={!localColorscale}
            >
              {l.confirm}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default SelectColorscale;
