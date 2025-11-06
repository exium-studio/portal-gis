import getUserFromLocalStorage from "@/utils/getUserFromLocalStorage";

export const isPublicUser = () => {
  const user = getUserFromLocalStorage();
  return user?.id === 2;
};

export const isRoleSuperAdmin = () => {
  const user = getUserFromLocalStorage();
  return user?.role?.id === 1;
};

export const isRoleReguler = () => {
  const user = getUserFromLocalStorage();
  return user?.role?.id === 2;
};

export const isRoleViewer = () => {
  const user = getUserFromLocalStorage();
  return user?.role?.id === 3;
};

export const isWorkspaceCreatedBy = (createdByUserId: number) => {
  const user = getUserFromLocalStorage();
  return user?.id === createdByUserId;
};
