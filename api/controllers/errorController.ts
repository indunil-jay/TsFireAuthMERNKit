import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

const sendErrorDev = (err: AppError, res: Response) => {
  //Operational , trusted errors: Send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    //Programming error or other unknown errors (better not leak details to the client.)
    console.error("Error 🚨", err);
    res
      .status(500)
      .json({ status: "error", message: "Something went very wrong!." });
  }
};

const sendErrorProduction = (err: AppError, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === "production") {
    sendErrorProduction(err, res);
  }
};

export default globalErrorHandler;
