import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../register/route";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const setCookie = response.headers.get("set-cookie");

    if (response.status === 204)
    {
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
