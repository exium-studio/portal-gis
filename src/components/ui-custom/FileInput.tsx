import useLang from "@/context/useLang";
import empty from "@/utils/empty";
import formatBytes from "@/utils/formatBytes";
import { Icon, useFieldContext } from "@chakra-ui/react";
import { IconUpload } from "@tabler/icons-react";
import {
  FileUploadDropzone,
  FileUploadList,
  FileUploadRoot,
  FileUploadRootProps,
  FileUploadTrigger,
} from "../ui/file-button";
import BButton from "./BButton";
import FileIcon from "./FileIcon";

interface Props extends FileUploadRootProps {
  fRef?: any;
  name?: string;
  onChangeSetter?: (inputValue: File[] | undefined) => void;
  inputValue?: File[] | string | undefined;
  accept?: string;
  invalid?: boolean;
  placeholder?: string;
  initialFilepath?: string;
  label?: string;
  dropzone?: boolean;
  maxFileSize?: number;
  maxFiles?: number;
  description?: string;
  disabled?: boolean;
}
const FileInput = (props: Props) => {
  // Props
  const {
    fRef,
    name,
    onChangeSetter,
    inputValue,
    accept,
    invalid,
    placeholder,
    initialFilepath,
    label,
    dropzone,
    maxFileSize,
    maxFiles = 1,
    description = `up to ${props.maxFileSize || 10} MB, max ${
      props?.maxFiles || 1
    } file${props?.maxFiles!! > 1 ? "s" : ""}`,
    disabled,
    ...restProps
  } = props;

  // Hooks
  const { l } = useLang();

  // Contexts
  const fc = useFieldContext();

  // States
  const singleFileInputted = maxFiles === 1 && !empty(inputValue);
  const singleFile = inputValue?.[0] as File;
  const finalIcon = singleFileInputted ? (
    <FileIcon name={singleFile.name} mimeType={singleFile.type} size={"2xl"} />
  ) : undefined;
  const finalLabel = singleFileInputted
    ? singleFile?.name
    : l.file_dropzone_label;
  const finalDescription = singleFileInputted
    ? formatBytes(singleFile?.size)
    : `${description} ${accept ? `(${accept})` : ""}`;

  // Utils
  const handleFileChange = (details: any) => {
    let files = details.acceptedFiles || [];

    if (maxFiles && files.length > maxFiles) {
      files = files.slice(0, maxFiles);
    }

    if (onChangeSetter) {
      onChangeSetter(files.length > 0 ? files : undefined);
    }
  };

  return (
    <FileUploadRoot
      ref={fRef}
      alignItems="stretch"
      onFileChange={handleFileChange}
      // onFileReject={() => {
      //   toaster.error({
      //     title: l.error_file_input.title,
      //     description: l.error_file_input.description,
      //     action: {
      //       label: "Close",
      //       onClick: () => {},
      //     },
      //   });
      // }}
      maxFiles={maxFiles}
      gap={2}
      accept={accept}
      {...restProps}
    >
      <>
        {dropzone ? (
          <FileUploadDropzone
            icon={finalIcon}
            label={finalLabel}
            description={finalDescription}
            border={"2px dashed"}
            borderColor={
              invalid ?? fc?.invalid ? "border.error" : "border.muted"
            }
            opacity={disabled ? 0.5 : 1}
            cursor={disabled ? "disabled" : "pointer"}
          />
        ) : (
          <FileUploadTrigger asChild borderColor={invalid ? "fg.error" : ""}>
            <BButton
              variant="outline"
              borderColor={
                invalid ?? fc?.invalid ? "border.error" : "border.muted"
              }
            >
              <Icon scale={0.8}>
                <IconUpload />
              </Icon>{" "}
              {label || "File upload"}
            </BButton>
          </FileUploadTrigger>
        )}

        {!singleFileInputted && <FileUploadList files={inputValue as File[]} />}
      </>
    </FileUploadRoot>
  );
};

export default FileInput;
