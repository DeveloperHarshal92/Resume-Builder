import { IUser } from "@/types/user.types";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";

interface UserDocument extends Omit<IUser, "_id">, Document {
  comparePassword: (candidatePassword: string) => boolean;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide an email"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    mobile: {
      type: String,
      minlength: [10, "Mobile number must be at least 10 digits long"],
      maxlength: [10, "Mobile number must be at most 10 digits long"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function (): void {
  if (!this.isModified("password")) return;
  this.password = bcrypt.hashSync(this.password, 10);
});

userSchema.methods.comparePassword = function (
  candidatePassword: string,
): boolean {
  return bcrypt.compareSync(candidatePassword, this.password);
};

const userModel = mongoose.model("users", userSchema);

export default userModel;
