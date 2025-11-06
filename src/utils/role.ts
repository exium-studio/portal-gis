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

export const isWorkspaceCreatedBy = (
  createdByUserId: number | undefined | null
) => {
  if (!createdByUserId) return false;
  const user = getUserFromLocalStorage();
  if (isRoleSuperAdmin()) return true;
  return user?.id === createdByUserId;
};
