import { BASE_URL } from "@/app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } },
) {
  try {
    const { chatId } = await params;
    const body = await request.json();
    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(`${BASE_URL}/communication/chats/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies,
      },
      credentials: "include",
      body: JSON.stringify(body),
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
