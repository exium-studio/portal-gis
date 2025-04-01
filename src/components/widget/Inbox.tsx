import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import { HStack, Text, useDisclosure } from "@chakra-ui/react";
import { IconInbox, IconInboxOff } from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import ConfirmationDisclosure from "../ui-custom/ConfirmationDisclosure";
import DisclosureHeaderContent from "../ui-custom/DisclosureHeaderContent";
import FloatCounter from "../ui-custom/FloatCounter";
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
} from "../ui/drawer";
import { EmptyState } from "../ui/empty-state";
import { Tooltip } from "../ui/tooltip";

const Inbox = () => {
  // Contexts
  const { l } = useLang();

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`merchant-inbox`, open, onOpen, onClose);

  return (
    <>
      <Tooltip content={"Inbox"}>
        <BButton iconButton unclicky variant={"ghost"} onClick={onOpen}>
          <>
            <FloatCounter circleProps={{ mt: "18px", mr: "18px" }}>
              2
            </FloatCounter>

            <IconInbox stroke={1.5} />
          </>
        </BButton>
      </Tooltip>

      <DrawerRoot open={open} size={"sm"}>
        <DrawerContent>
          <DrawerHeader pt={5}>
            <DisclosureHeaderContent
              prefix="drawer"
              content={
                <HStack>
                  <IconInbox stroke={1.5} />
                  <Text fontSize={"16px"} fontWeight={"semibold"}>
                    Inbox
                  </Text>
                </HStack>
              }
            />
          </DrawerHeader>

          <DrawerBody display={"flex"}>
            <EmptyState
              icon={<IconInboxOff />}
              title={`Inbox ${l.empty.toLowerCase()}`}
              description={l.no_data_feedback.description}
              maxW={"300px"}
              m={"auto"}
            />
          </DrawerBody>

          <DrawerFooter>
            <ConfirmationDisclosure
              id="mark-read-all"
              title={l.mark_read_disclosure.title}
              description={l.mark_read_disclosure.description}
              confirmLabel={l.mark_as_read}
              confirmCallback={() => {}}
            >
              <BButton variant={"outline"}>{l.mark_as_read}</BButton>
            </ConfirmationDisclosure>

            <ConfirmationDisclosure
              id="logout"
              title={l.delete_all_inbox_disclosure.title}
              description={l.delete_all_inbox_disclosure.description}
              confirmLabel={l.delete_label}
              confirmButtonProps={{ colorPalette: "red" }}
              confirmCallback={() => {}}
            >
              <BButton variant={"outline"} color={"fg.error"}>
                {l.delete_all_inbox_button}...
              </BButton>
            </ConfirmationDisclosure>
          </DrawerFooter>
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default Inbox;
