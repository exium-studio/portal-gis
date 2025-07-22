import { BASE_STORAGE_URL } from "@/constants/paths";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import back from "@/utils/back";
import { HStack, Icon, StackProps, Text } from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import ConfirmationDisclosure from "./ConfirmationDisclosure";
import FileIcon from "../ui-custom/FileIcon";

interface Props extends StackProps {
  initialFiles?: any[];
  onChangeSetter?: (newState: number[]) => void;
}
const PreviousAttachment = (props: Props) => {
  // Props
  const { initialFiles, onChangeSetter, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const [files, setFiles] = useState(initialFiles);
  const [deletedFiles, setDeletedFiles] = useState<number[]>([]);

  return files && files?.length > 0 ? (
    <CContainer gap={2} {...restProps}>
      <Text fontWeight={"medium"}>{l.previous_attachment}</Text>

      <CContainer gap={3}>
        {files.map((item: any, i: number) => {
          return (
            <HStack
              key={i}
              border={"1px solid {colors.border.muted}"}
              px={4}
              py={2}
              h={"54px"}
              gap={4}
              borderRadius={themeConfig.radii.component}
              justify={"space-between"}
            >
              <Link
                to={`${BASE_STORAGE_URL}/${item.file_path}`}
                target="_blank"
              >
                <HStack gap={3}>
                  <Icon color="fg.muted">
                    <FileIcon mimeType={item.file_mime_type} />
                  </Icon>

                  <CContainer>
                    <Text>{item.file_name}</Text>
                    <Text fontSize={"xs"} color={"fg.muted"}>
                      {item.file_size}
                    </Text>
                  </CContainer>
                </HStack>
              </Link>

              <ConfirmationDisclosure
                id={`delete-announcement-attachment-${item.id}`}
                title={`${l.delete_label}?`}
                description={l.delete_previous_attachment}
                confirmCallback={() => {
                  const newDeletedFiles = [...deletedFiles, item.id];
                  setDeletedFiles(newDeletedFiles);
                  const newFiles = files.filter(
                    (prevItem) => prevItem.id !== item.id
                  );
                  setFiles(newFiles);
                  onChangeSetter?.(deletedFiles);
                  back();
                }}
                confirmLabel={l.delete_label}
                confirmButtonProps={{
                  colorPalette: "red",
                }}
              >
                <BButton
                  iconButton
                  size={"xs"}
                  borderRadius={"full"}
                  mr={-2}
                  variant={"ghost"}
                  color={"fg.error"}
                >
                  <IconTrash />
                </BButton>
              </ConfirmationDisclosure>
            </HStack>
          );
        })}
      </CContainer>
    </CContainer>
  ) : (
    ""
  );
};

export default PreviousAttachment;
