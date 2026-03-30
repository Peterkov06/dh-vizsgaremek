import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../register/route";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(`${BASE_URL}/auth/me/settings`, {
      method: "GET",
      credentials: "include",
      headers: {
        cookie: cookies, // same as credentials: "include" but for server-side
      },
    });

    if (response.ok) {
      return response;
    }
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json(
      { message: "A bejelentkezés során hiba történt" },
      { status: 500 },
    );
  }
}
