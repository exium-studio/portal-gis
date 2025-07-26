import useScreen from "./useScreen";

const useIsSmScreenWidth = () => {
  const { sw } = useScreen();

  return sw < 720;
};

export default useIsSmScreenWidth;
