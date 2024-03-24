import mongoose from "mongoose";

const connectToMongoDB = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to mongoDB database....");
  } catch (error) {
    console.log(`Error 🚨 :`, error);
  }
};

export default connectToMongoDB;
