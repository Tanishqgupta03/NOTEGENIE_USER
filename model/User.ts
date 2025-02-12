import mongoose, { Document, Schema } from "mongoose";

// Define the User interface
interface IUser extends Document {
  name?: string;
  username: string;
  email: string;
  password: string;
  role: string;
  userType: string;
  tier: "Starter" | "Pro" | "Elite";
  usage_count: number;
  lastResetAt: Date; // New field to track when usage was last reset
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["admin", "user"] },
    userType: { type: String, required: true, enum: ["professional", "personal"], default: "personal" },
    tier: { type: String, required: true, enum: ["Starter", "Pro", "Elite"], default: "Starter" },
    usage_count: { type: Number, required: true, default: 0 }, // Initialized at 0
    lastResetAt: { type: Date, default: Date.now }, // Track when usage was last reset
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Middleware: Set default `usage_count` based on `tier` when a new user is created
userSchema.pre<IUser>("save", function (next) {
  if (this.isNew) {
    if (this.tier === "Starter") this.usage_count = 3;
    else if (this.tier === "Pro") this.usage_count = 10;
    else if (this.tier === "Elite") this.usage_count = 20;
  }
  next();
});

// Create and export the User model
const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
