import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "./app/api/auth/register/route";

export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");
  const path = request.nextUrl.pathname;

  if (path.startsWith("/login") || path.startsWith("/register")) {
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/home")) {
    if (!refreshToken && !accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (accessToken) {
      try {
        const response = await fetch(`${BASE_URL}/auth/validate`, {
          method: "GET",
          headers: {
            Cookie: `access_token=${accessToken.value}`,
          },
          cache: "no-store",
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
        console.error("Bejelentkezés hiba: ", error);
      }
    }
    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/home", "/login", "/register"],
};
