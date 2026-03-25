import { BASE_URL } from "@/app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";

    const response = await fetch(`${BASE_URL}/pages/student/homepage`, {
      method: "GET",
      credentials: "include",
      headers: {
        cookie: cookies, // same as credentials: "include" but for server-side
      },
    });

    console.log(response);

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
