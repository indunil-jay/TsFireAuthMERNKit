import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgon from "morgan";
import userRouter from "../routes/userRouter";
import AppError from "../utils/appError";
import globalErrorHandler from "../controllers/errorController";

const app = express();

if ((process.env.NODE_ENV as string) === "development") {
  app.use(morgon("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());

//security best practices

app.use("/api/v1/users", userRouter);

// Handle unhandle routes  request error
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  //   res.status(404).json({
  //     status: "fail",
  //     message: `Can't find ${req.originalUrl} on this server!.`,
  //   });

  //   const err = new Error(`Can't find ${req.originalUrl} on this server!.`);
  //   err.status = "fail";
  //   err.statusCode = 404;

  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!.`, 404)
  );
});

//global error handling middleware
app.use(globalErrorHandler);

export default app;
