import CContainer from "@/components/ui-custom/CContainer";
import ItemContainer from "@/components/ui-custom/ItemContainer";
import ItemHeaderContainer from "@/components/ui-custom/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/ui-custom/ItemHeaderTitle";
import useLang from "@/context/useLang";
import { HStack, StackProps, Text } from "@chakra-ui/react";
import { IconSparkles } from "@tabler/icons-react";

const VisionMission = ({ ...props }: StackProps) => {
  // Contexts
  const { l } = useLang();

  // States, Refs
  const data = {
    name: "Desa Makmur Jaya",
    vision:
      "Mewujudkan Desa Makmur Jaya yang Mandiri, Sejahtera, dan Berbudaya Berbasis Kearifan Lokal.",
    mission: [
      "Meningkatkan kesejahteraan masyarakat melalui pengembangan ekonomi berbasis pertanian, peternakan, dan UMKM.",
      "Meningkatkan kualitas sumber daya manusia melalui pendidikan, pelatihan, dan pemberdayaan masyarakat.",
      "Meningkatkan infrastruktur desa guna menunjang aktivitas ekonomi dan kesejahteraan masyarakat.",
      "Mewujudkan tata kelola pemerintahan desa yang transparan, akuntabel, dan partisipatif.",
      "Melestarikan budaya dan kearifan lokal sebagai identitas desa yang berdaya saing.",
      "Mengembangkan potensi pariwisata desa berbasis alam dan budaya untuk meningkatkan pendapatan desa.",
      "Meningkatkan kualitas layanan kesehatan dan kebersihan lingkungan untuk masyarakat yang lebih sehat.",
    ],
  };

  console.log("Visi Misi", data);

  return (
    <ItemContainer {...props}>
      <ItemHeaderContainer>
        <HStack>
          <IconSparkles size={20} />
          <ItemHeaderTitle>
            {l.vision} {l.and} {l.mission.toLowerCase()}
          </ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer pb={2} h={"500px"}>
        <CContainer
          pt={4}
          pb={2}
          overflowY={"scroll"}
          mr={"-6px"}
          className="scrollY"
          px={3}
        >
          <CContainer px={2}>
            <Text color={"fg.muted"} mb={1}>
              {l.vision}
            </Text>
            <Text fontWeight={"medium"}>{data.vision}</Text>

            <Text color={"fg.muted"} mt={4} mb={1}>
              {l.mission}
            </Text>
          </CContainer>

          <CContainer as={"ol"} gap={4}>
            {data.mission.map((item, i) => {
              return (
                <HStack
                  key={i}
                  px={2}
                  fontWeight={"medium"}
                  align={"start"}
                  borderBottom={
                    i !== data.mission.length - 1
                      ? "1px solid {colors.border.muted}"
                      : ""
                  }
                  pb={i !== data.mission.length - 1 ? 4 : 0}
                >
                  <Text>{i + 1}</Text>
                  <Text>{item}</Text>
                </HStack>
              );
            })}
          </CContainer>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};

export default VisionMission;
