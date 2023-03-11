import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { RoleAndPermissionAttribute } from "../../interfaces/Roles&Permission.interface";

type RolePermissionCreationAttributes = Optional<
  RoleAndPermissionAttribute,
  "id"
>;

interface RoleAndPermissionInstance
  extends Model<RoleAndPermissionAttribute, RolePermissionCreationAttributes>,
    RoleAndPermissionAttribute {
  createdAt?: Date;
  updatedAt?: Date;
}
const RolesPermission = sequelize.define<RoleAndPermissionInstance>(
  "RoleAndPermission",
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Buyer", "Seller"),
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      unique: true,
    },
  },
  {
    modelName: "RolesPermission",
    tableName: "rolesAndPermissions",
  },
);

export default RolesPermission;
