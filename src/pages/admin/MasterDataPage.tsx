import ItemContainer from "@/components/ui-custom/ItemContainer";
import { EmptyState } from "@/components/ui/empty-state";
import useLang from "@/context/useLang";
import { Icon } from "@chakra-ui/react";
import { IconServerCog } from "@tabler/icons-react";

const MasterDataPage = () => {
  // Contexts
  const { l } = useLang();

  return (
    <ItemContainer minH={"full"} py={10} flex={1}>
      <EmptyState
        icon={
          <Icon>
            <IconServerCog />
          </Icon>
        }
        title={l.settings_page.title}
        description={l.settings_page.description}
        m={"auto"}
      />
    </ItemContainer>
  );
};

export default MasterDataPage;
