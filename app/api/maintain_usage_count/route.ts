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

    // Check if 24 hours have passed since last reset
    const now = new Date();
    const lastResetAt = new Date(user.lastResetAt);

    if (now.getTime() - lastResetAt.getTime() > 24 * 60 * 60 * 1000) {
      console.log("24 hours passed, resetting usage count...");

      // Reset usage count based on tier
      if (user.tier === "Starter") user.usage_count = 3;
      else if (user.tier === "Pro") user.usage_count = 10;
      else if (user.tier === "Elite") user.usage_count = 20;

      user.lastResetAt = now;
      await user.save();
    }

    // Check the user's usage_count
    if (user.usage_count > -3) {
      // Decrement the usage_count
      user.usage_count -= 1;
      //await user.save();

      // Proceed with video analysis
      return NextResponse.json(
        {
          success: true,
          message: "Video analysis started",
          usage_count: user.usage_count,
        },
        { status: 200 }
      );
    } else {
      // Return an error if the usage limit is reached
      return NextResponse.json(
        {
          success: false,
          message: "Daily usage limit reached. Please upgrade your tier.",
          usage_count: user.usage_count,
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
