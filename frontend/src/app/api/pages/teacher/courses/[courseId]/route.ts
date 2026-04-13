import { BASE_URL } from "@/app/api/auth/register/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;

    const cookies = request.headers.get("cookie") ?? "";
    const response = await fetch(
      `${BASE_URL}/pages/teacher/courses/${courseId}/students`,
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
