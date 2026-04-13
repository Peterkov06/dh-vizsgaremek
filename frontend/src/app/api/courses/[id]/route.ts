import { NextRequest, NextResponse } from "next/server";
import { BASE_URL } from "../../auth/register/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const response = await fetch(`${BASE_URL}/courses/${id}`);

    if (!response.ok) {
      return new Response(null, { status: response.status });
    }

    return response;
  } catch (error) {
    console.error("Course fetch error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
