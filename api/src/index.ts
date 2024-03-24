import dotenv from "dotenv";
import app from "./app";
import connectToMongoDB from "../utils/dbconnection";

dotenv.configDotenv({ path: "./.env" });

// uncaught execeptions all errors or bugs that occurs synchronous code that are not handle called uncaught execption.
process.on("uncaughtException", (error: Error) => {
  console.log(error);
  console.log("uncaughtException!! app is shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

connectToMongoDB(process.env.MONGODB_CONNECTION as string);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`app running on port ${port}...`)
);

//unhandle promise rejection handling (if somewhere in application exits unhadle promise rejection it will catch)
process.on("unhandledRejection", (error: Error) => {
  console.log(error.name, error.message);
  console.log("unhandledRejection!! app is shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
