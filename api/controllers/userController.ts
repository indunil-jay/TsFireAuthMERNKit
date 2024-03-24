import { Request, Response, NextFunction } from "express";
import User, { IUser, IUserDocument } from "../models/userModel";
import AppError from "../utils/appError";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, passwordConfirm }: IUser = req.body;

    //1) check both passwords are same
    if (password !== passwordConfirm) {
      return next(new AppError("passwords are not macthing.", 400));
    }

    //2) before saving database we need to encrpt password.(use middleware)

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    //3) remove password from output when sending response
    const { password: userPassword, ...userData } = user.toObject();

    res.status(200).json({ status: "success", data: { user: userData } });
  } catch (error) {
    // If an error occurs, send error response
    if (error instanceof AppError) {
      // Handle custom error with statusCode
      res
        .status(error.statusCode)
        .json({ status: "fail", message: error.message });
    } else {
      // Handle other errors
      res.status(500).json({ status: "error", message: error });
    }
  }
};
