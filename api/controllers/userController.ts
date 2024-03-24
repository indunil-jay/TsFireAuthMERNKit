import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    console.log(users);

    res.status(200).json({
      status: "sucess",
      length: users.length,
      data: {
        users,
      },
    });
  }
);
