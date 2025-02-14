// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/dashboard/:path*", "/uploaded-video/:path*"]
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  console.log("token is here :",token);
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}