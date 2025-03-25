import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import HelperText from "@/components/ui-custom/HelperText";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import { Avatar } from "@/components/ui/avatar";
import { ITEM_BODY_H } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import makeCall from "@/utils/makeCall";
import makeWA from "@/utils/makeWA";
import { HStack, Icon, StackProps, Text } from "@chakra-ui/react";
import {
  IconAddressBook,
  IconBrandWhatsapp,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react";

const OfficialContact = ({ ...props }: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { l } = useLang();

  // States, Refs
  const data = [
    {
      id: 1,
      cp: {
        name: "Sendi Chicks",
        job_title: {
          name: "Lurah",
        },
      },
      title: "Urusan Kelurahan",
      description:
        "Bertanggung jawab atas administrasi dan pelayanan di tingkat kelurahan.",
      avatar: "https://bit.ly/sage-adebayo",
      wa: "+62 895-6221-89054",
      phone: "+62 895-6221-89054",
      address: "Jl. Merdeka No. 1, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/rudi.tabuti",
        x: "https://twitter.com/rudi_tabuti",
        ig: "https://instagram.com/rudi.tabuti",
      },
    },
    {
      id: 2,
      cp: {
        name: "Siti Marni",
        job_title: {
          name: "Sekretaris Desa",
        },
      },
      title: "Administrasi Desa",
      description: "Mengelola dokumen dan surat-menyurat desa.",
      avatar: "https://bit.ly/dummy-avatar",
      wa: "0819327483920",
      phone: "0819327483920",
      address: "Jl. Pahlawan No. 5, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/siti.marni",
        x: "https://twitter.com/siti_marni",
        ig: "https://instagram.com/siti.marni",
      },
    },
    {
      id: 3,
      cp: {
        name: "Budi Santoso",
        job_title: {
          name: "Kasi Pelayanan",
        },
      },
      title: "Pelayanan Masyarakat",
      description:
        "Membantu masyarakat dalam pengurusan surat-surat dan pelayanan lainnya.",
      avatar: "https://bit.ly/dummy-avatar",
      wa: "0819876543210",
      phone: "0819876543210",
      address: "Jl. Kemakmuran No. 10, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/budi.santoso",
        x: "https://twitter.com/budi_santoso",
        ig: "https://instagram.com/budi.santoso",
      },
    },
    {
      id: 4,
      cp: {
        name: "Yoyok Sip",
        job_title: {
          name: "Kasi Pelayanan",
        },
      },
      title: "Pelayanan Masyarakat",
      description:
        "Membantu masyarakat dalam pengurusan surat-surat dan pelayanan lainnya.",
      avatar: "https://bit.ly/dummy-avatar",
      wa: "0819876543210",
      phone: "0819876543210",
      address: "Jl. Kemakmuran No. 10, Desa Sukamaju, Kecamatan Sejahtera",
      socials: {
        fb: "https://facebook.com/budi.santoso",
        x: "https://twitter.com/budi_santoso",
        ig: "https://instagram.com/budi.santoso",
      },
    },
  ];

  console.log("Official contat", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <IconAddressBook />
          <ItemHeaderTitle>{l.official_contact}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} h={ITEM_BODY_H}>
        <CContainer px={3} overflowY={"auto"} className="scrollY" mr={"-6px"}>
          {data.map((item, i) => {
            return (
              <CContainer
                key={i}
                px={2}
                py={4}
                flex={1}
                borderBottom={
                  i !== data.length - 1 ? "1px solid {colors.border.muted}" : ""
                }
              >
                <Text fontSize={"md"} fontWeight={"bold"} mb={2}>
                  {item.title}
                </Text>

                <Text mb={2}>{item.description}</Text>

                <HStack mb={4} align={"start"}>
                  <Icon color="fg.muted">
                    <IconMapPin stroke={1.5} size={18} />
                  </Icon>
                  <Text color="fg.muted">{item.address}</Text>
                </HStack>

                <HStack gap={4}>
                  <Avatar src={item.avatar} />
                  <CContainer>
                    <HelperText>{item.cp.job_title.name}</HelperText>
                    <Text fontWeight={"bold"}>{item.cp.name}</Text>
                  </CContainer>

                  <HStack>
                    <BButton
                      iconButton
                      borderRadius={"full"}
                      variant={"subtle"}
                      colorPalette={themeConfig.colorPalette}
                      onClick={() => {
                        makeCall(item.phone);
                      }}
                    >
                      <IconPhone />
                    </BButton>
                    <BButton
                      iconButton
                      borderRadius={"full"}
                      variant={"subtle"}
                      colorPalette={themeConfig.colorPalette}
                      onClick={() => {
                        makeWA(item.wa);
                      }}
                    >
                      <IconBrandWhatsapp />
                    </BButton>
                  </HStack>
                </HStack>
              </CContainer>
            );
          })}
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default OfficialContact;
