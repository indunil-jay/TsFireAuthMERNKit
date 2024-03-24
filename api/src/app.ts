import express from "express";
import cors from "cors";
import morgon from "morgan";
import userRouter from "../routes/userRouter";

const app = express();

if ((process.env.NODE_ENV as string) === "development") {
  app.use(morgon("dev"));
}
console.log(process.env.NODE_ENV);

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());

app.use("/api/v1/users", userRouter);

export default app;
