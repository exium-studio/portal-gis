import BackButton from "@/components/ui-custom/BackButton";
import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "@/components/ui-custom/Disclosure";
import DisclosureHeaderContent from "@/components/ui-custom/DisclosureHeaderContent";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { Tooltip } from "@/components/ui/tooltip";
import { BASE_STORAGE_URL } from "@/constants/paths";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import formatDate from "@/utils/formatDate";
import formatTime from "@/utils/formatTime";
import { makeTime } from "@/utils/getTime";
import {
  HStack,
  Icon,
  Image,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconPackage,
} from "@tabler/icons-react";
import { useRef } from "react";

const Detail = ({ item }: any) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollOffset = 300;

  // Utils
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`detail-${item.id}`, open, onOpen, onClose);
  function prev() {
    if (containerRef.current) {
      containerRef.current.style.scrollBehavior = "smooth";
      containerRef.current.scrollLeft -= scrollOffset;
    }
  }
  function next() {
    if (containerRef.current) {
      containerRef.current.style.scrollBehavior = "smooth";
      containerRef.current.scrollLeft += scrollOffset;
    }
  }

  return (
    <>
      <Tooltip content={l.see_detail}>
        <BButton
          iconButton
          borderRadius={"full"}
          variant={"ghost"}
          colorPalette={themeConfig.colorPalette}
          mr={-1}
          onClick={onOpen}
        >
          <IconEye />
        </BButton>
      </Tooltip>

      <DisclosureRoot open={open} lazyLoad size={"sm"}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={"Detail"} />
          </DisclosureHeader>

          <DisclosureBody px={0}>
            <CContainer position={"relative"}>
              <HStack
                ref={containerRef}
                className="scrollX"
                scrollSnapType={"x mandatory"}
              >
                <HStack>
                  {item.document.map((img: any, i: number) => {
                    return (
                      <Image
                        key={i}
                        src={`${BASE_STORAGE_URL}${img.file_path}`}
                        scrollSnapAlign={"center"}
                      />
                    );
                  })}
                </HStack>
              </HStack>

              {item.document.length > 1 && (
                <HStack
                  justify={"center"}
                  position={"absolute"}
                  right={2}
                  bottom={3}
                  w={"calc(100% - 16px)"}
                >
                  <BButton
                    iconButton
                    unclicky
                    borderRadius={"full"}
                    size={"sm"}
                    onClick={prev}
                  >
                    <IconChevronLeft />
                  </BButton>

                  <BButton
                    iconButton
                    unclicky
                    borderRadius={"full"}
                    size={"sm"}
                    onClick={next}
                  >
                    <IconChevronRight />
                  </BButton>
                </HStack>
              )}
            </CContainer>

            <CContainer px={4} mt={4}>
              <CContainer gap={2}>
                <Text fontSize={"xl"} fontWeight={"bold"}>
                  {item.name}
                </Text>
                <Text>{item.description}</Text>

                <HStack gap={1} align={"end"}>
                  <Text fontSize={"xl"} lineHeight={1.2}>
                    {item.amount - item.amount_usage}
                  </Text>
                  <Text>/</Text>
                  <Text>{item.amount}</Text>

                  <Text color={"fg.subtle"}>
                    ({item.amount_usage} {l.in_use})
                  </Text>
                </HStack>

                <Text color={"fg.subtle"} mt={2}>
                  {l.last_updated} {formatDate(item.updated_at)}{" "}
                  {formatTime(makeTime(item.updated_at))}
                </Text>
              </CContainer>
            </CContainer>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};

