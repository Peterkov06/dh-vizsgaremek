import { BASE_URL } from "@/app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wallId: string }> },
) {
  try {
    const { wallId } = await params;
    const cookies = request.headers.get("cookie") ?? "";

    const response = await fetch(`${BASE_URL}/pages/student/walls/${wallId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        cookie: cookies,
      },
    });

    return response;
  } catch (error) {
    console.error("Course fetch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
