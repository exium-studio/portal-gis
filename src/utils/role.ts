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
  const user = getUserFromLocalStorage();
  if (user?.id === 1) return true;
  if (!createdByUserId) return false;
  if (isRoleSuperAdmin()) return true;
  return user?.id === createdByUserId;
};
