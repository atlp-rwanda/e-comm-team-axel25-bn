import exp from "constants";
import RolesPermission from "../database/models/Roles&Permission.model";
import User from "../database/models/User.model";
import { UserAttributes } from "../interfaces";
import { RoleAndPermissionAttribute } from "../interfaces/Roles&Permission.interface";

export const setUserRoleService = async (
  parsedDataToUpdate: UserAttributes,
  wantedUser: string,
) => {
  const updatedUserRole = await User.update(parsedDataToUpdate, {
    where: { id: wantedUser },
    returning: true,
  });
  return updatedUserRole;
};

export const setRoleAndPermissionServise = async (
  roleAndPermisson: RoleAndPermissionAttribute,
) => {
  const setRoleAndPermissionRequest = await RolesPermission.create(
    roleAndPermisson,
  );
  return setRoleAndPermissionRequest;
};

export const getRoleAndPermisson = async (role: string) => {
  const roleAndPermission = await RolesPermission.findOne({
    where: { role },
  });
  return roleAndPermission;
};

export const getAllRolesAndPermissons = async () => {
  const rolesAndPermissions = await RolesPermission.findAll();
  return rolesAndPermissions;
};

export const updatePermissionsService = async (
  parsedDataToUpdate: RoleAndPermissionAttribute,
  role: string,
) => {
  const updatedUserPermission = await RolesPermission.update(
    parsedDataToUpdate,
    {
      where: { role },
      returning: true,
    },
  );
  return updatedUserPermission;
};

export const deleteRoleService = async (role: string) => {
  const destroyedRole = await RolesPermission.destroy({
    where: { role },
  });
  return destroyedRole;
};
