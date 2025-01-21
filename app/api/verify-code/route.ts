import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

// Define the shape of the request body
interface VerifyRequest {
  username: string;
  verifyCode: string;
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse the request body
    const { username, verifyCode }: VerifyRequest = await request.json();

    console.log("username:", username);
    console.log("verifyCode:", verifyCode);

    // Decode the username (in case it's URL-encoded)
    const decodedUsername = decodeURIComponent(username);
    console.log("decodedUsername:", decodedUsername);

    // Find the user in the database
    const user = await UserModel.findOne({ username: decodedUsername });

    console.log("user:", user);

    // If user is not found, return an error
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Check if the verification code is valid and not expired
    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Mark the user as verified
      user.isVerified = true;
      await user.save();

      return NextResponse.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      // If the code is expired
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    } else {
      // If the code is invalid
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}