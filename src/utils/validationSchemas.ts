import * as yup from "yup";
import JSZip from "jszip";

type FileValidationParams = {
  maxSizeMB?: number;
  allowedExtensions?: string[];
};

const fileValidation = ({
  maxSizeMB = 10,
  allowedExtensions,
}: FileValidationParams = {}): yup.MixedSchema =>
  yup
    .mixed()
    .test("fileType", "Harus berupa file", (value) => {
      return (
        Array.isArray(value) && value.every((item) => item instanceof File)
      );
    })
    .test("fileSize", "Ukuran file terlalu besar", (value) => {
      if (maxSizeMB && value) {
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        return (
          Array.isArray(value) &&
          value.every((file) => file.size <= maxSizeBytes)
        );
      }
      return true;
    })
    .test("fileExtension", "Ekstensi file tidak didukung", async (value) => {
      if (allowedExtensions && value) {
        return (
          Array.isArray(value) &&
          value.every((file) => {
            const fileName = file.name;
            const fileExtension = fileName.split(".").pop()?.toLowerCase();
            return allowedExtensions.includes(fileExtension || "");
          })
        );
      }
      return true;
    })
    .test(
      "zipContents",
      "Isi .zip file tidak sesuai dengan kriteria",
      async (value) => {
        if (Array.isArray(value)) {
          for (const file of value) {
            if (file.name.endsWith(".zip")) {
              const zip = await JSZip.loadAsync(file);
              const filesInZip = Object.keys(zip.files);

              if (filesInZip.length === 0) {
                return false; // ZIP kosong
              }

              const hasValidFile = filesInZip.some((fileName) => {
                const fileExtension = fileName.split(".").pop()?.toLowerCase();
                return allowedExtensions?.includes(fileExtension || "");
              });

              if (!hasValidFile) {
                return false; // Tidak ada file yang sesuai dalam ZIP
              }
            }
          }
        }
        return true;
      }
    );

export { fileValidation };
