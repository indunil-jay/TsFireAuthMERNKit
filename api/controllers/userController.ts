import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await User.find();

    return res.status(200).json({
      status: "success",
      length: users.length,
      data: {
        users,
      },
    });
  }
);

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new AppError("There is no user with that ID.", 404));

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) return next(new AppError("There is no user with that ID.", 404));

    return res.status(200).json({
      status: "success",
      message: "user update successfully",
      data: {
        user,
      },
    });
  }
);

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return next(new AppError("There is no user with that ID.", 404));

    return res.status(200).json({
      status: "success",
      message: "user delete succefully.",
      data: null,
    });
  }
);
