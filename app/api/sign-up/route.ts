import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";

// Define the shape of the request body
interface SignUpRequest {
  name?: string; // Optional field
  username: string;
  email: string;
  password: string;
  userType: "personal" | "professional"; // Mandatory field
}

// Export the POST function as a named export
export async function POST(request: Request) {
  await dbConnect(); // Connect to the database

  try {
    // Parse the request body
    const { name, username, email, password, userType }: SignUpRequest =
      await request.json();

    // Check if a verified user with the same username already exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if a user with the same email already exists
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exists with this email.",
          },
          { status: 400 }
        );
      } else {
        // Update the existing unverified user's details
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.name = name;
        existingUserByEmail.username = username;
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        existingUserByEmail.userType = userType;
        existingUserByEmail.tier = "Starter"; // Ensure default tier is set
        existingUserByEmail.updatedAt = new Date(); // Update the updatedAt field
        await existingUserByEmail.save();
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        name,
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        role: "user", // Default role
        userType, // Set userType from the request
        tier: "Starter", // Default tier
      });


      console.log("newUser : ",newUser);

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
