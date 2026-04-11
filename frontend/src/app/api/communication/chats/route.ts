import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../auth/register/route";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(`${BASE_URL}/communication/chats`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies,
      },
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
