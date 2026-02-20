import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../register/route";

export default async function GET(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token");

  if (!refreshToken) {
    return Response.json("Nincs frissítési token", { status: 401 });
  }

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "GET",
      headers: {
        Cookie: `refresh_token=${refreshToken.value}`,
      },
      credentials: "include",
    });

    const setCookie = response.headers.get("set-cookie");

    if (response.status === 204) {
      return new NextResponse(null, {
        status: response.status,
        headers: setCookie
          ? {
              "Set-Cookie": setCookie,
            }
          : {},
      });
    }
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json(
      { message: "A bejelentkezés során hiba történt" },
      { status: 500 },
    );
  }
}
