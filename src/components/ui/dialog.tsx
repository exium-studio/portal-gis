import useBackOnDefaultPage from "@/hooks/useBackOnDefaultPage";
import useScreen from "@/hooks/useScreen";
import back from "@/utils/back";
import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react";
import { forwardRef, useState } from "react";
import { CloseButton } from "./close-button";

interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  backdrop?: boolean;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const {
      children,
      portalled = true,
      portalRef,
      backdrop = true,
      ...rest
    } = props;

    const [mouseDownTarget, setMouseDownTarget] = useState<EventTarget | null>(
      null
    );

    // Utils
    const handleBackOnDefaultPage = useBackOnDefaultPage();
    const { sh } = useScreen();

    return (
      <Portal disabled={!portalled} container={portalRef}>
        {backdrop && (
          <ChakraDialog.Backdrop
          // bg={"d1"}
          // backdropFilter={"blur(5px)"}
          />
        )}
        <ChakraDialog.Positioner
          pointerEvents="auto"
          py={4}
          onMouseDown={(e) => setMouseDownTarget(e.target)}
          onMouseUp={(e) => {
            if (mouseDownTarget === e.target) {
              // klik mulai dan selesai di posisi yang sama
              back();
              handleBackOnDefaultPage();
            }
            setMouseDownTarget(null);
          }}
        >
          <ChakraDialog.Content
            ref={ref}
            minH={sh < 500 ? "90dvh" : ""}
            bg="body"
            shadow="none"
            onClick={(e) => e.stopPropagation()}
            {...rest}
          >
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    );
  }
);

export const DialogCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialog.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <CloseButton size="2xs" ref={ref}>
        {props.children}
      </CloseButton>
    </ChakraDialog.CloseTrigger>
  );
});

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;
