import getUserFromLocalStorage from "@/utils/getUserFromLocalStorage";

export const isPublicUser = () => {
  const user = getUserFromLocalStorage();
  return user?.id === 2;
};
