import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  // Debugging: Log received authorization header
  // console.log("Received Authorization Header:", authHeader);

  // Ensure header is in "Bearer <TOKEN>" format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized - Missing Token" }, { status: 401 });
  }

  // Extract token from "Bearer <TOKEN>"
  const token = authHeader.split(" ")[1];
  const expectedToken = process.env.NEXT_PUBLIC_API_SECRET_TOKEN;
  

  if (!token || token !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized - Invalid Token" }, { status: 401 });
  }

  return NextResponse.next();
}

// Apply middleware only to API routes
export const config = {
  matcher: "/api/:path*", // Protects all `/api/` routes
};
