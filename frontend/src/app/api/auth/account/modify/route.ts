import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../register/route";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function PATCH(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";
    const body = await request.json();
    const response = await fetch(`${BASE_URL}/auth/account/modify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies,
      },

      body: JSON.stringify(body),
      credentials: "include",
    });

    return response;
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json(
      { message: "A bejelentkezés során hiba történt" },
      { status: 500 },
    );
  }
}
