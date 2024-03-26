import { Request, Response, NextFunction } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { promisify } from "util";
import crypto from "crypto";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import sendEmail from "../utils/email";
import User, { IUser, IUserDocument } from "../models/userModel";

//Note
declare module "express" {
  interface Request {
    user?: IUserDocument;
  }
}

const signToken = (id: ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      password,
      passwordConfirm,
      photo,
      passwordChangedAt,
    }: IUser = req.body;

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
      passwordChangedAt,
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

    return res.status(200).json({ status: "success", token, user });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1) Getting the token and check it's there
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return next(
        new AppError(
          "Your are not logged in!. Please log in to get access",
          401
        )
      );

    //2) validate token (verfication)
    // promisify jwt.verify
    const verifyToken = (
      token: string,
      secret: string,
      callback: jwt.VerifyCallback
    ) => {
      jwt.verify(token, secret, callback);
    };
    const verifyAsync = promisify(verifyToken);

    let decoded: string | Jwt | JwtPayload | undefined;
    try {
      decoded = await verifyAsync(token, process.env.JWT_SECRET as string);
      if (!decoded) {
        throw new Error("Unable to decode JWT");
      }
    } catch (error) {
      throw error;
    }

    //3)Check if user stil exists.

    let currentUser: IUserDocument | null = null;

    // Ensure 'decoded' is JwtPayload
    if (decoded && typeof decoded === "object" && "id" in decoded) {
      currentUser = await User.findById(decoded.id);
    }

    if (!currentUser)
      return next(
        new AppError(`The user belongs to that token does not exits.`, 401)
      );

    //4) check if user changed password after th jwt token was issured
    if (decoded && typeof decoded === "object" && "iat" in decoded) {
      const isChanged = await currentUser.changedPasswordAfter(
        decoded.iat as number
      );
      console.log(isChanged);
      if (isChanged) {
        return next(new AppError("User recently changed password.", 401));
      }
    }
    req.user = currentUser as IUserDocument;
    //Grand access to protected routes
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("Role", req.user?.role);
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(new AppError(`There is no user with email address.`, 404));

    //generated the random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //send it to user's email
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? submit a patch request with your new password and passwordConfir, to : ${resetURL}. \n If you didn't forgot password ignore this email.`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset Token (valid for 10 min)",
        message,
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          `There was and error sending the email. Try again later!`,
          500
        )
      );
    }
    return res.status(200).json({
      status: "success",
      message: "Token sent tto the email.",
    });
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //1) get user based one the reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpire: { $gt: Date.now() },
    });

    if (!user) return next(new AppError("Token is invalid or expired", 400));
    //2) if token has not expired , and there is user , set new password.

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpire = undefined;
    user.passwordResetToken = undefined;
    await user.save();

    //3) Update changePasswordAt property for user  (mongoose middleware)

    //4) Log the user in, and set JWT tokenn
    const token = signToken(user._id);
    res.status(200).json({ status: "success", token });
  }
);
