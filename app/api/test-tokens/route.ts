import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // Remove the secureCookie option or set it based on the environment
    secureCookie: process.env.NODE_ENV === "production",
  });

  if (token) {
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(
      JSON.stringify({ error: "Invalid or missing token" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}