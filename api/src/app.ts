import express from "express";
import cors from "cors";
import morgon from "morgan";
import userRouter from "../routes/userRouter";

const app = express();

if ((process.env.NODE_ENV as string) === "development") {
  app.use(morgon("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());

app.use("/api/v1/users", userRouter);

// Handle unhandle routes  request error
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!.`,
  });
});

export default app;
