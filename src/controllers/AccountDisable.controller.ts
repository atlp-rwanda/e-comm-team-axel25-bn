import { Request, Response } from "express";
import User from "../database/models/User.model";
import DisabledAccount from "../database/models/DisabledAccount.model";
import { Status } from "../interfaces";

export const accountDisable = async (req: Request, res: Response) => {
  try {
    const { userId, reason } = req.body;
    const user = await User.findByPk(userId);
    if (user) {
      const disablingReason = await DisabledAccount.create({
        previousStatus: Status.Active,
        reason,
        userId: user.id,
      });
      await user.update({ status: Status.Disabled });
      res.status(200).json({
        message: `user account disable ${user.id}`,
        status: 200,
        data: disablingReason,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({
        status: 500,
        success: false,
        message: `Internal server error: ${error.message}`,
      });
    }
  }
};
