import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import LangSwitcher from "@/components/ui-custom/LangSwitcher";
import NavLink from "@/components/ui-custom/NavLink";
import { Avatar } from "@/components/ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import SigninForm from "@/components/widget/SigninForm";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { HStack, Text, VStack } from "@chakra-ui/react";

const RootPage = () => {
  // Hooks
  const { req, loading } = useRequest({
    id: "logout",
    showLoadingToast: false,
    showSuccessToast: false,
  });

  // Contexts
  const authToken = useAuthMiddleware((s) => s.authToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);
  const { themeConfig } = useThemeConfig();

  // States
  const currentYear = new Date().getFullYear();

  // Utils
  function logout() {
    const url = `/api/logout`;

    const config = {
      url,
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
    <CContainer
      p={4}
      justify={"center"}
      align={"center"}
      minH={"100dvh"}
      bg={"bg.subtle"}
    >
      <HStack>
        <LangSwitcher />

        <ColorModeButton ml={"auto"} />
      </HStack>

      <CContainer justify={"center"} align={"center"} m={"auto"}>
        {!authToken && <SigninForm />}

        {authToken && (
          <VStack gap={4}>
            <Avatar size={"2xl"} />

            <VStack gap={0}>
              <Text fontWeight={"semibold"}>Admin Piramid</Text>
              <Text>admin@piramid.com</Text>
            </VStack>

            <VStack>
              <NavLink to="/dashboard" w={"fit"}>
                <BButton w={"160px"} colorPalette={themeConfig.colorPalette}>
                  Go to Dashboard
                </BButton>
              </NavLink>

              <BButton
                w={"160px"}
                variant={"ghost"}
                onClick={logout}
                loading={loading}
              >
                Signin
              </BButton>
            </VStack>
          </VStack>
        )}
      </CContainer>

      <VStack w={"full"} py={4}>
        <Text textAlign={"center"} fontSize={"sm"}>
          © {currentYear} powered by{" "}
          <span style={{ fontWeight: 600 }}>Exium</span>
        </Text>
      </VStack>
    </CContainer>
  );
};

export default RootPage;
