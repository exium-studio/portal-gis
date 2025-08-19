import BButton from "@/components/ui-custom/BButton";
import P from "@/components/ui-custom/P";
import { Avatar } from "@/components/ui/avatar";
import PageContainer from "@/components/widget/PageContainer";
import ResetPasswordDisclosureTrigger from "@/components/widget/ResetPasswordDisclosureTrigger";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useRequest from "@/hooks/useRequest";
import { VStack } from "@chakra-ui/react";

const ProfilePage = () => {
  // Hooks
  const { req, loading } = useRequest({
    id: "logout",
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // Contexts
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);

  // Utils
  function onSignout() {
    const url = `/api/signout`;

    const config = {
      url,
      method: "GET",
    };

    req({
      config,
      onResolve: {
        onSuccess: () => {
          localStorage.removeItem("__auth_token");
          localStorage.removeItem("__user_data");
          setAuthToken(undefined);
          setPermissions(undefined);
        },
      },
    });
  }

  return (
    <PageContainer flex={1} align={"center"} justify={"center"} gap={4}>
      <Avatar size={"2xl"} />

      <VStack gap={0}>
        <P textAlign={"center"} fontWeight={"semibold"}>
          Admin
        </P>
        <P textAlign={"center"}>admin@gmail.com</P>
      </VStack>

      <ResetPasswordDisclosureTrigger>
        <BButton variant={"outline"}>Reset password</BButton>
      </ResetPasswordDisclosureTrigger>

      <BButton
        onClick={onSignout}
        w={"fit"}
        colorPalette={"red"}
        variant={"ghost"}
        loading={loading}
      >
        Sign out
      </BButton>
    </PageContainer>
  );
};

export default ProfilePage;
