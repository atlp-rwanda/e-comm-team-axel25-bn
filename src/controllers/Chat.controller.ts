import { Socket } from "socket.io";
import Chat from "../database/models/Chat.model";
import { Request, Response } from "express";

export const chat = (socket: Socket) => {
  socket.on("chat message", async (msg) => {
    const { email, surname, given_name, id } = socket.data.user;
    Chat.create({ message: msg, senderId: id }).then(() => {
      socket.broadcast.emit("chat message", {
        message: msg,
        sender: { email, surname, given_name },
      });
    });
  });
};

export const getChat = async (req: Request, res: Response) => {
  try {
    if (req.query.df) {
      throw new Error("no parameters required");
    }
    const messages = await Chat.findAll();
    res.status(200).json({ status: 200, success: true, data: messages });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Error while get chats",
        error: error.message,
      });
    }
  }
};
