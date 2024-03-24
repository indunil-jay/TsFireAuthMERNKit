import dotenv from "dotenv";
import app from "./app";
import connectToMongoDB from "../utils/dbconnection";

dotenv.configDotenv({ path: "./.env" });

connectToMongoDB(process.env.MONGODB_CONNECTION as string);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app running on port ${port}...`));
