import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgon from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import userRouter from "../routes/userRouter";
import AppError from "../utils/appError";
import globalErrorHandler from "../controllers/errorController";
import path from "path";

const app = express();

if ((process.env.NODE_ENV as string) === "development") {
  app.use(morgon("dev"));
}

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());

//serving static files
app.use(express.static(path.join(__dirname, "/client/dist")));

//security best practices

//set security http hedeader
app.use(helmet());

//set rate limiting preventing too many request from one IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, //1hr
  message: "Too many requests from this IP, please try again in an hour!.",
});
app.use("/api", limiter);

//Routes
app.use("/api/v1/users", userRouter);

// Handle unhandle routes  request error
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!.`, 404)
  );
});

//global error handling middleware
app.use(globalErrorHandler);

export default app;
