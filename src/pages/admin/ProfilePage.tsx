import BButton from "@/components/ui-custom/BButton";
import PageContainer from "@/components/widget/PageContainer";
import { IconSettings } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  return (
    <PageContainer>
      <Link to={"/settings"}>
        <BButton iconButton variant={"ghost"}>
          <IconSettings />
        </BButton>
      </Link>
    </PageContainer>
  );
};

export default ProfilePage;
