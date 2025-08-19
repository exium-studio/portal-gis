import BButton from "@/components/ui-custom/BButton";
import CContainer from "@/components/ui-custom/CContainer";
import Img from "@/components/ui-custom/Img";
import LangSwitcher from "@/components/ui-custom/LangSwitcher";
import NavLink from "@/components/ui-custom/NavLink";
import { Avatar } from "@/components/ui/avatar";
import { ColorModeButton } from "@/components/ui/color-mode";
import ExiumWatermark from "@/components/widget/ExiumWatermark";
import SigninForm from "@/components/widget/SigninForm";
import useActiveWorkspaces from "@/context/useActiveWorkspaces";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useSelectedPolygon from "@/context/useSelectedPolygon";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import { Center, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";

const RootPage = () => {
  // Hooks
  const { req, loading } = useRequest({
    id: "logout",
    showLoadingToast: false,
    showSuccessToast: false,
  });
  const iss = useIsSmScreenWidth();

  // Contexts
  const authToken = useAuthMiddleware((s) => s.authToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setAuthToken = useAuthMiddleware((s) => s.setAuthToken);
  const { themeConfig } = useThemeConfig();
  const clearSelectedPolygon = useSelectedPolygon(
    (s) => s.clearSelectedPolygon
  );
  const clearActiveWorkspaces = useActiveWorkspaces(
    (s) => s.clearActiveWorkspaces
  );

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

  useEffect(() => {
    clearSelectedPolygon();
    clearActiveWorkspaces();
  }, []);

  return (
    <SimpleGrid columns={[1, null, 2]} h={"100dvh"} w={"full"} bg={"body"}>
      <CContainer p={4} justify={"space-between"} align={"center"}>
        <HStack>
          <LangSwitcher />

          <ColorModeButton ml={"auto"} />
        </HStack>

        {!authToken && <SigninForm />}

        {authToken && (
          <VStack gap={4}>
            <Avatar size={"2xl"} />

            <VStack gap={0}>
              <Text fontWeight={"semibold"}>Admin</Text>
              <Text>admin@gmail.com</Text>
            </VStack>

            <VStack>
              <NavLink to="/workspace" w={"fit"}>
                <BButton w={"160px"} colorPalette={themeConfig.colorPalette}>
                  Go to App
                </BButton>
              </NavLink>

              <BButton
                w={"160px"}
                variant={"ghost"}
                onClick={onSignout}
                loading={loading}
              >
                Signin
              </BButton>
            </VStack>
          </VStack>
        )}

        <VStack w={"full"} py={4}>
          <ExiumWatermark />
        </VStack>
      </CContainer>

      {!iss && (
        <Center p={12} bg={themeConfig.primaryColor}>
          <Img src={`/logo.png`} w={"full"} maxW={"300px"} />
        </Center>
      )}
    </SimpleGrid>
  );
};

export default RootPage;
