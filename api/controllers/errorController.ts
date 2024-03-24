import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { CastError } from "mongoose";

const handleCastErrorDB = (err: CastError) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}, Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

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
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    if (
      err.name === "CastError" ||
      err.code === 11000 ||
      err.name === "ValidationError"
    ) {
      err.isOperational = true;
    }
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: unknown = err;

    if (err.name === "CastError") {
      error = err;
      const castError = error as CastError;
      const handleError = handleCastErrorDB(castError);
      return sendErrorProduction(handleError, res);
    }

    if (err.code === 11000) {
      error = err;
      const handleError = handleDuplicateFieldsDB(err);
      return sendErrorProduction(handleError, res);
    }

    if (err.name === "ValidationError") {
      error = err;
      const handleError = handleValidationErrorDB(err);
      return sendErrorProduction(handleError, res);
    }
  }
};

export default globalErrorHandler;
