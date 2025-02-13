import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log('Received cookies:', req.headers.get('cookie'))
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NEXTAUTH_URL?.startsWith("https://") || process.env.NODE_ENV === "production",
  });

  console.log('Decoded token:', token)

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