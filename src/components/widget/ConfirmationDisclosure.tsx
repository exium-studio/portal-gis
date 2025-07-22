import useConfirmationDisclosure from "@/context/useConfirmationDisclosure";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { Text } from "@chakra-ui/react";
import BackButton from "../ui-custom/BackButton";
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

interface Props {
  children?: any;
}

const ConfirmationDisclosure = (props: Props) => {
  // Props
  const { children } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const {
    confirmationData,
    confirmationOpen,
    confirmationOnOpen,
    confirmationOnClose,
  } = useConfirmationDisclosure();

  // Utils
  useBackOnClose(
    `confirm-${confirmationData?.title}-${confirmationData?.id}`,
    confirmationOpen,
    confirmationOnOpen,
    confirmationOnClose
  );

  return (
    <>
      <CContainer
        w={"unset"}
        onClick={confirmationData?.disabled ? undefined : confirmationOnOpen}
        {...confirmationData?.triggerProps}
      >
        {children}
      </CContainer>

      <DisclosureRoot open={confirmationOpen} size={"xs"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={`${confirmationData?.title}`} />
          </DisclosureHeader>

          <DisclosureBody>
            <Text>{confirmationData?.description}</Text>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton disabled={confirmationData?.loading} />
            <BButton
              onClick={confirmationData?.onConfirm}
              loading={confirmationData?.loading}
              colorPalette={themeConfig.colorPalette}
              {...confirmationData?.confirmButtonProps}
            >
              {confirmationData?.confirmLabel}
            </BButton>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

export default ConfirmationDisclosure;
