import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect(); // Connect to the database

  try {
    // Parse the request body
    const requestData = await request.json();
    const { userId } = requestData;

    // Validate the userId
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch the user from the database
    const user = await UserModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Decrement the usage_count
    user.usage_count -= 1;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Usage count decremented",
        usage_count: user.usage_count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}