import { Router } from "express";
import {
  addPermissions,
  removePermissions,
  setRoleAndPermission,
  setRoleToUser,
} from "../controllers/RoleAndPermission.controller";
import { permisionCheck } from "../middleware/permissionCheck/permission.middleware";
import { protectRoute } from "../services/protectRoutes.service";

const SET_PERMISSION = process.env.SET_PERMISSION as string;
const RM_PERMISSION = process.env.RM_PERMISSION as string;
const ADD_PERMISSION = process.env.ADD_PERMISSION as string;
const SET_ROLE = process.env.SET_ROLE as string;

const setRoleAndPermissionRouter = Router();

setRoleAndPermissionRouter.patch(
  "/update/:id",
  [protectRoute, permisionCheck(SET_ROLE)],
  setRoleToUser,
);

setRoleAndPermissionRouter.patch(
  "/permissions/add/:role",
  [protectRoute, permisionCheck(ADD_PERMISSION)],
  addPermissions,
);

setRoleAndPermissionRouter.delete(
  "/permissions/remove/:role",
  [protectRoute, permisionCheck(RM_PERMISSION)],
  removePermissions,
);

setRoleAndPermissionRouter.post(
  "/set",
  [protectRoute, permisionCheck(SET_PERMISSION)],
  setRoleAndPermission,
);

export default setRoleAndPermissionRouter;
