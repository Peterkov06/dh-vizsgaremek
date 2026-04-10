import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../auth/register/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(`${BASE_URL}/scheduling/book-event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    console.log("i was here");
    return response;
  } catch (error) {
    console.error("Login error: ", error);
    return NextResponse.json(
      { message: "A bejelentkezés során hiba történt" },
      { status: 500 },
    );
  }
}
