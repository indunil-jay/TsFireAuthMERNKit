import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/userModel";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { ObjectId } from "mongodb";

const signToken = (id: ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm, photo }: IUser = req.body;

    //1) check both passwords are same
    // if (password !== passwordConfirm) {
    //   return next(new AppError("passwords are not macthing.", 400));
    // }

    //2) before saving database we need to encrpt password.(use middleware)

    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      photo,
    });

    //3) remove password from output when sending response
    const { password: userPassword, ...userData } = user.toObject();

    //4)create jwt token successfully created user.
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    //   expiresIn: process.env.JWT_EXPIRE_TIME,
    // });

    const token = signToken(user._id);

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

export const singin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: IUser = req.body;

    //1) check if email amd password exits
    if (!email || !password)
      return next(new AppError("Please Provide email and password", 400));
    //2)  check if user exits && password is correct
    //check user is exits
    const user = await User.findOne({ email }).select("+password");
    // check password is matching (usermodel middleware)
    // const isMatched = await user?.correctPassword(password, user?.password);

    if (!user || !(await user?.correctPassword(password, user?.password))) {
      return next(new AppError(`Incorrect email or password`, 401));
    }

    //3) if everythin is ok send token in to client
    const token = signToken(user._id);

    // define cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    // send via response, browser cookies
    res.cookie("jwt", token, cookieOptions);

    return res.status(200).json({ status: "success", token, user });
  }
);
