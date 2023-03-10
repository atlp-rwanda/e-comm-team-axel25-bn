import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../database/models/User.model";

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

    if (newPassword !== newPasswordConfirmation) {
      throw new Error(
        "password missmatch, newpassword and confimation password are not the same",
      );
    }

    if (!bcrypt.compareSync(currentPassword, req.user.password)) {
      throw new Error(
        "you may have forgoten your password, enter your old pasword correctly",
      );
    }

    await User.update(
      { password: newPassword, lastPasswordUpdate: new Date() },
      { where: { id: req.user.id } },
    );

    res.status(200).json({
      message: "password updated successfull",
      statusCode: 200,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message, statusCode: 500 });
    }
  }
};
