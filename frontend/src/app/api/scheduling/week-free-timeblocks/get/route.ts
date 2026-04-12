import { BASE_URL } from "@/app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookies = request.headers.get("cookie") ?? "";
    const searchDate = request.nextUrl.searchParams.get("searchDate") ?? "";

    const response = await fetch(
      `${BASE_URL}/scheduling/week-free-timeblocks?searchDate=${searchDate}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          cookie: cookies,
        },
      },
    );
    console.log(response);

    return response;
  } catch (error) {
    console.error("Course fetch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
