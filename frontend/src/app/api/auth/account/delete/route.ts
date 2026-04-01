import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../register/route";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export async function DELETE(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(`${BASE_URL}/auth/account/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies,
      },
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
