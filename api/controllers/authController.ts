import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    //4)create jwt token successfully created user.
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });

    // define cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    // send via response, browser cookies
    res.cookie("jwt", token, cookieOptions);

    return res
      .status(200)
      .json({ token, status: "success", data: { user: userData } });
  }
);
