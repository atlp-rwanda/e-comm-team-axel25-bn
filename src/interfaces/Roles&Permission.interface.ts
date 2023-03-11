import { Role } from "./User.interface";

export interface RoleAndPermissionAttribute {
  id: string;
  role: Role;
  permissions: [];
}
