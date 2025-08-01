import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    }
    ,{
  callbacks: {
    authorized: ({ token, req }: { token?: any; req: any }) => {
      const { pathname } = req.nextUrl;
      if (
        pathname.startsWith("/api/auth") ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/" ||
        pathname === "/api/videos"
      ) {
        return true;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*"],
};