import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";

//define user shape
export interface IUser {
  name: string;
  email: string;
  role: string;
  password: string;
  passwordConfirm: string | undefined;
  photo?: string;
  passwordChangedAt?: Date;
}

//define user document shape
export interface IUserDocument extends Document, IUser {
  correctPassword(
    inputPassword: string,
    userPassword: string
  ): Promise<boolean>;

  changedPasswordAfter(JWTTimestamp: number): Promise<boolean>;
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
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
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
    photo: {
      type: String,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8=",
    },
    passwordChangedAt: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (this: IUserDocument, next) {
  //if the passowrd  is has not been modify;
  if (!this.isModified("password")) return next();

  //encryptpassword when create new user
  this.password = await bcryptjs.hash(this.password, 12);

  //delete confirm  password, it is not necessary for save
  this.passwordConfirm = undefined;

  next();
});

//instance method in docs for compare passwords
userSchema.methods.correctPassword = async function (
  inputPassword: string,
  userPassword: string
) {
  return await bcryptjs.compare(inputPassword, userPassword);
};

//check password is changed after jwt token is issued.
userSchema.methods.changedPasswordAfter = function (
  this: IUserDocument,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = Math.trunc(
      (this.passwordChangedAt as Date).getTime() / 1000
    );
    console.log(JWTTimestamp, changedTimeStamp);
    return JWTTimestamp < changedTimeStamp; //100 <200 true
  }

  //false means not changed
  return false;
};

const User: Model<IUserDocument> = mongoose.model<IUserDocument, IUserModel>(
  "User",
  userSchema
);

export default User;
