import getUserFromLocalStorage from "@/utils/getUserFromLocalStorage";

export const isPublicUser = () => {
  const user = getUserFromLocalStorage();
  console.log(user);
  return user?.id === 2;
};
