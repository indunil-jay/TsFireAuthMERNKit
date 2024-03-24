import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.configDotenv({ path: "./.env" });

mongoose
  .connect(process.env.MONGODB_CONNECTION as string)
  .then(() => console.log("db connection successfull..."))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app running on port ${port}...`));
