import CContainer from "@/components/ui-custom/CContainer";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import P from "@/components/ui-custom/P";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useDetailFieldInfo from "@/context/useDetailFieldInfo";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import { HStack, Icon } from "@chakra-ui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import { FieldInfoEdit } from "./FieldInfoEdit";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";

const FieldInfoDetail = () => {
  // Hooks
  const { l } = useLang();
  const iss = useIsSmScreenWidth();

  // Contexts
  const { open, onOpen, onClose } = useDetailFieldInfo();
  const selectedPolygon = useSelectedPolygon((s) => s.selectedPolygon);
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const halfPanel = useLayout((s) => s.halfPanel);

  // States
  const workspaceId = selectedPolygon?.activeWorkspace?.id;
  const getActiveWorkspace = useActiveWorkspaces((s) => s.getActiveWorkspace);
  const workspaceActive = !!getActiveWorkspace(workspaceId as number);
  const activeWorkspaces = useActiveWorkspaces((s) => s.activeWorkspaces);
  const [properties, setProperties] = useState<any>(
    selectedPolygon?.polygon?.properties
  );

  //  open on selectedPolygon changes
  useEffect(() => {
    if (selectedPolygon) {
      onOpen();
    } else {
      onClose();
    }
    setProperties(selectedPolygon?.polygon?.properties);
  }, [selectedPolygon]);

  // close on workspace deactivation
  useEffect(() => {
    if (!workspaceActive) {
      clearSelectedPolygon();
      onClose();
    }
  }, [workspaceActive, activeWorkspaces]);

  return (
    <FloatingContainer
      open={open}
      containerProps={{
        position: "absolute",
        right: "8px",
        top: "66px",
        pointerEvents: "auto",
        w: iss ? "calc(50vw - 14px)" : "314px",
        pb: 2,
        maxH: iss
          ? halfPanel
            ? "calc(50dvh - 174px)"
            : "35dvh"
          : "calc(100dvh - 134px)",
      }}
      animationEntrance={"right"}
    >
      <MenuHeaderContainer>
        <HStack h={"20px"}>
          <HStack>
            <Icon>
              <IconInfoCircle stroke={1.5} size={20} />
            </Icon>

            <P fontWeight={"bold"} lineClamp={1}>
              {`${capsFirstLetterEachWord(l.field_info)}`}
            </P>
          </HStack>

          <HStack gap={1} ml={"auto"} mr={"-2px"}>
            <FloatingContainerCloseButton
              onClick={() => {
                onClose();
                clearSelectedPolygon();
              }}
              size={["xs", null, "sm"]}
            />
          </HStack>
        </HStack>
      </MenuHeaderContainer>

      <CContainer pos={"relative"} overflowY={"auto"}>
        <FieldInfoEdit properties={properties} setProperties={setProperties} />
      </CContainer>
    </FloatingContainer>
  );
};

export default FieldInfoDetail;
