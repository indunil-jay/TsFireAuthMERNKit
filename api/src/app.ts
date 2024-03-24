import express from "express";
const app = express();
import userRouter from "../routes/userRouter";

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/v1/user", userRouter);

export default app;
