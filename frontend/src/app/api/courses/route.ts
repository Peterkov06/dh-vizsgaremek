import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../auth/register/route";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const response = await fetch(
      `${BASE_URL}/courses?${searchParams.toString()}`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", response.status, errorText);
      return NextResponse.json(
        { error: errorText },
        { status: response.status },
      );
    }

    return response;
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
