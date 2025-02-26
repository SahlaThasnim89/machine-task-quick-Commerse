import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";



const authRouter = ["/sign-In", "/sign-up"];
const protectedRoutes = ["/", "/"]; // Define protected routes

export async function middleware(req) {
  console.log("Middleware running...");

  const path = req.nextUrl.pathname;
  console.log(path,'pathsahla')
  // ("").startsWith
  // Check authentication token (NextAuth cookie handling)
  const isAuthenticated = !!(
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("next-auth.session-token")
  );
  console.log(isAuthenticated,'isAuthenticatedsahla')

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log(token,'tokensahla')

  // If the user is on an auth route but already logged in, redirect to dashboard
  if (authRouter.includes(path)) {
    if (isAuthenticated) return NextResponse.redirect(new URL("/", req.url));
    return NextResponse.next();
  }

  if (
    isAuthenticated &&
    token &&
    token.role === "customer" &&
    path.startsWith("/delivery")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }



  if(isAuthenticated&&token&&token.role !== "customer" &&path.startsWith("/customer")){
    return NextResponse.redirect(new URL("/delivery", req.url));
  }

  //   if (!authRouter.includes(path)) {
  //     if (!isAuthenticated) {
  //       return NextResponse.redirect(new URL("/auth/login", req.url))
  //     }
  //     return NextResponse.next()
  //   }

  return NextResponse.next();
}

// Configure matcher to apply middleware only to specific routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
