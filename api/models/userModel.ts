import mongoose, { Document, Model } from "mongoose";

//define user shape
export interface User {
  name: string;
  email: string;
  password: string;
}

//define user document shape
export interface UserDocument extends Document, User {
  createdAt: Date;
  updatedAt: Date;
}

//define user model shape
interface UserModel extends Model<UserDocument> {}

const userSchema = new mongoose.Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: [true, "Please tell us yourname."],
    },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: 8,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User: Model<UserDocument> = mongoose.model<UserDocument, UserModel>(
  "User",
  userSchema
);

export default User;
