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

const EXCLUDED_KEYS = ["id", "layer_id", "document_ids"];

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
  const [data, setData] = useState<any>(selectedPolygon?.polygon?.properties);
  const excludedKeysCount = EXCLUDED_KEYS.filter(
    (key) => data && Object.keys(data).includes(key)
  ).length;

  // Handle open
  useEffect(() => {
    if (selectedPolygon) {
      onOpen();
      setData(selectedPolygon?.polygon?.properties);
    } else {
      onClose();
    }
  }, [selectedPolygon]);

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
              data={data}
              setData={setData}
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
        {data &&
          Object?.keys(data)?.map((key, i) => {
            const last = i === Object?.keys(data)?.length - excludedKeysCount;

            return EXCLUDED_KEYS.includes(key) ? null : (
              <ItemContainer key={key} last={last}>
                <P fontWeight={"medium"} color={"fg.subtle"}>
                  {`${key}`}
                </P>
                <PropertyValue>{`${data?.[key] || "-"}`}</PropertyValue>
              </ItemContainer>
            );
          })}

        {/* <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.owner}
          </P>
          <P>{`${data?.pemilik || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.owner_type}
          </P>
          <P>{`${data?.tipepemili || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.usage}
          </P>
          <P>{`${data?.penggunaan || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.sertificate_number}
          </P>
          <P>{`${data?.hak || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            NIB
          </P>
          <P>{`${data?.nib || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.rights_type}
          </P>
          <P>{`${data?.tipehak || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.rights_published_date}
          </P>
          <P>{`${data?.tglterbith || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.rights_expired_date}
          </P>
          <P>{`${data?.berakhirha || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.map_area}
          </P>
          <P>{`${data?.luaspeta || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.written_area}
          </P>
          <P>{`${data?.luastertul || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.sk}
          </P>
          <P>{`${data?.sk || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.sk_date}
          </P>
          <P>{`${data?.tanggalsk || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.city}
          </P>
          <P>{`${data?.kabupaten || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.province}
          </P>
          <P>{`${data?.propinsi || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.problems}
          </P>
          <P>{`${data?.permasalah || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.dispute_parties}
          </P>
          <P>{`${data?.parapihakb || "-"}`}</P>
        </ItemContainer>

        <ItemContainer>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.handling_and_follow_up}
          </P>
          <P>{`${data?.tindaklanj || "-"}`}</P>
        </ItemContainer>

        <ItemContainer last>
          <P fontWeight={"medium"} color={"fg.subtle"}>
            {l.result}
          </P>
          <P>{`${data?.hasil || "-"}`}</P>
        </ItemContainer> */}
      </CContainer>
    </FloatingContainer>
  );
};
