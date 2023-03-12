import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { DisabledAccountAttributes } from "../../interfaces";

type DisabledAccountCreationAttributes = Optional<
  DisabledAccountAttributes,
  "id"
>;

interface DisabledAccountInstance
  extends Model<DisabledAccountAttributes, DisabledAccountCreationAttributes>,
    DisabledAccountAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const DisabledAccount = sequelize.define<DisabledAccountInstance>(
  "DisabledAccount",
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    previousStatus: {
      type: DataTypes.ENUM("Pending", "Active", "Disabled"),
      defaultValue: "Pending",
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    modelName: "DisabledAccount",
    tableName: "disabled_accounts",
  },
);

export default DisabledAccount;
