import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

//define user shape
export interface IUser {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string | undefined;
}

//define user document shape
export interface IUserDocument extends Document, IUser {
  createdAt: Date;
  updatedAt: Date;
}

//define user model shape
export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>(
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
      validate: [validator.isEmail, "Please Provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please provide a password."],
      minlength: 8,
      // validate: {
      //   validator: function (this: IUser, el: string) {
      //     //this validation method only work .onSave() and .create()
      //     return el === this.password;
      //   },
      //   message: "passwords are not matching. Please enter matching password.",
      // },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (this: IUserDocument, next) {
  //if password is modified then return;
  if (!this.isModified("password")) return next();

  //encryptpassword when create new user
  this.password = await bcryptjs.hash(this.password, 12);

  //delete confirm  password, it is not necessary for save
  this.passwordConfirm = undefined;

  next();
});

const User: Model<IUserDocument> = mongoose.model<IUserDocument, IUserModel>(
  "User",
  userSchema
);

export default User;
