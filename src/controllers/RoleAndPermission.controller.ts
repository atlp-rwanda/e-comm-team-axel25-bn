import { Request, Response } from "express";
import { UserAttributes } from "../interfaces";
import { RoleAndPermissionAttribute } from "../interfaces/Roles&Permission.interface";
import { findOneUserService } from "../services";
import {
  deleteRoleService,
  getAllRolesAndPermissons,
  getRoleAndPermisson,
  setRoleAndPermissionServise,
  setUserRoleService,
  updatePermissionsService,
} from "../services/RolesAndPermission.service";

// Admin set role to a particular user
export const setRoleToUser = async (req: Request, res: Response) => {
  try {
    const wantedUser = req.params.id;
    const oneUser = await findOneUserService(wantedUser);

    if (oneUser) {
      const parsedOneUser: UserAttributes = JSON.parse(JSON.stringify(oneUser));

      parsedOneUser.role = req.body.role;

      const updatedUserRole = await setUserRoleService(
        parsedOneUser,
        wantedUser,
      );

      return res.status(200).json({
        status: 200,
        success: true,
        data: updatedUserRole,
      });
    } else {
      res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Error occur while seting role and permission",
        error: error.message,
      });
    }
  }
};

// Admin set permissions w.r.t role
export const setRoleAndPermission = async (req: Request, res: Response) => {
  try {
    const roleAndPermissonInfo = req.body as RoleAndPermissionAttribute;

    if (await getRoleAndPermisson(req.body.role)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Either similar Role or list permissions exist!",
      });
    }

    const roleAndPermisson = await setRoleAndPermissionServise(
      roleAndPermissonInfo,
    );
    return res.status(201).json({
      status: 201,
      success: true,
      data: roleAndPermisson,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Error occur while seting permission",
        error: error.message,
      });
    }
  }
};

// Admin add a permission(s) from particular roles
export const addPermissions = async (req: Request, res: Response) => {
  try {
    const role = req.params.role;
    const permissions: [] = req.body;
    const alreadyExist: [] = [];

    const roleAndPermisson = await getRoleAndPermisson(role);
    const parsedRoleAndPermisson: RoleAndPermissionAttribute = JSON.parse(
      JSON.stringify(roleAndPermisson),
    );

    if (parsedRoleAndPermisson) {
      for (let i = 0; i < permissions.length; i++) {
        const index = parsedRoleAndPermisson.permissions.indexOf(
          permissions[i],
        );
        if (index !== -1) {
          alreadyExist.push(permissions[i]);
        } else {
          parsedRoleAndPermisson.permissions.push(permissions[i]);
        }
      }
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Role not found",
      });
    }
    const updates = await updatePermissionsService(
      parsedRoleAndPermisson,
      role,
    );

    if (alreadyExist.length !== 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: `The following permision(s) "${alreadyExist}" already exist!`,
        data: JSON.parse(JSON.stringify(updates))[1][0],
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      data: JSON.parse(JSON.stringify(updates))[1][0],
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Error occur while removing permission(s)",
        error: error.message,
      });
    }
  }
};

// Admin remove a permission(s) from particular roles
export const removePermissions = async (req: Request, res: Response) => {
  try {
    const role = req.params.role;
    const permissions: string[] = req.body;

    const roleAndPermisson = await getRoleAndPermisson(role);
    const parsedRoleAndPermisson: RoleAndPermissionAttribute = JSON.parse(
      JSON.stringify(roleAndPermisson),
    );

    if (parsedRoleAndPermisson) {
      permissions.map((permission: string) => {
        parsedRoleAndPermisson.permissions.map((permissionInDB) => {
          if (permission == permissionInDB) {
            const index =
              parsedRoleAndPermisson.permissions.indexOf(permissionInDB);
            parsedRoleAndPermisson.permissions.splice(index, 1);
          }
        });
      });

      if (parsedRoleAndPermisson.permissions.length === 0) {
        await deleteRoleService(role);
        return res.status(200).json({
          status: 200,
          success: true,
          message: `Permission table to this ${role} role is empty, so it's deleted`,
          data: JSON.parse(JSON.stringify(await getAllRolesAndPermissons())),
        });
      }
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Role not found",
      });
    }
    const updates = await updatePermissionsService(
      parsedRoleAndPermisson,
      role,
    );
    res.status(200).json({
      status: 200,
      success: true,
      data: JSON.parse(JSON.stringify(updates))[1][0],
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Error occur while removing permission(s)",
        error: error.message,
      });
    }
  }
};