const CurrentInventory = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = [
    {
      id: 1,
      name: "Laptop",
      description: "Laptop untuk administrasi desa",
      amount: 10,
      amount_usage: 3,
      document: [
        {
          id: 101,
          user_id: 19,
          document_status_id: 2,
          verified_by: null,
          uploaded_by: null,
          file_id: "d148f339-198d-446b-a861-3401b3c6d668",
          file_name: "laptop_invoice.pdf",
          file_path: "https://bit.ly/sage-adebayo",
          file_mime_type: "application/pdf",
          file_size: "512 KB",
          reason: null,
          created_at: new Date("2025-03-22T10:21:41.000Z"),
          updated_at: new Date("2025-03-22T10:21:41.000Z"),
          document_status: {
            id: 2,
            label: "Diverifikasi",
            deleted_at: null,
            created_at: new Date("2025-03-22T10:21:31.000Z"),
            updated_at: new Date("2025-03-22T10:21:31.000Z"),
          },
          uploaded_user: null,
          verified_user: null,
        },
        {
          id: 101,
          user_id: 19,
          document_status_id: 2,
          verified_by: null,
          uploaded_by: null,
          file_id: "d148f339-198d-446b-a861-3401b3c6d668",
          file_name: "laptop_invoice.pdf",
          file_path: "https://bit.ly/sage-adebayo",
          file_mime_type: "application/pdf",
          file_size: "512 KB",
          reason: null,
          created_at: new Date("2025-03-22T10:21:41.000Z"),
          updated_at: new Date("2025-03-22T10:21:41.000Z"),
          document_status: {
            id: 2,
            label: "Diverifikasi",
            deleted_at: null,
            created_at: new Date("2025-03-22T10:21:31.000Z"),
            updated_at: new Date("2025-03-22T10:21:31.000Z"),
          },
          uploaded_user: null,
          verified_user: null,
        },
        {
          id: 101,
          user_id: 19,
          document_status_id: 2,
          verified_by: null,
          uploaded_by: null,
          file_id: "d148f339-198d-446b-a861-3401b3c6d668",
          file_name: "laptop_invoice.pdf",
          file_path: "https://bit.ly/sage-adebayo",
          file_mime_type: "application/pdf",
          file_size: "512 KB",
          reason: null,
          created_at: new Date("2025-03-22T10:21:41.000Z"),
          updated_at: new Date("2025-03-22T10:21:41.000Z"),
          document_status: {
            id: 2,
            label: "Diverifikasi",
            deleted_at: null,
            created_at: new Date("2025-03-22T10:21:31.000Z"),
            updated_at: new Date("2025-03-22T10:21:31.000Z"),
          },
          uploaded_user: null,
          verified_user: null,
        },
      ],
      deleted_at: null,
      created_at: new Date("2024-01-10"),
      updated_at: new Date("2024-03-15"),
    },
    {
      id: 2,
      name: "Printer",
      description: "Printer untuk pencetakan dokumen desa",
      amount: 5,
      amount_usage: 2,
      document: [
        {
          id: 102,
          user_id: 20,
          document_status_id: 1,
          verified_by: null,
          uploaded_by: null,
          file_id: "b251a2cd-1256-4f84-88c5-d4ea634aeec3",
          file_name: "printer_invoice.pdf",
          file_path: "https://bit.ly/sage-adebayo",
          file_mime_type: "application/pdf",
          file_size: "430 KB",
          reason: null,
          created_at: new Date("2025-03-23T12:15:22.000Z"),
          updated_at: new Date("2025-03-23T12:15:22.000Z"),
          document_status: {
            id: 1,
            label: "Menunggu Verifikasi",
            deleted_at: null,
            created_at: new Date("2025-03-23T12:14:50.000Z"),
            updated_at: new Date("2025-03-23T12:14:50.000Z"),
          },
          uploaded_user: null,
          verified_user: null,
        },
      ],
      deleted_at: null,
      created_at: new Date("2024-02-05"),
      updated_at: new Date("2024-03-10"),
    },
    {
      id: 3,
      name: "Meja Kantor",
      description: "Meja untuk perangkat desa",
      amount: 20,
      amount_usage: 5,
      document: [
        {
          id: 102,
          user_id: 20,
          document_status_id: 1,
          verified_by: null,
          uploaded_by: null,
          file_id: "b251a2cd-1256-4f84-88c5-d4ea634aeec3",
          file_name: "printer_invoice.pdf",
          file_path: "https://bit.ly/sage-adebayo",
          file_mime_type: "application/pdf",
          file_size: "430 KB",
          reason: null,
          created_at: new Date("2025-03-23T12:15:22.000Z"),
          updated_at: new Date("2025-03-23T12:15:22.000Z"),
          document_status: {
            id: 1,
            label: "Menunggu Verifikasi",
            deleted_at: null,
            created_at: new Date("2025-03-23T12:14:50.000Z"),
            updated_at: new Date("2025-03-23T12:14:50.000Z"),
          },
          uploaded_user: null,
          verified_user: null,
        },
      ],
      deleted_at: null,
      created_at: new Date("2023-12-20"),
      updated_at: new Date("2024-02-28"),
    },
  ];

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <Icon mb={"2px"}>
            <IconPackage size={20} />
          </Icon>

          <ItemHeaderTitle>{l.current_inventory}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} minH={ITEM_BODY_H}>
        <CContainer px={3} overflowY={"auto"} className="scrollY" mr={"-6px"}>
          {data.map((item, i) => {
            return (
              <HStack
                key={i}
                borderBottom={"1px solid {colors.gray.muted}"}
                px={2}
                py={2}
                gap={4}
              >
                <Text fontWeight={"medium"}>{item.name}</Text>

                <Tooltip content={`${item.amount_usage} ${l.in_use}`}>
                  <HStack ml={"auto"} gap={1}>
                    <Text>{item.amount - item.amount_usage}</Text>
                    <Text>/</Text>
                    <Text color={"fg.subtle"}>{item.amount}</Text>
                  </HStack>
                </Tooltip>

                <Detail item={item} />
              </HStack>
            );
          })}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default CurrentInventory;
