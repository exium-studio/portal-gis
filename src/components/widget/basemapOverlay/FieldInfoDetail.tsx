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
import PropertyValue from "../PropertyValue";
import { EditField } from "./EditField";
import FloatingContainerCloseButton from "./FloatingContainerCloseButton";

const EXCLUDED_KEYS = [
  "id",
  "layer_id",
  "document_ids",
  "docs",
  "deleted_docs",
  "color",
];

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

  useEffect(() => {
    if (selectedPolygon) {
      onOpen();
    } else {
      onClose();
    }
    setProperties(selectedPolygon?.polygon?.properties);
  }, [selectedPolygon]);

  useEffect(() => {
    if (!workspaceActive) {
      clearSelectedPolygon();
      onClose();
    }
  }, [workspaceActive, activeWorkspaces]);

  // Components
  const ItemContainer = (props: any) => {
    const { children, last } = props;

    return (
      <CContainer
        borderBottom={last ? "" : "1px solid"}
        borderColor={"border.muted"}
        px={2}
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
              {`Detail ${capsFirstLetterEachWord(l.field_info)}`}
            </P>
          </HStack>

          <HStack gap={1} ml={"auto"} mr={"-2px"}>
            <EditField
              properties={properties}
              setProperties={setProperties}
              selectedPolygon={selectedPolygon}
              size={["xs", null, "sm"]}
            />

            <FloatingContainerCloseButton
              onClick={() => {
                onClose();
              }}
              size={["xs", null, "sm"]}
            />
          </HStack>
        </HStack>
      </MenuHeaderContainer>

      <CContainer pl={"6px"} className="scrollY">
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

export default FieldInfoDetail;
