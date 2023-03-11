import { NextFunction, Request, Response } from "express";
import { RoleAndPermissionAttribute } from "../../interfaces/Roles&Permission.interface";
import { findOneUserByIdService } from "../../services";
import { getRoleAndPermisson } from "../../services/RolesAndPermission.service";
import { jwtUtility } from "../../utils";

export const permisionCheck = (routePermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const reqInfo = routePermission;

    if (!req.headers.authorization) {
      return res.status(401).send({
        status: 401,
        success: false,
        message: "You are not logged in",
      });
    } else {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedData = jwtUtility.verifyToken(token);
        const currentUser = await findOneUserByIdService(decodedData);
        if (!currentUser) {
          return res.status(403).json({
            statusCode: 403,
            success: false,
            message: "Unauthorized access. User not found",
          });
        }
        req.user = currentUser.dataValues;
        const roleAndPermisson = await getRoleAndPermisson(req.user.role);
        const parsedRoleAndPermisson: RoleAndPermissionAttribute = JSON.parse(
          JSON.stringify(roleAndPermisson),
        );

        if (parsedRoleAndPermisson) {
          const index: number[] = [];
          parsedRoleAndPermisson.permissions.map((permission: string) => {
            if (permission === reqInfo) {
              index.push(1);
            } else {
              index.push(-1);
            }
          });

          const indexCh = index.indexOf(1);
          if (indexCh !== -1) {
            next();
          } else {
            return res.status(403).json({
              status: 403,
              success: false,
              message: `You haven't Authority to perform this action "${reqInfo}"`,
            });
          }
        } else {
          return res.status(404).json({
            status: 404,
            success: false,
            message:
              "Sorry we don't have that role yet! If you think this is an error please contact System administrator",
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({
            status: 500,
            success: false,
            message: `${error.message}`,
          });
        }
      }
    }
  };
};
