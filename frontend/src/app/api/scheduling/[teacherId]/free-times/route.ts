import { BASE_URL } from "@/app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teacherId: string }> },
) {
  try {
    const { teacherId } = await params;
    const cookies = request.headers.get("cookie") ?? "";
    const searchDate = request.nextUrl.searchParams.get("searchDate") ?? "";
    const LessonNumber = request.nextUrl.searchParams.get("LessonNumber") ?? "";
    const courseId = request.nextUrl.searchParams.get("courseId") ?? "";

    const response = await fetch(
      `${BASE_URL}/scheduling/${teacherId}/free-times?searchDate=${searchDate}&LessonNumber=${LessonNumber}&courseId=${courseId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          cookie: cookies,
        },
      },
    );

    return response;
  } catch (error) {
    console.error("Course fetch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
