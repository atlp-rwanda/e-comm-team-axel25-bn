import { NextFunction, Request, Response } from "express";
import User from "../database/models/User.model";
import { verifyToken } from "../utils";
import { Status } from "../interfaces";

export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (
    !(
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
  ) {
    return res.status(401).json({
      error: "not authorized",
      status: 401,
      success: false,
    });
  }

  try {
    token = req.headers.authorization.split(" ")[1];

    const decodedData = await verifyToken(token);

    const user = await User.findByPk(decodedData.payload.toString());

    if (!user) throw new Error("user not found");
    if (user.status === Status.Disabled) {
      throw new Error("this account was disabled");
    }
    req.user = user.dataValues;

    const origins = [
      "/api/v1/auth/2fa",
      "/api/v1/auth/2fa/disable",
      "/api/v1/auth/2fa/verify2FAToken",
    ];
    if (origins.includes(req.originalUrl)) {
      return next();
    }

    if (user.twoFAenabled) {
      if (user.twoFAverified) {
        return next();
      }
      return res.status(400).json({
        verified: false,
        status: 400,
        message: "please verify your code sent to your email",
      });
    }

    next();
  } catch (err) {
    if (err instanceof Error) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Error when verifying token",
        error: err.message,
      });
    }
  }
};
