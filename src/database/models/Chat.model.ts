import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
import { ChatAttributes } from "../../interfaces";

type ChatCreationAttributes = Optional<ChatAttributes, "id">;

interface ChatInstance
  extends Model<ChatAttributes, ChatCreationAttributes>,
    ChatAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Chat = sequelize.define<ChatInstance>(
  "Chat",
  {
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    senderId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    modelName: "Chat",
    tableName: "chats",
  },
);

export default Chat;
