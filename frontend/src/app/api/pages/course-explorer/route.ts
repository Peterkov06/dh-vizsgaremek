import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../auth/register/route";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BASE_URL}/pages/course-explorer`, {
      method: "GET",
      credentials: "include",
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
