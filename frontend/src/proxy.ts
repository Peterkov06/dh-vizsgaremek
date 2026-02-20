import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "./app/api/auth/register/route";

export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");
  const path = request.nextUrl.pathname;

  if (path.startsWith("/login") || path.startsWith("/register")) {
    return NextResponse.next();
  }

  if (
    path.startsWith("/student") ||
    path.startsWith("/teacher") ||
    path.startsWith("/shared")
  ) {
    if (!refreshToken && !accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (accessToken) {
      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          method: "GET",
          headers: {
            Cookie: `access_token=${accessToken.value}`,
          },
          cache: "no-store",
          credentials: "include",
        });
        if (response.ok) {
          return NextResponse.next();
        }
      } catch (error) {
        console.error("Hibás access token: ", error);
      }
    }

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "GET",
          headers: {
            Cookie: `refresh_token=${refreshToken.value}`,
          },
          credentials: "include",
        });

        if (refreshResponse.ok) {
          const setCookie = refreshResponse.headers.get("set-cookie");
          const response = NextResponse.next();

          if (setCookie) {
            response.headers.set("Set-Cookie", setCookie);
          }
          return response;
        }
      } catch (error) {
        console.error("Login error: ", error);
      }
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return await NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/teacher/:path*",
    "/shared/:path*",
    "/login",
    "/register",
  ],
};
