import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/api") ||
    pathname === "/sign-in"
  ) {
    return NextResponse.next();
  }

  // Fetch token from the custom API
  const apiUrl = new URL("/api/test-tokens", req.url).toString();
  let token: string | undefined;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Cookie: req.headers.get("cookie") || "", // Pass cookies for token validation
      },
    });

    if (response.ok) {
      const data = await response.json();
      token = data.token;
    }
  } catch (err: unknown) {
   // console.error("Middleware: Error fetching token:", err);
  }

 // console.log("Middleware: Token fetched from API:", token);

  // Redirect to login if trying to access protected routes without a token
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/uploaded-video")) && !token) {
    console.log("Middleware: Redirecting to sign-in");
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }  

  // Allow authenticated users
  console.log("Middleware: User authenticated");
  return NextResponse.next();
}