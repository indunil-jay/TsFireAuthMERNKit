import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import validator from "validator";

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

export const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: user,
      },
    });
  }
);

type RequestBody = { [key: string]: string };
const filterObj = (obj: RequestBody, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    } else {
      throw new AppError(
        `Operation not allowed. Field '${el}' is not allowed to be modified.`,
        401
      );
    }
  });

  return newObj;
};

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1) Create error if user pass password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          `This route is not passwords updates. Please use /updateMyPassword`,
          400
        )
      );
    }
    //2 Update user document
    //filter body

    // Use RequestBody type for req.body
    const filteredBody = filterObj(req.body as RequestBody, "name", "email");

    const user = await User.findByIdAndUpdate(req.user?.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ status: "success", user });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user?.id, { active: false });

    res.status(204).json({ status: "success", data: null });
  }
);
