import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import BButton from "../ui-custom/BButton";
import CContainer from "../ui-custom/CContainer";
import FileIcon from "../ui-custom/FileIcon";
import P from "../ui-custom/P";
import { Link } from "react-router-dom";
import formatBytes from "@/utils/formatBytes";

interface Props extends StackProps {
  data: any;
  withDeleteButton?: boolean;
  onDelete?: () => void;
  withUndobutton?: boolean;
  onUndo?: () => void;
}

const ExistingFileItem = (props: Props) => {
  // Props
  const {
    data,
    withDeleteButton = true,
    onDelete,
    withUndobutton = false,
    onUndo,
    ...restProps
  } = props;

  // console.log("file", data);

  // Contexts
  const { themeConfig } = useThemeConfig();
  return (
    <HStack
      py={2}
      px={4}
      pr={3}
      borderRadius={themeConfig.radii.container}
      border={"1px solid"}
      borderColor={"border.muted"}
      gap={4}
      justify={"space-between"}
      {...restProps}
    >
      <Link
        to={data?.file_url}
        target="_blank"
        style={{
          width: "100%",
        }}
      >
        <HStack gap={4}>
          <FileIcon flexShrink={0} mimeType={data?.file_mime_type} />

          <CContainer flex={1}>
            <P lineClamp={1}>{`${data?.file_name}`}</P>
            <P fontSize={"xs"} color={"fg.muted"}>
              {`${formatBytes(data?.file_size)}`}
            </P>
          </CContainer>
        </HStack>
      </Link>

      <HStack justify={"end"}>
        {withDeleteButton && (
          <BButton
            flexShrink={0}
            iconButton
            size={"xs"}
            variant={"ghost"}
            colorPalette={"red"}
            onClick={onDelete}
          >
            <Icon boxSize={5}>
              <IconTrash />
            </Icon>
          </BButton>
        )}

        {withUndobutton && (
          <BButton
            flexShrink={0}
            size={"xs"}
            onClick={onUndo}
            variant={"ghost"}
            colorPalette={"gray"}
          >
            Undo
          </BButton>
        )}
      </HStack>
    </HStack>
  );
};

export default ExistingFileItem;
