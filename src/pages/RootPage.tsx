import CContainer from "@/components/ui-custom/CContainer";
import LoginForm from "@/components/widget/LoginForm";

const RootPage = () => {
  return (
    <CContainer p={5} justify={"center"} minH={"100dvh"}>
      <LoginForm />
    </CContainer>
  );
};

export default RootPage;
