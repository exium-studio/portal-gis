import CContainer from "@/components/ui-custom/CContainer";
import FloatingContainer from "@/components/ui-custom/FloatingContainer";
import P from "@/components/ui-custom/P";
import useLang from "@/context/useLang";
import useLayout from "@/context/useLayout";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import capsFirstLetterEachWord from "@/utils/capsFirstLetterEachWord";
import { HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import MenuHeaderContainer from "../MenuHeaderContainer";
import PropertyValue from "../PropertyValue";
import { EditField } from "./EditField";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";

const EXCLUDED_KEYS = [
  "id",
  "layer_id",
  "document_ids",
  "docs",
  "deleted_docs",
  "color",
];

export const FieldInfo = () => {
  // Hooks
  const { l } = useLang();
  const { open, onOpen, onClose } = useDisclosure();
  const iss = useIsSmScreenWidth();

  // Contexts
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
  const finalData =
    properties &&
    Object.fromEntries(
      Object.entries(properties)
        .filter(([key]) => !EXCLUDED_KEYS.includes(key))
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
  const excludedKeysCount = EXCLUDED_KEYS.filter(
    (key) => properties && Object.keys(properties).includes(key)
  ).length;

  // console.log(selectedPolygon?.polygon?.geometry?.coordinates?.length);
  // console.log(selectedPolygon?.polygon?.geometry?.coordinates?.length);

  // Handle open
  useEffect(() => {
    if (selectedPolygon) {
      // TODO open ketika user klik detail pada popover bidang
      // onOpen();
      setProperties(selectedPolygon?.polygon?.properties);
    } else {
      onClose();
    }
  }, [selectedPolygon]);

  useEffect(() => {
    if (!workspaceActive) {
      clearSelectedPolygon();
    }
  }, [workspaceActive, activeWorkspaces]);

  // Components
  const ItemContainer = (props: any) => {
    const { children, last } = props;

    return (
      <CContainer
        borderBottom={last ? "" : "1px solid"}
        borderColor={"border.muted"}
        px={3}
        pt={2}
        pb={last ? 0 : 2}
      >
        {children}
      </CContainer>
    );
  };

  return (
    <FloatingContainer
      open={open}
      containerProps={{
        position: "absolute",
        right: "8px",
        top: "66px",
        pointerEvents: "auto",
        w: iss ? "calc(50vw - 14px)" : "298px",
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
              {capsFirstLetterEachWord(l.field_info)}
            </P>
          </HStack>

          <HStack gap={1} ml={"auto"} mr={-1}>
            <EditField
              properties={properties}
              setProperties={setProperties}
              selectedPolygon={selectedPolygon}
              size={["xs", null, "sm"]}
            />

            <FloatingContainerCloseButton
              onClick={() => {
                clearSelectedPolygon();
                onClose();
              }}
            />
          </HStack>
        </HStack>
      </MenuHeaderContainer>

      <CContainer px={1} className="scrollY">
        {properties &&
          Object?.keys(finalData)?.map((key, i) => {
            const last =
              i === Object?.keys(properties)?.length - excludedKeysCount - 1;

            return (
              <ItemContainer key={key} last={last}>
                <P fontWeight={"medium"} color={"fg.subtle"}>
                  {`${key}`}
                </P>
                <PropertyValue>{`${properties?.[key] || "-"}`}</PropertyValue>
              </ItemContainer>
            );
          })}
      </CContainer>
    </FloatingContainer>
  );
};
