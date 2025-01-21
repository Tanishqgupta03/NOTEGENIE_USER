import mongoose, { Document, Schema } from "mongoose";

// Define the User interface
interface IUser extends Document {
  name?: string; // Optional field
  username: string; // Unique username (mandatory)
  email: string; // Unique email (mandatory)
  password: string; // Hashed password (mandatory)
  role: string; // e.g., "admin", "user"
  userType: string; // "professional" or "personal"
  verifyCode?: string; // Verification code
  verifyCodeExpiry?: Date; // Verification code expiry
  isVerified: boolean; // Account verification status
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: false }, // Optional field
    username: { type: String, required: true, unique: true }, // Mandatory
    email: { type: String, required: true, unique: true }, // Mandatory
    password: { type: String, required: true }, // Mandatory
    role: { type: String, default: "user", enum: ["admin", "user"] }, // Default role is "user"
    userType: {
      type: String,
      required: true,
      enum: ["professional", "personal"], // Only allow these two values
      default: "personal", // Default is "personal"
    },
    verifyCode: { type: String }, // Verification code
    verifyCodeExpiry: { type: Date }, // Verification code expiry
    isVerified: { type: Boolean, default: false }, // Default is false
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

// Create and export the User model
const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;