import { BASE_URL } from "@/app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { wallId: string; postId: string } },
) {
  try {
    const { wallId, postId } = await params;

    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(`${BASE_URL}/tutoring/${wallId}/${postId}`, {
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
